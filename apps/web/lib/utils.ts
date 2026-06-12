import type { DataPoint, IndicatorKey, EventCategory } from "./types";
import { DATA_YEARS } from "./constants";

const ALL_INDICATOR_KEYS_PLACEHOLDER: IndicatorKey[] = [
  "wage", "cpi", "tax", "fx", "nikkei", "housing", "debt", "births", "insurance",
];
/** 初回起動時のデフォルト指標。初心者が読みやすい 2 指標に絞る。 */
export const DEFAULT_INDICATORS: IndicatorKey[] = ["wage", "cpi"];
const ALL_CATEGORIES: EventCategory[] = ["税制", "経済", "経済政策"];

/** 期間長カテゴリ */
type DurationBand = "single" | "short" | "medium" | "long";

function classifyDuration(years: number): DurationBand {
  if (years <= 1) return "single";
  if (years <= 5) return "short";
  if (years <= 15) return "medium";
  return "long";
}

/** 期間長に応じた接頭句 */
function durationPrefix(years: number, band: DurationBand, fromYear: number, toYear: number): string {
  switch (band) {
    case "single":
      return `${fromYear}年単年では`;
    case "short":
      return `${years}年間（${fromYear}→${toYear}）の短期では`;
    case "medium":
      return `${years}年間（${fromYear}→${toYear}）で`;
    case "long":
      return `${years}年間（${fromYear}→${toYear}）の長期で見ると`;
  }
}

/** 閾値も期間長に応じて調整（短期は小さい変動でも有意、長期はノイズを除く） */
function thresholdsFor(band: DurationBand) {
  switch (band) {
    case "single":  return { wage: 0.5, cpi: 0.5, tax: 5,  fx: 5  };
    case "short":   return { wage: 1,   cpi: 1.5, tax: 10, fx: 8  };
    case "medium":  return { wage: 2,   cpi: 3,   tax: 15, fx: 12 };
    case "long":    return { wage: 3,   cpi: 5,   tax: 25, fx: 20 };
  }
}

export interface Narrative {
  /** 段落ごとの説明文。UIで <p> × n として描画 */
  paragraphs: string[];
  /** 「読み解きの一文」。複数指標の関係から導かれる結論。UIで強調表示 */
  insight: string | null;
}

/** 段落と insight から人間可読の単一文字列を作る（互換用 / a11y / debug） */
export function narrativeToText(n: Narrative): string {
  const all = [...n.paragraphs];
  if (n.insight) all.push(n.insight);
  return all.join(" ");
}

/** 選択期間のデータをもとに自動解説文を生成 */
export function generateNarrative(data: DataPoint[]): Narrative {
  if (data.length < 2) return { paragraphs: [], insight: null };
  const s = data[0];
  const e = data[data.length - 1];
  const duration = e.year - s.year;
  const band = classifyDuration(duration);
  const thr = thresholdsFor(band);

  const pct = (end: number, start: number) => ((end - start) / start) * 100;
  const wagePct = pct(e.wage, s.wage);
  const cpiPct  = pct(e.cpi,  s.cpi);
  const taxPct  = pct(e.tax,  s.tax);
  const fxPct   = pct(e.fx,   s.fx);

  const wageStr = wagePct >  thr.wage ? `${wagePct.toFixed(1)}%上昇`
                : wagePct < -thr.wage ? `${Math.abs(wagePct).toFixed(1)}%下落`
                : "ほぼ横ばい";
  const cpiStr  = cpiPct >  thr.cpi ? `${cpiPct.toFixed(1)}%上昇`
                : cpiPct < -thr.cpi ? `${Math.abs(cpiPct).toFixed(1)}%低下`
                : "安定";

  const paragraphs: string[] = [];
  const prefix = durationPrefix(duration, band, s.year, e.year);

  // 単年の場合は変化を語らず現在値ベースの紹介
  if (band === "single") {
    paragraphs.push(
      `${prefix}実質賃金 ${s.wage.toFixed(1)}（1990=100）、物価 ${s.cpi.toFixed(1)}、税収 ${s.tax.toFixed(1)}兆円、ドル円 ${s.fx.toFixed(1)}円という状況です。`,
    );
    return { paragraphs, insight: null };
  }

  if (wagePct < 0 && cpiPct > thr.cpi) {
    paragraphs.push(
      `${prefix}実質賃金は${wageStr}、物価は${cpiStr}しました。実質的な購買力は低下しています。`,
    );
  } else if (wagePct > thr.wage && cpiPct < thr.cpi) {
    paragraphs.push(
      `${prefix}実質賃金は${wageStr}し、物価上昇を上回る所得増加となっています。`,
    );
  } else {
    paragraphs.push(`${prefix}実質賃金は${wageStr}、物価は${cpiStr}でした。`);
  }

  if (Math.abs(taxPct) > thr.tax) {
    const dir = taxPct > 0 ? "増加" : "減少";
    paragraphs.push(`税収は${Math.abs(taxPct).toFixed(0)}%${dir}（${s.tax.toFixed(1)}→${e.tax.toFixed(1)}兆円）。`);
  }

  if (Math.abs(fxPct) > thr.fx) {
    const dir = fxPct > 0 ? "円安が進行" : "円高が進行";
    paragraphs.push(`ドル円は${Math.abs(fxPct).toFixed(0)}%変動し${dir}（${s.fx.toFixed(0)}→${e.fx.toFixed(0)}円）。`);
  }

  // 長期では年率も追加
  if (band === "long") {
    const annualCpi = ((1 + cpiPct / 100) ** (1 / duration) - 1) * 100;
    paragraphs.push(`物価上昇は年率 約${annualCpi.toFixed(2)}% に相当します。`);
  }

  return { paragraphs, insight: buildInsight({ wagePct, cpiPct, taxPct, fxPct, thr }) };
}

