"use client";

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

export function Chart({ data, events, administrations, activeIndicators, activeCategories, showComparison, isSingleIndicator }: Props) {
  const isMobile = useIsMobile();
  const visibleEvents = events.filter(e => activeCategories.includes(e.category));
  const activeConfigs = INDICATOR_CONFIGS.filter(c => activeIndicators.includes(c.key));

  // 1990=100 に正規化した表示用データ。元値は `${key}_raw` に保持。
  const normalized = normalizeData(data);

  const years = normalized.map(d => Number(d.year));
  const minYear = years[0] ?? 1990;
  const maxYear = years[years.length - 1] ?? 2025;

  // モバイルでは10年おき、PCでは5年おきに目盛り
  const xTicks = isMobile
    ? normalized.filter(d => Number(d.year) % 10 === 0 || d.year === minYear || d.year === maxYear).map(d => Number(d.year))
    : normalized.filter(d => Number(d.year) % 5 === 0 || d.year === minYear || d.year === maxYear).map(d => Number(d.year));

  const yAxisWidth = isMobile ? 42 : 60;
  const chartHeight = isMobile ? 260 : 360;
  const chartMargin = isMobile
    ? { top: 8, right: 8, left: 0, bottom: 5 }
    : { top: 36, right: 12, left: 0, bottom: 5 };

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

  // 近接イベントのラベルを2レーンに振り分け（デスクトップのみ）
  const LANE_GAP_YEARS = 3;
  const laneMap = new Map<string, number>();
  if (!isMobile) {
    const sorted = [...visibleEvents].sort((a, b) => a.year - b.year);
    let prevYear = -999;
    let prevLane = 1;
    for (const ev of sorted) {
      const key = `${ev.year}-${ev.label}`;
      const lane = ev.year - prevYear < LANE_GAP_YEARS ? (prevLane === 0 ? 1 : 0) : 0;
      laneMap.set(key, lane);
      prevYear = ev.year;
      prevLane = lane;
    }
  }

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
          domain={["auto", "auto"]}
          tickFormatter={(v) => `${v}`}
          label={isMobile ? undefined : { value: "指数（1990=100）", angle: -90, position: "insideLeft", fill: "var(--muted)", fontSize: 10, dx: -2 }}
        />

        <Tooltip content={<EventTooltip />} />

        <Legend
          wrapperStyle={{ paddingTop: 8 }}
          formatter={v => <span style={{ color: "var(--text)", fontSize: isMobile ? 11 : 12 }}>{v}</span>}
          iconSize={isMobile ? 8 : 14}
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
              return { value: ev.label, position: "top", fill: ev.color, fontSize: 9, dy: lane === 0 ? -4 : -18 };
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
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
    </div>
  );
}
