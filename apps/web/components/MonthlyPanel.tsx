"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import {
  CPI_MONTHLY,
  MONTHLY_GENERATED_AT,
  eventsInRange,
  formatYm,
  latestPoint,
  pctChangeFromLatest,
  type MonthlyPoint,
} from "@/lib/monthly";

/**
 * 月次パネル：年次グラフの「長期トレンド」を補完する「直近の動き」を見せる。
 * v1 は CPI 月次（直近24か月）のみ。出生数 / 為替は v2 で追加予定。
 *
 * 設計方針:
 * - 折れ線は1本（CPI 月次原指数, 2020=100）
 * - 主要イベント（マイナス金利解除・利上げ・政権交代）を縦線で重ねる
 * - KPI: 最新値 / 前月比 / 前年同月比 を 3 つ並べる
 */
/** 親要素の幅を ResizeObserver で追従。recharts ResponsiveContainer 互換の代替。 */
function useContainerWidth(): [React.RefObject<HTMLDivElement>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const update = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 0) setWidth(Math.floor(w));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
}

export function MonthlyPanel() {
  const series = CPI_MONTHLY;
  const [containerRef, containerWidth] = useContainerWidth();

  const { chartData, latest, momPct, yoyPct, events, yMin, yMax } = useMemo(() => {
    const last: MonthlyPoint | null = latestPoint(series);
    const mom = pctChangeFromLatest(series, 1);
    const yoy = pctChangeFromLatest(series, 12);
    const rangeFrom = series[0]?.ym ?? "";
    const rangeTo = last?.ym ?? "";
    const ev = eventsInRange(rangeFrom, rangeTo);

    // Y軸レンジは事前計算（recharts の domain 文字列は内部で eval され CSP 違反になる）
    const values = series.map(p => p.value);
    const min = values.length > 0 ? Math.min(...values) : 0;
    const max = values.length > 0 ? Math.max(...values) : 100;

    return {
      chartData: series.map(p => ({ ym: p.ym, value: p.value })),
      latest: last,
      momPct: mom,
      yoyPct: yoy,
      events: ev,
      yMin: Math.floor(min - 1),
      yMax: Math.ceil(max + 1),
    };
  }, [series]);

  if (!latest) return null;

  const cpiColor = "#D97706"; // INDICATOR_CONFIGS の cpi と揃える

  return (
    <section
      className="rounded-xl border p-4 md:p-5 space-y-4"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      aria-labelledby="monthly-panel-heading"
    >
      {/* ヘッダー */}
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <div>
          <h2 id="monthly-panel-heading" className="text-base font-semibold">
            消費者物価（CPI）月次推移
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
            直近24か月の動き（2020年=100の原指数）
          </p>
        </div>
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          更新: {MONTHLY_GENERATED_AT}
        </span>
      </div>

      {/* KPI 3つ */}
      <div className="grid grid-cols-3 gap-3">
        <Kpi label="最新値" value={latest.value.toFixed(1)} sublabel={formatYm(latest.ym)} />
        <Kpi label="前月比" value={formatSignedPct(momPct)} colored={momPct} />
        <Kpi label="前年同月比" value={formatSignedPct(yoyPct)} colored={yoyPct} />
      </div>

      {/* チャート */}
      <div
        ref={containerRef}
        style={{ width: "100%", height: 260, overflow: "hidden" }}
        role="img"
        aria-label="CPI 月次推移チャート"
      >
        <LineChart
          width={containerWidth}
          height={260}
          data={chartData}
          margin={{ top: 60, right: 16, bottom: 4, left: 0 }}
        >
            <CartesianGrid strokeDasharray="3 4" stroke="var(--border)" />
            <XAxis
              dataKey="ym"
              tick={{ fontSize: 11, fill: "var(--muted)" }}
              tickFormatter={ym => {
                const [y, m] = ym.split("-");
                // 1月のみ西暦表示で年境界を明示、それ以外は "M月" で短く
                return parseInt(m, 10) === 1 ? `${y}/1` : `${parseInt(m, 10)}月`;
              }}
              interval={1}
              minTickGap={20}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--muted)" }}
              width={44}
              domain={[yMin, yMax]}
              tickFormatter={v => v.toFixed(0)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelFormatter={(ym: string) => formatYm(ym)}
              formatter={(value: number) => [value.toFixed(1), "CPI"]}
            />
            {events.map(ev => (
              <ReferenceLine
                key={`${ev.ym}-${ev.label}`}
                x={ev.ym}
                stroke={ev.color}
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: ev.label,
                  position: "top",
                  fontSize: 10,
                  fill: ev.color,
                  offset: 6,
                  angle: -35,
                  textAnchor: "start",
                }}
              />
            ))}
            <Line
              type="monotone"
              dataKey="value"
              stroke={cpiColor}
              strokeWidth={2.5}
              dot={{ r: 2.5, fill: cpiColor }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          </LineChart>
      </div>

      <p className="text-xs" style={{ color: "var(--muted)" }}>
        出典: 総務省統計局 消費者物価指数（e-Stat API 経由・原指数）
      </p>
    </section>
  );
}

function Kpi({
  label,
  value,
  sublabel,
  colored,
}: {
  label: string;
  value: string;
  sublabel?: string;
  /** 数値の符号で色付けする場合の元値（正:赤系・負:緑系） */
  colored?: number | null;
}) {
  let color = "var(--text)";
  if (typeof colored === "number" && Number.isFinite(colored)) {
    if (colored > 0.05) color = "#ef4444";
    else if (colored < -0.05) color = "#22c55e";
  }
  return (
    <div className="rounded-lg border px-3 py-2" style={{ borderColor: "var(--border)" }}>
      <div className="text-xs" style={{ color: "var(--muted)" }}>
        {label}
      </div>
      <div className="text-lg md:text-xl font-semibold tabular-nums" style={{ color }}>
        {value}
      </div>
      {sublabel && (
        <div className="text-xs" style={{ color: "var(--muted)" }}>
          {sublabel}
        </div>
      )}
    </div>
  );
}

function formatSignedPct(pct: number | null): string {
  if (pct == null || !Number.isFinite(pct)) return "—";
  const rounded = Number(pct.toFixed(1));
  if (rounded === 0) return "0.0%";
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded.toFixed(1)}%`;
}
