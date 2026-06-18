import generated from "./data.monthly.generated.json";

/**
 * 月次系列のヘルパー。data.monthly.generated.json を単一ソースとして、
 * パネル UI で必要な切り出し・派生統計（前月比・前年同月比）を提供する。
 */

export interface MonthlyPoint {
  /** "YYYY-MM" */
  ym: string;
  value: number;
}

interface MonthlyPayload {
  generatedAt: string;
  cpi: MonthlyPoint[];
  fx?: MonthlyPoint[];
  nikkei?: MonthlyPoint[];
}

const PAYLOAD = generated as MonthlyPayload;

/** 月次データの生成タイムスタンプ（"YYYY-MM"） */
export const MONTHLY_GENERATED_AT: string = PAYLOAD.generatedAt;

/** CPI 月次（2020年基準・原指数） */
export const CPI_MONTHLY: MonthlyPoint[] = PAYLOAD.cpi;

/** USD/JPY 月平均（FRED DEXJPUS 日次平均）。バッチ未実行時は空配列 */
export const FX_MONTHLY: MonthlyPoint[] = PAYLOAD.fx ?? [];

/** Nikkei 225 月平均（FRED NIKKEI225 日次平均）。バッチ未実行時は空配列 */
export const NIKKEI_MONTHLY: MonthlyPoint[] = PAYLOAD.nikkei ?? [];

/** "YYYY-MM" → 表示用ラベル "YYYY年M月" */
export function formatYm(ym: string): string {
  const [y, m] = ym.split("-");
  return `${y}年${parseInt(m, 10)}月`;
}

/** "YYYY-MM" の N か月前 */
export function shiftYm(ym: string, deltaMonths: number): string {
  const [y, m] = ym.split("-").map(Number);
  const total = y * 12 + (m - 1) + deltaMonths;
  const ny = Math.floor(total / 12);
  const nm = (total % 12) + 1;
  return `${ny}-${String(nm).padStart(2, "0")}`;
}

/** 末尾の最新ポイント */
export function latestPoint(series: MonthlyPoint[]): MonthlyPoint | null {
  return series.length > 0 ? series[series.length - 1] : null;
}

/** ym で値を引く */
function valueAt(series: MonthlyPoint[], ym: string): number | null {
  const hit = series.find(p => p.ym === ym);
  return hit ? hit.value : null;
}

/** 最新値と過去 deltaMonths か月前との変化率（%）。基準が無ければ null */
export function pctChangeFromLatest(series: MonthlyPoint[], deltaMonths: number): number | null {
  const last = latestPoint(series);
  if (!last) return null;
  const prev = valueAt(series, shiftYm(last.ym, -deltaMonths));
  if (prev == null || prev === 0) return null;
  return ((last.value - prev) / prev) * 100;
}

// ─── 月次イベントマーカー ─────────────────────────────────────────
// 既存の lib/data.ts の EVENTS（年次）と並行運用。
// 月次パネルは「直近の動き」を見せる目的なので、政策決定日など月レベルの
// 解像度を持つ出来事を抜粋する。

export type MonthlyEventCategory = "経済政策" | "経済" | "政治";

export interface MonthlyEvent {
  /** "YYYY-MM" */
  ym: string;
  label: string;
  category: MonthlyEventCategory;
  color: string;
}

/** 月次パネルに描画するイベントマーカー（直近の主要イベント中心） */
export const MONTHLY_EVENTS: MonthlyEvent[] = [
  { ym: "2024-03", label: "マイナス金利解除",     category: "経済政策", color: "#047857" },
  { ym: "2024-07", label: "日銀 追加利上げ",      category: "経済政策", color: "#047857" },
  { ym: "2024-10", label: "石破政権発足",         category: "政治",     color: "#6B21A8" },
  { ym: "2025-01", label: "日銀 0.25→0.5%",        category: "経済政策", color: "#047857" },
  { ym: "2025-10", label: "高市政権発足",         category: "政治",     color: "#6B21A8" },
];

/** 指定 ym 範囲に入るイベントを返す */
export function eventsInRange(fromYm: string, toYm: string): MonthlyEvent[] {
  return MONTHLY_EVENTS.filter(e => e.ym >= fromYm && e.ym <= toYm);
}
