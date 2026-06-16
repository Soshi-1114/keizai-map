import { RAW_DATA, BASELINE_1990, INDICATOR_CONFIGS } from "./data";
import type { IndicatorKey } from "./types";

export const ALL_INDICATOR_KEYS: IndicatorKey[] = INDICATOR_CONFIGS.map(c => c.key);

const INDICATOR_META_INTERNAL: Record<IndicatorKey, { label: string; color: string }> =
  Object.fromEntries(INDICATOR_CONFIGS.map(c => [c.key, { label: c.label, color: c.color }])) as Record<
    IndicatorKey,
    { label: string; color: string }
  >;

export const INDICATOR_META = INDICATOR_META_INTERNAL;

export interface NormalizedPoint {
  year: number;
  value: number | null;
}

export interface NormalizedSeries {
  key: IndicatorKey;
  label: string;
  color: string;
  points: NormalizedPoint[];
}

const isValidKey = (k: string): k is IndicatorKey =>
  (ALL_INDICATOR_KEYS as string[]).includes(k);

const DATA_MIN_YEAR = RAW_DATA[0]?.year ?? 1990;
const DATA_MAX_YEAR = RAW_DATA[RAW_DATA.length - 1]?.year ?? 2025;

const DEFAULT_KEYS: IndicatorKey[] = ["wage", "cpi"];
const DEFAULT_RANGE: [number, number] = [DATA_MIN_YEAR, DATA_MAX_YEAR];

export function parseIndicatorParam(raw: string | null | undefined): IndicatorKey[] {
  if (!raw) return DEFAULT_KEYS;
  const list = raw
    .split(",")
    .map(s => s.trim())
    .filter(isValidKey);
  // 重複排除しつつ順序維持。最大 5 系列までで頭打ち（凡例の収まりとSVGの可読性）。
  const unique = Array.from(new Set(list)).slice(0, 5);
  return unique.length > 0 ? unique : DEFAULT_KEYS;
}

export function parseRangeParam(raw: string | null | undefined): [number, number] {
  if (!raw) return DEFAULT_RANGE;
  const parts = raw.split(",").map(s => Number(s.trim()));
  if (parts.length !== 2 || !Number.isFinite(parts[0]) || !Number.isFinite(parts[1])) return DEFAULT_RANGE;
  const [a, b] = parts;
  if (a >= b) return DEFAULT_RANGE;
  const from = Math.max(DATA_MIN_YEAR, Math.floor(a));
  const to = Math.min(DATA_MAX_YEAR, Math.floor(b));
  if (from >= to) return DEFAULT_RANGE;
  return [from, to];
}

/**
 * 1990=100 正規化済みの時系列を返す。ダッシュボード（components/Chart）と同じ
 * BASELINE_1990 / RAW_DATA を使用するため、線・最新値は本体と一致する。
 */
export function getNormalizedSeries(
  keys: IndicatorKey[],
  from: number,
  to: number,
): NormalizedSeries[] {
  const slice = RAW_DATA.filter(d => d.year >= from && d.year <= to);
  return keys.map(k => {
    const meta = INDICATOR_META[k];
    const baseline = BASELINE_1990[k];
    return {
      key: k,
      label: meta.label,
      color: meta.color,
      points: slice.map(d => {
        const raw = d[k];
        return {
          year: d.year,
          value: typeof raw === "number" && Number.isFinite(raw) ? (raw / baseline) * 100 : null,
        };
      }),
    };
  });
}
