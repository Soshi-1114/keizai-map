import { FX_DAILY, NIKKEI_DAILY, type DailyPoint } from "./daily";
import { FX_MONTHLY, NIKKEI_MONTHLY, type MonthlyPoint } from "./monthly";
import { RAW_DATA } from "./data";

/**
 * MarketCard 用の設定とデータアダプタ。
 *
 * 設計方針: 1つの汎用コンポーネント（MarketCard）が複数指標（USD/JPY, Nikkei…）
 * を扱えるよう、指標ごとに MarketCardConfig + データ参照関数を定義。
 * 表示レンジ（1W / 1M / 3M / 1Y / 2Y / Max）に応じて、日次・月次・年次の
 * いずれかから値を切り出す。
 */

export const MARKET_RANGES = ["1W", "1M", "3M", "1Y", "2Y", "Max"] as const;
export type MarketRange = (typeof MARKET_RANGES)[number];

export type MarketGranularity = "daily" | "monthly" | "annual";

/** Recharts に渡す共通形 */
export interface MarketPoint {
  /** 表示用ラベル（"2026/06/12" / "2026年6月" / "2025"） */
  label: string;
  /** 値（円・指数など） */
  value: number;
  /** 内部 key（ツールチップで使う詳細ラベル） */
  detail: string;
}

export interface MarketSeries {
  granularity: MarketGranularity;
  points: MarketPoint[];
}

export interface MarketCardConfig {
  /** "fx" | "nikkei" など。aria/CSS 識別に使う */
  key: string;
  /** カード見出し（例: "USD/JPY"） */
  title: string;
  /** サブテキスト（例: "米ドル円相場"） */
  subtitle: string;
  /** 表示単位（"円", ""） */
  unit: string;
  /** 値の小数点桁 */
  decimals: number;
  /** 線色 */
  color: string;
  /** 出典注記（チャート下に表示） */
  sourceLabel: string;
  /** どの指標を表示するか（daily/monthly/annual の参照を切り替え） */
  indicator: "fx" | "nikkei";
}

export const FX_MARKET_CONFIG: MarketCardConfig = {
  key: "fx",
  title: "USD/JPY",
  subtitle: "米ドル円相場",
  unit: "円",
  decimals: 2,
  color: "#0EA5E9",
  sourceLabel: "出典: FRED DEXJPUS（NY 正午仲値・FRB NY）",
  indicator: "fx",
};

export const NIKKEI_MARKET_CONFIG: MarketCardConfig = {
  key: "nikkei",
  title: "日経平均株価",
  subtitle: "Nikkei 225",
  unit: "円",
  decimals: 0,
  color: "#DC2626",
  sourceLabel: "出典: FRED NIKKEI225（東証 終値）",
  indicator: "nikkei",
};

/** "YYYY-MM-DD" → "M/D" */
function shortDateLabel(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${parseInt(m, 10)}/${parseInt(d, 10)}`;
}

/** "YYYY-MM-DD" → "YYYY年M月D日" */
function longDateLabel(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${y}年${parseInt(m, 10)}月${parseInt(d, 10)}日`;
}

/** "YYYY-MM" → "M月" */
function shortMonthLabel(ym: string): string {
  const [, m] = ym.split("-");
  return `${parseInt(m, 10)}月`;
}

/** "YYYY-MM" → "YYYY年M月" */
function longMonthLabel(ym: string): string {
  const [y, m] = ym.split("-");
  return `${y}年${parseInt(m, 10)}月`;
}

function dailySource(indicator: "fx" | "nikkei"): DailyPoint[] {
  return indicator === "fx" ? FX_DAILY : NIKKEI_DAILY;
}

function monthlySource(indicator: "fx" | "nikkei"): MonthlyPoint[] {
  return indicator === "fx" ? FX_MONTHLY : NIKKEI_MONTHLY;
}

