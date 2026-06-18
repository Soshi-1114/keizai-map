import generated from "./data.daily.generated.json";

/**
 * 日次系列のヘルパー。data.daily.generated.json を単一ソースとし、
 * MarketCard（USD/JPY・Nikkei）の 1D/1W/1M レンジ表示で参照される。
 *
 * 取得は週次バッチ（FRED API）。本ファイルは UI 側の薄いラッパー。
 */

export interface DailyPoint {
  /** "YYYY-MM-DD" */
  date: string;
  value: number;
}

interface DailyPayload {
  generatedAt: string;
  fx: DailyPoint[];
  nikkei: DailyPoint[];
}

const PAYLOAD = generated as DailyPayload;

/** 日次データの生成タイムスタンプ（"YYYY-MM-DD"） */
export const DAILY_GENERATED_AT: string = PAYLOAD.generatedAt;

/** USD/JPY 日次（FRED DEXJPUS） */
export const FX_DAILY: DailyPoint[] = PAYLOAD.fx ?? [];

/** Nikkei 225 日次（FRED NIKKEI225 終値） */
export const NIKKEI_DAILY: DailyPoint[] = PAYLOAD.nikkei ?? [];

/** "YYYY-MM-DD" → "YYYY年M月D日" */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${y}年${parseInt(m, 10)}月${parseInt(d, 10)}日`;
}

/** 末尾の最新ポイント */
export function latestDailyPoint(series: DailyPoint[]): DailyPoint | null {
  return series.length > 0 ? series[series.length - 1] : null;
}

/** 末尾から N 件を切り出す */
export function tailDaily(series: DailyPoint[], n: number): DailyPoint[] {
  if (series.length <= n) return series;
  return series.slice(series.length - n);
}

/** 最新値と N 日前との差分（絶対値）。基準が無ければ null */
export function diffFromLatest(series: DailyPoint[], daysBack: number): number | null {
  const n = series.length;
  if (n === 0 || daysBack <= 0 || daysBack >= n) return null;
  const last = series[n - 1];
  const prev = series[n - 1 - daysBack];
  if (!last || !prev) return null;
  return last.value - prev.value;
}

/** 最新値と N 日前との変化率（%）。基準が無ければ null */
export function pctChangeFromLatest(series: DailyPoint[], daysBack: number): number | null {
  const n = series.length;
  if (n === 0 || daysBack <= 0 || daysBack >= n) return null;
  const last = series[n - 1];
  const prev = series[n - 1 - daysBack];
  if (!last || !prev || prev.value === 0) return null;
  return ((last.value - prev.value) / prev.value) * 100;
}
