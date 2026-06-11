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
import { INDICATOR_CONFIGS } from "@/lib/data";
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

export function Chart({ data, events, administrations, activeIndicators, activeCategories, showComparison, isSingleIndicator }: Props) {
  const isMobile = useIsMobile();
  const visibleEvents = events.filter(e => activeCategories.includes(e.category));
  const activeConfigs = INDICATOR_CONFIGS.filter(c => activeIndicators.includes(c.key));

  const years = data.map(d => d.year);
  const minYear = years[0] ?? 1990;
  const maxYear = years[years.length - 1] ?? 2024;

  // モバイルでは4年おきに間引く
  const xTicks = isMobile
    ? data.filter(d => d.year % 8 === 0 || d.year === minYear || d.year === maxYear).map(d => d.year)
    : data.map(d => d.year);

  const yAxisWidth = isMobile ? 38 : 55;
  const chartHeight = isMobile ? 260 : 360;
  const chartMargin = isMobile
    ? { top: 8, right: 0, left: 0, bottom: 5 }
    : { top: 36, right: 0, left: 0, bottom: 5 };

  // カスタム Tooltip：指標値 + 近傍イベント情報を統合表示
  function EventTooltip({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string; dataKey: string }>;
    label?: number;
  }) {
    if (!active || !payload?.length || label == null) return null;

    // タップした年の ±1 年以内にあるイベントを取得（近い順）
    const nearEvents = visibleEvents
      .filter(e => Math.abs(e.year - label) <= 1)
      .sort((a, b) => Math.abs(a.year - label) - Math.abs(b.year - label));

    // null/undefined 値と G7 系列を除いた実データ
    const dataItems = payload.filter(p => p.value != null && !String(p.dataKey).startsWith("g7"));

    return (
      <div style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "8px 12px",
        fontSize: 12,
        maxWidth: 220,
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
      }}>
        {/* 年ヘッダー */}
        <div style={{ color: "var(--text)", fontWeight: "bold", marginBottom: nearEvents.length ? 6 : 4 }}>
          {label}年
        </div>

        {/* 近傍イベント */}
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

        {/* 指標値 */}
        {dataItems.map(entry => {
          const cfg = INDICATOR_CONFIGS.find(c => c.label === entry.name);
          return (
            <div key={entry.dataKey} style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              color: entry.color,
              lineHeight: "1.6",
            }}>
              <span>{entry.name}</span>
              <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
                {entry.value.toFixed(1)}{cfg?.unit ?? ""}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  // 近接イベントのラベルを2レーンに振り分けて重なりを防ぐ（デスクトップのみ）
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

  // アクセシビリティ用の説明テキストを生成
  const chartDescription = activeConfigs.length > 0
    ? `${activeConfigs.map(c => c.label).join(', ')} の ${minYear}年から${maxYear}年までの推移`
    : `経済指標の ${minYear}年から${maxYear}年までの推移`;

  return (
    <div role="img" aria-labelledby="chart-title" className="w-full">
      <h2 id="chart-title" className="sr-only">{chartDescription}</h2>
      <ResponsiveContainer width="100%" height={chartHeight}>
      <ComposedChart data={data} margin={chartMargin}>
        {/* Administration background bands */}
        {administrations
          .filter(a => a.end > minYear && a.start < maxYear)
          .map(admin => (
            <ReferenceArea
              key={`${admin.name}-${admin.start}`}
              x1={Math.max(admin.start, minYear)}
              x2={Math.min(admin.end, maxYear)}
              yAxisId="left"
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
          yAxisId="left"
          orientation="left"
          width={yAxisWidth}
          stroke="transparent"
          tick={isMobile ? TICK_STYLE_SM : TICK_STYLE}
          tickLine={false}
          domain={[85, 140]}
          label={isMobile ? undefined : { value: "指数（1990=100）", angle: -90, position: "insideLeft", fill: "var(--muted)", fontSize: 10, dx: -2 }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          width={yAxisWidth}
          stroke="transparent"
          tick={isMobile ? TICK_STYLE_SM : TICK_STYLE}
          tickLine={false}
          domain={[30, 170]}
          label={isMobile ? undefined : { value: "税収（兆円）/ 為替（円）", angle: 90, position: "insideRight", fill: "var(--muted)", fontSize: 10, dx: 10 }}
        />

        <Tooltip content={<EventTooltip />} />

        <Legend
          wrapperStyle={{ paddingTop: 8 }}
          formatter={v => <span style={{ color: "var(--text)", fontSize: isMobile ? 11 : 12 }}>{v}</span>}
          iconSize={isMobile ? 8 : 14}
        />

        {/* イベント参照線：モバイルではラベル非表示 */}
        {visibleEvents.map(ev => (
          <ReferenceLine
            key={`${ev.year}-${ev.label}`}
            x={ev.year}
            yAxisId="left"
            stroke={ev.color}
            strokeDasharray="4 3"
            strokeOpacity={0.7}
            label={isMobile ? undefined : (() => {
              const lane = laneMap.get(`${ev.year}-${ev.label}`) ?? 0;
              return { value: ev.label, position: "top", fill: ev.color, fontSize: 9, dy: lane === 0 ? -4 : -18 };
            })()}
          />
        ))}

        {/* Data lines */}
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
            yAxisId={cfg.yAxis}
          />
        ))}

        {/* G7平均比較ライン */}
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
            yAxisId="left"
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
            yAxisId="left"
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
            yAxisId="right"
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
    </div>
  );
}
