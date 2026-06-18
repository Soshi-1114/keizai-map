"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  MARKET_RANGES,
  deltaFromLatest,
  deltaLabelForRange,
  formatMarketValue,
  granularityLabel,
  pctChangeFromLatest,
  selectMarketSeries,
  type MarketCardConfig,
  type MarketRange,
} from "@/lib/market";
import { DAILY_GENERATED_AT } from "@/lib/daily";

/**
 * MarketCard: 為替・株価のような市場系指標を表示する汎用カード。
 *
 * 設計方針（案B：時間軸ズーム）
 * - 上部に大きな最新値 + 直近の変化（前日/前月/前年比）
 * - 中央に 1W / 1M / 3M / 1Y / 2Y / Max のレンジトグル（株価アプリ慣習）
 * - 下部に折れ線。レンジに応じて日次/月次/年次のシリーズを切替
 * - データ未取得（バッチ未実行）の場合は最新値の代わりに案内メッセージ
 */

/** ResponsiveContainer 代替：親要素の幅を ResizeObserver で追従。 */
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

const DEFAULT_RANGE: MarketRange = "3M";

export function MarketCard({ config }: { config: MarketCardConfig }) {
  const [range, setRange] = useState<MarketRange>(DEFAULT_RANGE);
  const [containerRef, containerWidth] = useContainerWidth();

  const { series, latest, delta, pct, yMin, yMax } = useMemo(() => {
    const s = selectMarketSeries(config, range);
    const points = s.points;
    const d = deltaFromLatest(points);
    const p = pctChangeFromLatest(points);
    const last = points.length > 0 ? points[points.length - 1] : null;
    const values = points.map(pt => pt.value);
    const min = values.length > 0 ? Math.min(...values) : 0;
    const max = values.length > 0 ? Math.max(...values) : 1;
    const pad = (max - min) * 0.1 || max * 0.01 || 1;
    return {
      series: s,
      latest: last,
      delta: d,
      pct: p,
      yMin: min - pad,
      yMax: max + pad,
    };
  }, [config, range]);

  const headingId = `market-card-${config.key}-heading`;
  const hasData = series.points.length > 0;
  const deltaColor = chooseDeltaColor(delta);

  return (
    <section
      className="rounded-xl border p-4 md:p-5 space-y-4"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      aria-labelledby={headingId}
    >
      {/* ヘッダー：タイトル + 最新値 + 変化 */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <h2 id={headingId} className="text-base font-semibold">
            {config.title}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
            {config.subtitle}
          </p>
        </div>
        <div className="text-right tabular-nums">
          {latest ? (
            <>
              <div className="text-2xl md:text-3xl font-semibold leading-tight" style={{ color: "var(--text)" }}>
                {formatMarketValue(latest.value, config.decimals)}
                <span className="text-sm font-normal ml-1" style={{ color: "var(--muted)" }}>{config.unit}</span>
              </div>
              <div className="text-xs mt-0.5" style={{ color: deltaColor }}>
                {deltaLabelForRange(range)}{" "}
                {formatSignedNumber(delta, config.decimals)}
                {pct != null && (
                  <span className="ml-1">
                    ({formatSignedPct(pct)})
                  </span>
                )}
              </div>
              <div className="text-[10px] mt-1" style={{ color: "var(--muted)" }}>
                {latest.detail} · {granularityLabel(series.granularity)}
              </div>
            </>
          ) : (
            <div className="text-xs" style={{ color: "var(--muted)" }}>
              データ取得待ち
            </div>
          )}
        </div>
      </div>

      {/* レンジトグル */}
      <div
        role="group"
        aria-label="表示期間"
        className="flex items-center gap-1 rounded-lg border p-1 w-fit"
        style={{ borderColor: "var(--border)" }}
      >
        {MARKET_RANGES.map(r => {
          const active = r === range;
          return (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className="px-2.5 py-1 text-xs rounded-md transition-colors tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              style={{
                backgroundColor: active ? "var(--text)" : "transparent",
                color: active ? "var(--card)" : "var(--muted)",
                fontWeight: active ? 600 : 400,
              }}
              aria-pressed={active}
            >
              {r}
            </button>
          );
        })}
      </div>

      {/* チャート */}
      <div
        ref={containerRef}
        style={{ width: "100%", height: 220, overflow: "hidden" }}
        role="img"
        aria-label={`${config.title} ${range} チャート`}
      >
        {hasData && (
          <LineChart
            width={containerWidth}
            height={220}
            data={series.points}
            margin={{ top: 12, right: 16, bottom: 4, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 4" stroke="var(--border)" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "var(--muted)" }}
              interval={xAxisInterval(series.points.length)}
              minTickGap={20}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--muted)" }}
              width={50}
              domain={[yMin, yMax]}
              tickFormatter={v => formatMarketValue(v, config.decimals)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelFormatter={(_, payload) => {
                const detail = payload?.[0]?.payload?.detail;
                return typeof detail === "string" ? detail : "";
              }}
              formatter={(value: number) => [
                `${formatMarketValue(value, config.decimals)} ${config.unit}`,
                config.title,
              ]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={config.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
          </LineChart>
        )}
      </div>

      {/* フッター：出典 + 更新日 */}
      <div className="flex items-center justify-between gap-3 flex-wrap text-xs" style={{ color: "var(--muted)" }}>
        <span>{config.sourceLabel}</span>
        <span>更新: {DAILY_GENERATED_AT}</span>
      </div>
    </section>
  );
}

function chooseDeltaColor(delta: number | null): string {
  if (delta == null || !Number.isFinite(delta)) return "var(--muted)";
  if (delta > 0) return "#dc2626"; // 上昇＝赤（円安/株高）
  if (delta < 0) return "#059669"; // 下落＝緑（円高/株安）
  return "var(--muted)";
}

function formatSignedNumber(n: number | null, decimals: number): string {
  if (n == null || !Number.isFinite(n)) return "—";
  const rounded = Number(n.toFixed(decimals));
  if (rounded === 0) return formatMarketValue(0, decimals);
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${formatMarketValue(rounded, decimals)}`;
}

function formatSignedPct(pct: number): string {
  const rounded = Number(pct.toFixed(2));
  if (rounded === 0) return "0.00%";
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded.toFixed(2)}%`;
}

/** データ件数から X軸ティック間隔を控えめに（ラベル衝突防止） */
function xAxisInterval(n: number): number | "preserveStartEnd" {
  if (n <= 10) return 0;
  if (n <= 30) return 2;
  if (n <= 60) return 4;
  return "preserveStartEnd";
}
