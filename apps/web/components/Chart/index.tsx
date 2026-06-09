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
import type { DataPoint, EconomicEvent, IndicatorKey, Administration } from "@keizai-map/types";
import { INDICATOR_CONFIGS } from "@keizai-map/data";

interface Props {
  data: DataPoint[];
  events: EconomicEvent[];
  administrations: Administration[];
  activeIndicators: IndicatorKey[];
  activeCategories: string[];
}

const TICK_STYLE = { fill: "#6B7280", fontSize: 11 };

export function Chart({ data, events, administrations, activeIndicators, activeCategories }: Props) {
  const visibleEvents = events.filter(e => activeCategories.includes(e.category));
  const activeConfigs = INDICATOR_CONFIGS.filter(c => activeIndicators.includes(c.key));

  const years = data.map(d => d.year);
  const minYear = years[0] ?? 1990;
  const maxYear = years[years.length - 1] ?? 2024;

  return (
    <ResponsiveContainer width="100%" height={420}>
      <ComposedChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
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

        <CartesianGrid strokeDasharray="3 3" stroke="#2E3245" vertical={false} />

        <XAxis
          dataKey="year"
          type="number"
          domain={[minYear, maxYear]}
          ticks={data.map(d => d.year)}
          stroke="#2E3245"
          tick={TICK_STYLE}
          tickLine={false}
        />
        <YAxis
          yAxisId="left"
          orientation="left"
          width={55}
          stroke="transparent"
          tick={TICK_STYLE}
          tickLine={false}
          domain={[85, 140]}
          label={{ value: "指数（1990=100）", angle: -90, position: "insideLeft", fill: "#6B7280", fontSize: 10, dx: -2 }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          width={55}
          stroke="transparent"
          tick={TICK_STYLE}
          tickLine={false}
          domain={[30, 170]}
          label={{ value: "税収（兆円）/ 為替（円）", angle: 90, position: "insideRight", fill: "#6B7280", fontSize: 10, dx: 10 }}
        />

        <Tooltip
          contentStyle={{ backgroundColor: "#161921", border: "1px solid #2E3245", borderRadius: "8px", fontSize: 12 }}
          labelStyle={{ color: "#E8EAF0", fontWeight: "bold", marginBottom: 4 }}
          labelFormatter={(label) => `${label}年`}
          formatter={(value: number, name: string) => {
            const cfg = INDICATOR_CONFIGS.find(c => c.label === name);
            return [`${value.toFixed(1)}${cfg?.unit ?? ""}`, name];
          }}
        />

        <Legend
          wrapperStyle={{ paddingTop: 8 }}
          formatter={v => <span style={{ color: "#E8EAF0", fontSize: 12 }}>{v}</span>}
        />

        {/* Event reference lines */}
        {visibleEvents.map(ev => (
          <ReferenceLine
            key={`${ev.year}-${ev.label}`}
            x={ev.year}
            yAxisId="left"
            stroke={ev.color}
            strokeDasharray="4 3"
            strokeOpacity={0.7}
            label={{ value: ev.label, position: "top", fill: ev.color, fontSize: 9, dy: -4 }}
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
            strokeWidth={2}
            dot={{ fill: cfg.color, r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 2, stroke: "#10121A" }}
            yAxisId={cfg.yAxis}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
