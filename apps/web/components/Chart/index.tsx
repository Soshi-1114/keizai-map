"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import type { DataPoint, EconomicEvent, IndicatorKey, Administration } from "@/lib/types";
import { INDICATOR_CONFIGS, BASELINE_1990 } from "@/lib/data";
import { useIsMobile } from "@/lib/hooks";

interface Props {
  data: DataPoint[];
  events: EconomicEvent[];
  administrations: Administration[];
  activeIndicators: IndicatorKey[];
  activeCategories: string[];
  showComparison?: boolean;
  isSingleIndicator?: boolean;
  /**
   * Y軸レンジモード:
   * - "auto": 表示中指標の min/max にフィットして変化を強調（デフォルト）
   * - "fixed": 全データから min/max を取り、指標間の絶対比較に向く
   */
  yAxisMode?: "auto" | "fixed";
}

const TICK_STYLE = { fill: "var(--muted)", fontSize: 11 };
const TICK_STYLE_SM = { fill: "var(--muted)", fontSize: 10 };

// 色覚多様性対応：線種で各指標を差別化
const STROKE_DASH: Record<IndicatorKey, string | undefined> = {
  wage: undefined,        // 実線
  cpi:  "6 3",           // 長破線
  tax:  "3 3",           // 短破線（点線）
  fx:   "10 3 3 3",      // 一点鎖線
  nikkei: "2 2",         // 細点線
  housing: "5 2 2 2",    // 複合破線
  debt: "8 4",           // 中破線
  births: "1 3",         // 極細点線
  insurance: undefined,  // 実線
};

/** 元の単位での表示文字列を生成 */
function formatRawValue(key: IndicatorKey, raw: number): string {
  switch (key) {
    case "tax":
    case "debt":
      return `${raw.toFixed(1)}兆円`;
    case "fx":
      return `${raw.toFixed(1)}円`;
    case "births":
      return `${raw.toFixed(1)}万人`;
    case "insurance":
      return `${raw.toFixed(1)}%`;
    default:
      return `${raw.toFixed(1)}`;
  }
}

/** データを 1990=100 の指数に正規化（実数指標を変換、既に指数の指標はそのまま） */
function normalizeData(data: DataPoint[]): Array<Record<string, number | null>> {
  return data.map(d => {
    const out: Record<string, number | null> = { year: d.year };
    for (const cfg of INDICATOR_CONFIGS) {
      const raw = d[cfg.key];
      if (raw == null) {
        out[cfg.key] = null;
        out[`${cfg.key}_raw`] = null;
      } else {
        const baseline = BASELINE_1990[cfg.key];
        out[cfg.key] = (raw / baseline) * 100;
        out[`${cfg.key}_raw`] = raw;
      }
    }
    // G7 比較列があれば素通し
    const dx = d as unknown as Record<string, number | undefined>;
    if (dx.g7wage !== undefined) out.g7wage = dx.g7wage ?? null;
    if (dx.g7cpi !== undefined) out.g7cpi = dx.g7cpi ?? null;
    if (dx.g7fx !== undefined) out.g7fx = dx.g7fx ?? null;
    return out;
  });
}

