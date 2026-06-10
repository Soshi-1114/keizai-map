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
}

const TICK_STYLE = { fill: "var(--muted)", fontSize: 11 };
const TICK_STYLE_SM = { fill: "var(--muted)", fontSize: 10 };

export function Chart({ data, events, administrations, activeIndicators, activeCategories }: Props) {
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

  return (
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

        <Tooltip
          contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: 12 }}
          labelStyle={{ color: "var(--text)", fontWeight: "bold", marginBottom: 4 }}
          labelFormatter={(label) => `${label}年`}
          formatter={(value: number, name: string) => {
            const cfg = INDICATOR_CONFIGS.find(c => c.label === name);
            return [`${value.toFixed(1)}${cfg?.unit ?? ""}`, name];
          }}
        />

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
            dot={{ fill: cfg.color, r: isMobile ? 2 : 3, strokeWidth: 0 }}
            activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
            yAxisId={cfg.yAxis}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