/** 複数指標の関係から「だから何？」の一文を導く。優先順位の高い1つだけ採用。 */
function buildInsight(args: {
  wagePct: number;
  cpiPct: number;
  taxPct: number;
  fxPct: number;
  thr: { wage: number; cpi: number; tax: number; fx: number };
}): string | null {
  const { wagePct, cpiPct, taxPct, fxPct, thr } = args;
  // 1. 名目所得が増えていても実質購買力は低下
  if (wagePct < 0 && cpiPct > thr.cpi) {
    const loss = Math.abs(wagePct) + Math.abs(cpiPct);
    return `→ 名目の所得が増えても、物価上昇で実質購買力は約${loss.toFixed(1)}%低下している計算になります。`;
  }
  // 2. 賃金停滞 + 税収増 = 個人所得が追いついていない
  if (Math.abs(wagePct) < thr.wage && taxPct > thr.tax) {
    return `→ 国の歳入は増えていますが、個人の実質賃金は追いついていません。`;
  }
  // 3. 大幅円安 + 物価上昇 = 輸入インフレ
  if (fxPct > thr.fx && cpiPct > thr.cpi) {
    return `→ 円安と物価上昇が同時に進み、輸入物価を通じて家計を圧迫しています。`;
  }
  // 4. 賃金上昇が物価上昇を上回る = 実質的にプラス
  if (wagePct > thr.wage && cpiPct < thr.cpi) {
    return `→ 物価上昇を上回る所得増加で、生活水準は改善傾向にあります。`;
  }
  return null;
}

export function parseRange(param: string | null): [number, number] {
  if (!param) return [DATA_YEARS.MIN, DATA_YEARS.MAX];
  const [s, e] = param.split(",").map(Number);
  if (s >= DATA_YEARS.MIN && e <= DATA_YEARS.MAX && s < e) return [s, e];
  return [DATA_YEARS.MIN, DATA_YEARS.MAX];
}

export function parseIndicators(
  param: string | null,
  allKeys: IndicatorKey[] = ALL_INDICATOR_KEYS_PLACEHOLDER,
): IndicatorKey[] {
  // URL クエリ未指定時はデフォルト 2 指標（賃金+物価）に絞る
  if (!param) return DEFAULT_INDICATORS.filter(k => allKeys.includes(k));
  const keys = param.split(",").filter(k => allKeys.includes(k as IndicatorKey)) as IndicatorKey[];
  return keys.length > 0 ? keys : DEFAULT_INDICATORS.filter(k => allKeys.includes(k));
}

export function parseCategories(param: string | null): EventCategory[] {
  if (!param) return [...ALL_CATEGORIES];
  const cats = param.split(",").filter(c => ALL_CATEGORIES.includes(c as EventCategory)) as EventCategory[];
  return cats.length > 0 ? cats : [...ALL_CATEGORIES];
}

export function formatUpdatedAt(ym: string): string {
  const [y, m] = ym.split("-");
  if (!y || !m) return ym;
  return `${y}年${parseInt(m, 10)}月`;
}
