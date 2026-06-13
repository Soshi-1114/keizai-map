import type { DataPoint, IndicatorKey } from "./types";
import { RAW_DATA } from "./data";

export interface DerivedStat {
  indicator: IndicatorKey;
  startYear: number;
  endYear: number;
  startValue: number;
  endValue: number;
  /** (endValue - startValue) / startValue * 100 */
  pctChange: number;
  /** endValue / startValue */
  ratio: number;
}

function findFirstNonNull(
  data: DataPoint[],
  key: IndicatorKey,
): { year: number; value: number } | null {
  for (const d of data) {
    const v = d[key];
    if (typeof v === "number" && isFinite(v)) return { year: d.year, value: v };
  }
  return null;
}

function findLastNonNull(
  data: DataPoint[],
  key: IndicatorKey,
): { year: number; value: number } | null {
  for (let i = data.length - 1; i >= 0; i--) {
    const v = data[i][key];
    if (typeof v === "number" && isFinite(v)) return { year: data[i].year, value: v };
  }
  return null;
}

/**
 * 指標について start→end の派生統計を返す。
 * data 未指定時は data.generated.json の全期間（1990〜最新年）。
 * start/end が見つからなければ null。
 */
export function derive(
  indicator: IndicatorKey,
  data: DataPoint[] = RAW_DATA,
): DerivedStat | null {
  const first = findFirstNonNull(data, indicator);
  const last = findLastNonNull(data, indicator);
  if (!first || !last || first.year === last.year || first.value === 0) return null;

  const ratio = last.value / first.value;
  const pctChange = (ratio - 1) * 100;
  return {
    indicator,
    startYear: first.year,
    endYear: last.year,
    startValue: first.value,
    endValue: last.value,
    ratio,
    pctChange,
  };
}

/** "+34%" / "-2.1%" / "0%" — 符号付き百分率。precision=1 がデフォルト（0なら整数）。 */
export function formatPct(pct: number, precision = 1): string {
  if (!isFinite(pct)) return "—";
  const rounded = Number(pct.toFixed(precision));
  if (rounded === 0) return "0%";
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded.toFixed(precision)}%`;
}

/** "1.7倍" / "2.3倍" — 倍率。precision=1 がデフォルト。 */
export function formatRatio(ratio: number, precision = 1): string {
  if (!isFinite(ratio)) return "—";
  return `${ratio.toFixed(precision)}倍`;
}

/**
 * 数値を1990=100の指数値として丸める（"99.2" 等）。
 * precision=1 がデフォルト。
 */
export function formatIndex(value: number, precision = 1): string {
  if (!isFinite(value)) return "—";
  return value.toFixed(precision);
}

/**
 * 変化の方向と大きさを「ほぼ横ばい」「X倍」「+X%」「-X%」のフレーズに変換。
 * HeroStory と同じロジック（ratio 0.95〜1.05 を「ほぼ横ばい」とする）を共通化。
 */
export function trendLabel(ratio: number): string {
  if (!isFinite(ratio)) return "—";
  if (ratio >= 0.95 && ratio <= 1.05) return "ほぼ横ばい";
  if (ratio >= 1.5) return formatRatio(ratio);
  return formatPct((ratio - 1) * 100, ratio - 1 > 0 || ratio - 1 < -0.1 ? 1 : 1);
}

/** data.generated.json の最終年（全指標で最大値の year） */
export function latestYear(data: DataPoint[] = RAW_DATA): number {
  return data.reduce((max, d) => (d.year > max ? d.year : max), 0);
}

/** 1990 と最新年を含む表記用文字列 "1990〜2025" を返す */
export function dataYearRangeLabel(data: DataPoint[] = RAW_DATA): string {
  const last = latestYear(data);
  return `1990〜${last}`;
}