function annualSource(indicator: "fx" | "nikkei"): { year: number; value: number }[] {
  const out: { year: number; value: number }[] = [];
  for (const d of RAW_DATA) {
    // nikkei は 1990=100 リベース指数で main chart 比較用なので、Max には
    // 実値（円）の nikkeiYen を使う。fx は元から実値（円/USD）。
    const v = indicator === "nikkei" ? d.nikkeiYen : d.fx;
    if (typeof v === "number" && Number.isFinite(v)) out.push({ year: d.year, value: v });
  }
  return out;
}

/** 日次配列の末尾 n 件を MarketPoint に変換 */
function tailDailyAsPoints(series: DailyPoint[], n: number): MarketPoint[] {
  const slice = series.length > n ? series.slice(series.length - n) : series;
  return slice.map(p => ({
    label: shortDateLabel(p.date),
    detail: longDateLabel(p.date),
    value: p.value,
  }));
}

/** 月次配列の末尾 n 件を MarketPoint に変換 */
function tailMonthlyAsPoints(series: MonthlyPoint[], n: number): MarketPoint[] {
  const slice = series.length > n ? series.slice(series.length - n) : series;
  return slice.map(p => ({
    label: shortMonthLabel(p.ym),
    detail: longMonthLabel(p.ym),
    value: p.value,
  }));
}

/** 年次配列を MarketPoint に変換 */
function annualAsPoints(series: { year: number; value: number }[]): MarketPoint[] {
  return series.map(p => ({
    label: String(p.year),
    detail: `${p.year}年（年平均）`,
    value: p.value,
  }));
}

/**
 * 設定とレンジから表示用シリーズを返す。
 * データ未取得（バッチ未実行）の場合は points 空配列。
 */
export function selectMarketSeries(config: MarketCardConfig, range: MarketRange): MarketSeries {
  switch (range) {
    case "1W":
      return { granularity: "daily", points: tailDailyAsPoints(dailySource(config.indicator), 7) };
    case "1M":
      return { granularity: "daily", points: tailDailyAsPoints(dailySource(config.indicator), 30) };
    case "3M":
      // FX_DAILY は約 90 日（営業日のみで ~65 件）。全件使用。
      return { granularity: "daily", points: tailDailyAsPoints(dailySource(config.indicator), 90) };
    case "1Y":
      return { granularity: "monthly", points: tailMonthlyAsPoints(monthlySource(config.indicator), 12) };
    case "2Y":
      return { granularity: "monthly", points: tailMonthlyAsPoints(monthlySource(config.indicator), 24) };
    case "Max":
      return { granularity: "annual", points: annualAsPoints(annualSource(config.indicator)) };
  }
}

/** レンジに対応する「直近の変化」ラベル */
export function deltaLabelForRange(range: MarketRange): string {
  switch (range) {
    case "1W":
    case "1M":
    case "3M":
      return "前日比";
    case "1Y":
    case "2Y":
      return "前月比";
    case "Max":
      return "前年比";
  }
}

/** レンジに対応する「最新値の時点」表現 */
export function granularityLabel(g: MarketGranularity): string {
  return g === "daily" ? "日次" : g === "monthly" ? "月平均" : "年平均";
}

/** 値を表示用にフォーマット（小数桁・3桁区切り） */
export function formatMarketValue(value: number, decimals: number): string {
  return value.toLocaleString("ja-JP", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** 符号付き差分（絶対値）。基準なしは null */
export function deltaFromLatest(points: MarketPoint[]): number | null {
  if (points.length < 2) return null;
  const last = points[points.length - 1];
  const prev = points[points.length - 2];
  return last.value - prev.value;
}

/** 符号付き変化率（%）。基準なしは null */
export function pctChangeFromLatest(points: MarketPoint[]): number | null {
  if (points.length < 2) return null;
  const last = points[points.length - 1];
  const prev = points[points.length - 2];
  if (prev.value === 0) return null;
  return ((last.value - prev.value) / prev.value) * 100;
}