export function Chart({ data, events, administrations, activeIndicators, activeCategories, showComparison, isSingleIndicator, yAxisMode = "auto" }: Props) {
  const isMobile = useIsMobile();
  const visibleEvents = useMemo(
    () => events.filter(e => activeCategories.includes(e.category)),
    [events, activeCategories],
  );
  const activeConfigs = useMemo(
    () => INDICATOR_CONFIGS.filter(c => activeIndicators.includes(c.key)),
    [activeIndicators],
  );

  // 1990=100 に正規化した表示用データ。元値は `${key}_raw` に保持。
  const normalized = useMemo(() => normalizeData(data), [data]);

  const { minYear, maxYear } = useMemo(() => {
    const years = normalized.map(d => Number(d.year));
    return {
      minYear: years[0] ?? 1990,
      maxYear: years[years.length - 1] ?? 2025,
    };
  }, [normalized]);

  // 表示期間の長さに応じて目盛り間隔を動的決定。短期間では中間の年も
  // 読めるよう細かく、長期間では字が重ならない粗さにする。
  const xTicks = useMemo(() => {
    const span = maxYear - minYear;
    let step: number;
    if (isMobile) {
      step = span >= 30 ? 10 : span >= 10 ? 5 : 2;
    } else {
      step = span >= 30 ? 5 : span >= 10 ? 2 : 1;
    }
    return normalized
      .filter(d => Number(d.year) % step === 0 || d.year === minYear || d.year === maxYear)
      .map(d => Number(d.year));
  }, [normalized, isMobile, minYear, maxYear]);

  /**
   * Y軸 domain を計算。auto モードでは選択中指標の値だけで min/max を出して
   * 変化を強調。fixed モードでは 100 基準で固定的に [85, max+padding]。
   */
  const yDomain = useMemo((): [number, number] | [number | string, number | string] => {
    const activeKeys = activeConfigs.map(c => c.key);
    if (activeKeys.length === 0) return [85, 140];

    if (yAxisMode === "auto") {
      const values: number[] = [];
      for (const d of normalized) {
        for (const k of activeKeys) {
          const v = d[k];
          if (typeof v === "number" && isFinite(v)) values.push(v);
        }
      }
      if (values.length === 0) return [85, 140];
      const lo = Math.min(...values);
      const hi = Math.max(...values);
      // 上下 8% パディング、最低でも 10 ポイント幅を確保
      const span = Math.max(hi - lo, 10);
      const pad = span * 0.08;
      return [Math.floor(lo - pad), Math.ceil(hi + pad)];
    }

    // fixed: 1990=100 基準を視野に入れた全データの最大まで
    const values: number[] = [];
    for (const d of normalized) {
      for (const k of activeKeys) {
        const v = d[k];
        if (typeof v === "number" && isFinite(v)) values.push(v);
      }
    }
    if (values.length === 0) return [85, 140];
    const hi = Math.max(...values, 105);
    return [Math.min(85, Math.floor(Math.min(...values))), Math.ceil(hi * 1.05)];
  }, [normalized, activeConfigs, yAxisMode]);

  const yAxisWidth = isMobile ? 42 : 60;
  // SP は 260 → 300 に引き上げ。9指標 + イベント線 + 政権バーで詰まり気味だったため
  const chartHeight = isMobile ? 300 : 360;
  // PC は 3 レーン分のラベル高さを確保（lane2 dy=-32 ＋ 余白）
  const chartMargin = isMobile
    ? { top: 8, right: 8, left: 0, bottom: 5 }
    : { top: 52, right: 12, left: 0, bottom: 5 };

  // カスタム Tooltip：指数値 + 元単位値 + 近傍イベント情報を統合表示
  function EventTooltip({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string; dataKey: string; payload: Record<string, number | null> }>;
    label?: number;
  }) {
    if (!active || !payload?.length || label == null) return null;

    const nearEvents = visibleEvents
      .filter(e => Math.abs(e.year - label) <= 1)
      .sort((a, b) => Math.abs(a.year - label) - Math.abs(b.year - label));

    const dataItems = payload.filter(p => p.value != null && !String(p.dataKey).startsWith("g7"));

    return (
      <div style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "8px 12px",
        fontSize: 12,
        maxWidth: 260,
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
      }}>
        <div style={{ color: "var(--text)", fontWeight: "bold", marginBottom: nearEvents.length ? 6 : 4 }}>
          {label}年
        </div>

        {nearEvents.length > 0 && (
          <div style={{
            marginBottom: 6,
            paddingBottom: 6,
            borderBottom: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}>
            {nearEvents.map(ev => (
              <div key={`${ev.year}-${ev.label}`} style={{ color: ev.color, fontWeight: 600, fontSize: 11 }}>
                📌 {ev.year !== label ? `${ev.year}年 ` : ""}{ev.label}
              </div>
            ))}
          </div>
        )}

        {dataItems.map(entry => {
          const key = String(entry.dataKey) as IndicatorKey;
          const cfg = INDICATOR_CONFIGS.find(c => c.key === key);
          const rawVal = entry.payload[`${key}_raw`];
          const rawDisplay = typeof rawVal === "number" ? formatRawValue(key, rawVal) : null;
          return (
            <div key={String(entry.dataKey)} style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              color: entry.color,
              lineHeight: "1.6",
            }}>
              <span>{cfg?.label ?? entry.name}</span>
              <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
                {entry.value.toFixed(1)}
                {rawDisplay && (
                  <span style={{ color: "var(--muted)", fontWeight: 400, marginLeft: 4 }}>
                    （{rawDisplay}）
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  // 近接イベントのラベルを 3 レーンに振り分け（デスクトップのみ）
  const LANE_GAP_YEARS = 3;
  const TOTAL_LANES = 3;
  const LANE_DY: Record<number, number> = { 0: -4, 1: -18, 2: -32 };

  const laneMap = useMemo(() => {
    const map = new Map<string, number>();
    if (isMobile) return map;
    const sorted = [...visibleEvents].sort((a, b) => a.year - b.year);
    const laneLastYear = new Array<number>(TOTAL_LANES).fill(-Infinity);
    for (const ev of sorted) {
      let chosen = 0;
      for (let i = 0; i < TOTAL_LANES; i++) {
        if (ev.year - laneLastYear[i] >= LANE_GAP_YEARS) {
          chosen = i;
          break;
        }
        if (laneLastYear[i] < laneLastYear[chosen]) chosen = i;
      }
      map.set(`${ev.year}-${ev.label}`, chosen);
      laneLastYear[chosen] = ev.year;
    }
    return map;
  }, [visibleEvents, isMobile]);

  const chartDescription = activeConfigs.length > 0
    ? `${activeConfigs.map(c => c.label).join(', ')} の ${minYear}年から${maxYear}年までの推移（1990=100指数）`
    : `経済指標の ${minYear}年から${maxYear}年までの推移`;

  return (
    <div role="img" aria-labelledby="chart-title" className="w-full">
      <h2 id="chart-title" className="sr-only">{chartDescription}</h2>
      <ResponsiveContainer width="100%" height={chartHeight}>
      <ComposedChart data={normalized} margin={chartMargin}>
        {administrations
          .filter(a => a.end > minYear && a.start < maxYear)
          .map(admin => (
            <ReferenceArea
              key={`${admin.name}-${admin.start}`}
              x1={Math.max(admin.start, minYear)}
              x2={Math.min(admin.end, maxYear)}
              fill={admin.color}
              fillOpacity={0.05}
              stroke={admin.color}
              strokeOpacity={0.25}
              strokeWidth={0.5}
            />
          ))}

        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />

        <XAxis
          dataKey="year"
          type="number"
          domain={[minYear, maxYear]}
          ticks={xTicks}
          stroke="var(--border)"
          tick={isMobile ? TICK_STYLE_SM : TICK_STYLE}
          tickLine={false}
        />
        <YAxis
          orientation="left"
          width={yAxisWidth}
          stroke="transparent"
          tick={isMobile ? TICK_STYLE_SM : TICK_STYLE}
          tickLine={false}
          domain={yDomain}
          tickFormatter={(v) => `${v}`}
          label={isMobile ? undefined : { value: "指数（1990=100）", angle: -90, position: "insideLeft", fill: "var(--muted)", fontSize: 10, dx: -2 }}
        />

        <Tooltip content={<EventTooltip />} />

        <Legend
          wrapperStyle={{ paddingTop: 8 }}
          formatter={v => <span style={{ color: "var(--text)", fontSize: 12 }}>{v}</span>}
          iconSize={14}
        />

        {visibleEvents.map(ev => (
          <ReferenceLine
            key={`${ev.year}-${ev.label}`}
            x={ev.year}
            stroke={ev.color}
            strokeDasharray="4 3"
            strokeOpacity={0.7}
            label={isMobile ? undefined : (() => {
              const lane = laneMap.get(`${ev.year}-${ev.label}`) ?? 0;
              return { value: ev.label, position: "top", fill: ev.color, fontSize: 9, dy: LANE_DY[lane] ?? -4 };
            })()}
          />
        ))}

        {activeConfigs.map(cfg => (
          <Line
            key={cfg.key}
            type="monotone"
            dataKey={cfg.key}
            name={cfg.label}
            stroke={cfg.color}
            strokeWidth={isMobile ? 1.5 : 2}
            strokeDasharray={isSingleIndicator ? undefined : STROKE_DASH[cfg.key]}
            dot={{ fill: cfg.color, r: isMobile ? 2 : 3, strokeWidth: 0 }}
            activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
            connectNulls={false}
          />
        ))}

        {/* G7 比較線。元データは隔年（偶数年のみ）のため connectNulls=true で
            欠けた年を補間して連続線として描画する */}
        {showComparison && activeIndicators.includes("wage") && (
          <Line
            type="monotone"
            dataKey="g7wage"
            name="G7平均（実質賃金）"
            stroke="#4F8EF7"
            strokeWidth={1.5}
            strokeDasharray="3 3"
            strokeOpacity={0.5}
            dot={false}
            connectNulls
          />
        )}
        {showComparison && activeIndicators.includes("cpi") && (
          <Line
            type="monotone"
            dataKey="g7cpi"
            name="G7平均（CPI）"
            stroke="#D97706"
            strokeWidth={1.5}
            strokeDasharray="3 3"
            strokeOpacity={0.5}
            dot={false}
            connectNulls
          />
        )}
        {showComparison && activeIndicators.includes("fx") && (
          <Line
            type="monotone"
            dataKey="g7fx"
            name="G7平均（為替基準指数）"
            stroke="#4FD9A0"
            strokeWidth={1.5}
            strokeDasharray="3 3"
            strokeOpacity={0.5}
            dot={false}
            connectNulls
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
    </div>
  );
}
