import type { DataPoint, IndicatorKey, EventCategory } from "./types";
import { DATA_YEARS } from "./constants";

const ALL_INDICATOR_KEYS_PLACEHOLDER: IndicatorKey[] = [
  "wage", "cpi", "tax", "fx", "nikkei", "housing", "debt", "births", "insurance",
];
const ALL_CATEGORIES: EventCategory[] = ["税制", "経済", "経済政策"];

/** 選択期間のデータをもとに自動解説文を生成 */
export function generateNarrative(data: DataPoint[]): string {
  if (data.length < 2) return "";
  const s = data[0];
  const e = data[data.length - 1];
  const duration = e.year - s.year;

  const pct = (end: number, start: number) => ((end - start) / start) * 100;
  const wagePct = pct(e.wage, s.wage);
  const cpiPct  = pct(e.cpi,  s.cpi);
  const taxPct  = pct(e.tax,  s.tax);
  const fxPct   = pct(e.fx,   s.fx);

  const wageStr = wagePct >  2 ? `${wagePct.toFixed(1)}%上昇`
                : wagePct < -2 ? `${Math.abs(wagePct).toFixed(1)}%下落`
                : "ほぼ横ばい";
  const cpiStr  = cpiPct >  3 ? `${cpiPct.toFixed(1)}%上昇`
                : cpiPct < -2 ? `${Math.abs(cpiPct).toFixed(1)}%低下`
                : "安定";

  const parts: string[] = [];

  if (wagePct < 0 && cpiPct > 5) {
    parts.push(
      `${duration}年間で実質賃金は${wageStr}ですが、物価は${cpiStr}しました。実質的な購買力は低下しています。`,
    );
  } else if (wagePct > 5 && cpiPct < 3) {
    parts.push(
      `${duration}年間で実質賃金は${wageStr}し、物価上昇を上回る所得増加となっています。`,
    );
  } else {
    parts.push(`${duration}年間で実質賃金は${wageStr}、物価は${cpiStr}の期間です。`);
  }

  if (Math.abs(taxPct) > 20) {
    const dir = taxPct > 0 ? "増加" : "減少";
    parts.push(`税収は${Math.abs(taxPct).toFixed(0)}%${dir}（${s.tax.toFixed(1)}→${e.tax.toFixed(1)}兆円）。`);
  }

  if (Math.abs(fxPct) > 15) {
    const dir = fxPct > 0 ? "円安が進行" : "円高が進行";
    parts.push(`ドル円は${Math.abs(fxPct).toFixed(0)}%変動し${dir}（${s.fx.toFixed(0)}→${e.fx.toFixed(0)}円）。`);
  }

  return parts.join("　");
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
  if (!param) return allKeys;
  const keys = param.split(",").filter(k => allKeys.includes(k as IndicatorKey)) as IndicatorKey[];
  return keys.length > 0 ? keys : allKeys;
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
