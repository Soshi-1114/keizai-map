"use client";

import { useState } from "react";
import {
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceLine, ResponsiveContainer,
} from "recharts";
import type { EventCategory, IndicatorKey } from "@/lib/types";
import { RAW_DATA, INDICATOR_CONFIGS } from "@/lib/data";

// ─────────────────────────────────────────────────────────
// 共通スタイル
// ─────────────────────────────────────────────────────────

const TT = {
  contentStyle: {
    backgroundColor: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    fontSize: 12,
  },
  labelStyle: { color: "var(--text)", fontWeight: "bold" as const },
  itemStyle: { color: "var(--text)" },
};

// ─────────────────────────────────────────────────────────
// 政権別パフォーマンスのデータ定義
// ─────────────────────────────────────────────────────────

const NOTABLE_ADMINS = [
  { name: "橋本 '96-'98",  start: 1996, end: 1998, party: "自民党" },
  { name: "小渕 '98-'00",  start: 1998, end: 2000, party: "自民党" },
  { name: "小泉 '01-'06",  start: 2001, end: 2006, party: "自民党" },
  { name: "民主 '09-'12",  start: 2009, end: 2012, party: "民主党" },
  { name: "安倍② '12-'20", start: 2012, end: 2020, party: "自民党" },
  { name: "岸田 '21-'24",  start: 2021, end: 2024, party: "自民党" },
] as const;

// ─────────────────────────────────────────────────────────
// 経済ショック比較のデータ定義
// ─────────────────────────────────────────────────────────

const SHOCK_EVENTS = [
  { label: "バブル崩壊('90)", year: 1990, color: "#E05C5C", dash: undefined as string | undefined },
  { label: "リーマン('08)",   year: 2008, color: "#D97706", dash: "6 3"  as string | undefined },
  { label: "コロナ禍('20)",   year: 2020, color: "#4FD9A0", dash: "3 3"  as string | undefined },
];

// 発生時を0として前後の相対年（2年刻み）
const RELATIVE_OFFSETS = [-2, 0, 2, 4, 6];

// ─────────────────────────────────────────────────────────
// ヘルパー
// ─────────────────────────────────────────────────────────

function atOrAfter(year: number) {
  return RAW_DATA
    .filter(d => d.year >= year)
    .sort((a, b) => a.year - b.year)[0];
}

function atOrBefore(year: number) {
  return RAW_DATA
    .filter(d => d.year <= year)
    .sort((a, b) => b.year - a.year)[0];
}

function changePct(start: number, end: number): number {
  return Math.round(((end - start) / start) * 1000) / 10;
}

// ─────────────────────────────────────────────────────────
// 政権別パフォーマンス棒グラフ
// ─────────────────────────────────────────────────────────

function AdminChart({
  activeIndicators,
  yearRange,
}: {
  activeIndicators: IndicatorKey[];
  yearRange: [number, number];
}) {
  const shown = INDICATOR_CONFIGS.filter(c => activeIndicators.includes(c.key));
  const [rangeStart, rangeEnd] = yearRange;

  // 期間と重なる政権だけを対象に
  const visibleAdmins = NOTABLE_ADMINS.filter(
    admin => admin.end > rangeStart && admin.start < rangeEnd,
  );

  const data = visibleAdmins.map(admin => {
    const sYear = Math.max(admin.start, rangeStart);
    const eYear = Math.min(admin.end, rangeEnd);
    const s = atOrAfter(sYear);
    const e = atOrBefore(eYear);
    if (!s || !e || s.year === e.year) return null;
    return {
      name:      `${admin.name}\n(${admin.party})`,
      startYear: s.year,
      endYear:   e.year,
      party:     admin.party,
      wage:      changePct(s.wage, e.wage),
      cpi:       changePct(s.cpi,  e.cpi),
      tax:       changePct(s.tax,  e.tax),
      fx:        changePct(s.fx,   e.fx),
    };
  }).filter((d): d is NonNullable<typeof d> => d !== null);

  if (shown.length === 0) {
    return (
      <p className="text-sm text-center py-8" style={{ color: "var(--muted)" }}>
        比較する指標を 1 つ以上選択してください。
      </p>
    );
  }
  if (data.length === 0) {
    return (
      <p className="text-sm text-center py-8" style={{ color: "var(--muted)" }}>
        選択期間（{rangeStart}〜{rangeEnd}年）に該当する政権がありません。
      </p>
    );
  }

  return (
    <div>
      <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
        各政権の就任期間中における指標変化率（%）。2年ごとの最近接データから算出。
        正の値が必ずしも「良い」とは限りません。
      </p>
      <ResponsiveContainer width="100%" height={Math.max(300, data.length * 64)}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 4, right: 56, left: 8, bottom: 4 }}
          barCategoryGap="32%"
          barGap={2}
        >
          <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis
            type="number"
            tickFormatter={v => `${v}%`}
            stroke="var(--border)"
            tick={{ fill: "var(--muted)", fontSize: 11 }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tick={{ fill: "var(--text)", fontSize: 11 }}
            tickLine={false}
            interval={0}
          />
          <Tooltip
            {...TT}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            labelFormatter={(_: unknown, payload: any[]) => {
              const d = payload?.[0]?.payload;
              return d ? `${d.name.replace(/\n/g, " ")}（${d.startYear}→${d.endYear}年）` : "";
            }}
            formatter={(v: number, name: string) => [
              `${v > 0 ? "+" : ""}${v.toFixed(1)}%`,
              name,
            ]}
          />
          <Legend
            wrapperStyle={{ paddingTop: 12 }}
            formatter={v => <span style={{ color: "var(--text)", fontSize: 12 }}>{v}</span>}
          />
          <ReferenceLine x={0} stroke="var(--text)" strokeOpacity={0.25} strokeWidth={2} />
          {shown.map(cfg => (
            <Bar
              key={cfg.key}
              dataKey={cfg.key}
              name={cfg.label}
              fill={cfg.color}
              radius={2}
              maxBarSize={16}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 経済ショック比較折れ線グラフ
// ─────────────────────────────────────────────────────────

function ShockChart({
  activeIndicators,
  yearRange,
}: {
  activeIndicators: IndicatorKey[];
  yearRange: [number, number];
}) {
  const [rangeStart, rangeEnd] = yearRange;
  // 期間内で発生したショックだけに絞る（発生時±2年が範囲に重なる場合）
  const visibleShocks = SHOCK_EVENTS.filter(
    ev => ev.year >= rangeStart - 2 && ev.year <= rangeEnd + 2,
  );

  // 上位フィルタで選択中の指標を優先的に表示。なければ wage にフォールバック
  const defaultIndicator: IndicatorKey =
    activeIndicators.length > 0 ? activeIndicators[0] : "wage";
  const [indicator, setIndicator] = useState<IndicatorKey>(defaultIndicator);
  const cfg = INDICATOR_CONFIGS.find(c => c.key === indicator)!;

  // ショック発生時=100 に正規化したデータを構築
  const data = RELATIVE_OFFSETS.map(rel => {
    const row: Record<string, string | number | null> = {
      label: rel === 0 ? "発生時" : rel > 0 ? `+${rel}年` : `${rel}年`,
    };
    for (const ev of visibleShocks) {
      const base   = RAW_DATA.find(d => d.year === ev.year);
      const target = RAW_DATA.find(d => d.year === ev.year + rel);
      row[ev.label] =
        base && target && base[indicator] && target[indicator]
          ? Math.round((target[indicator] / base[indicator]) * 1000) / 10
          : null;
    }
    return row;
  });

  if (visibleShocks.length === 0) {
    return (
      <p className="text-sm text-center py-8" style={{ color: "var(--muted)" }}>
        選択期間（{rangeStart}〜{rangeEnd}年）にショックイベントがありません。
        スライダーを広げてください。
      </p>
    );
  }

  return (
    <div>
      {/* 指標セレクター */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-xs shrink-0" style={{ color: "var(--muted)" }}>表示指標:</span>
        {INDICATOR_CONFIGS.map(c => (
          <button
            key={c.key}
            onClick={() => setIndicator(c.key)}
            className="px-3 py-1 rounded-full text-xs border transition-all"
            style={{
              borderColor:     indicator === c.key ? c.color : "var(--border)",
              color:           indicator === c.key ? c.color : "var(--muted)",
              backgroundColor: indicator === c.key ? c.color + "20" : "transparent",
              fontWeight:      indicator === c.key ? 600 : 400,
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
        各ショック発生時を100として指数化。{cfg.label}がどのように変動したかを比較。
        バブル崩壊は1990年始点のため -2年データなし。
      </p>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 8, right: 48, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="label"
            stroke="var(--border)"
            tick={{ fill: "var(--muted)", fontSize: 11 }}
            tickLine={false}
          />
          <YAxis
            stroke="transparent"
            tick={{ fill: "var(--muted)", fontSize: 11 }}
            tickLine={false}
          />
          <Tooltip
            {...TT}
            formatter={(v: number, name: string) => [
              `${v.toFixed(1)}（発生時=100）`,
              name,
            ]}
          />
          <Legend
            wrapperStyle={{ paddingTop: 8 }}
            formatter={v => <span style={{ color: "var(--text)", fontSize: 12 }}>{v}</span>}
          />
          <ReferenceLine
            y={100}
            stroke="var(--border)"
            strokeDasharray="4 2"
            strokeWidth={1.5}
            label={{ value: "100", position: "right", fill: "var(--muted)", fontSize: 10 }}
          />
          {visibleShocks.map(ev => (
            <Line
              key={ev.label}
              type="monotone"
              dataKey={ev.label}
              stroke={ev.color}
              strokeWidth={2}
              strokeDasharray={ev.dash}
              dot={{ fill: ev.color, r: 4, strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--card)" }}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 詳細イベント分析
// ─────────────────────────────────────────────────────────

function EventDetailChart({
  activeIndicators,
  yearRange,
}: {
  activeIndicators: IndicatorKey[];
  yearRange: [number, number];
}) {
  const [rangeStart, rangeEnd] = yearRange;
  const visibleShocks = SHOCK_EVENTS.filter(
    ev => ev.year >= rangeStart - 2 && ev.year <= rangeEnd + 2,
  );
  const eventChoices = visibleShocks.length > 0 ? visibleShocks : SHOCK_EVENTS;

  const [selectedEvent, setSelectedEvent] = useState<typeof SHOCK_EVENTS[0]>(eventChoices[0]);
  // activeIndicators が空でも全指標から選べるようにフォールバック
  const indicatorChoices = activeIndicators.length > 0 ? activeIndicators : INDICATOR_CONFIGS.map(c => c.key);
  const [selectedIndicator, setSelectedIndicator] = useState<IndicatorKey>(indicatorChoices[0] || "wage");

  const chartData = SHOCK_EVENTS.map(ev => {
    const label = ev.label;
    const values: Record<string, number | string> = { name: label };

    for (let offset = -2; offset <= 4; offset++) {
      const point = RAW_DATA.find(d => d.year === ev.year + offset);
      if (point && point[selectedIndicator] !== undefined) {
        const key = `y${offset}`;
        values[key] = point[selectedIndicator] as number;
      }
    }
    return values;
  });

  const selectedEvData = chartData.find(d => d.name === selectedEvent.label);

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <label style={{ fontSize: "0.875rem", color: "var(--muted)", display: "block", marginBottom: "0.5rem" }}>
            イベント選択
          </label>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {eventChoices.map(ev => (
              <button
                key={ev.label}
                onClick={() => setSelectedEvent(ev)}
                aria-pressed={selectedEvent.label === ev.label}
                className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                style={{
                  padding: "0.5rem 1rem",
                  border: `1px solid ${selectedEvent.label === ev.label ? ev.color : "var(--border)"}`,
                  backgroundColor: selectedEvent.label === ev.label ? `${ev.color}20` : "transparent",
                  color: selectedEvent.label === ev.label ? ev.color : "var(--text)",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: selectedEvent.label === ev.label ? 600 : 400,
                  transition: "all 200ms",
                }}
              >
                {ev.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontSize: "0.875rem", color: "var(--muted)", display: "block", marginBottom: "0.5rem" }}>
            指標選択
          </label>
          <select
            value={selectedIndicator}
            onChange={(e) => setSelectedIndicator(e.target.value as IndicatorKey)}
            aria-label="比較する指標を選択"
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              border: "1px solid var(--border)",
              backgroundColor: "var(--card)",
              color: "var(--text)",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            {indicatorChoices.map(key => {
              const cfg = INDICATOR_CONFIGS.find(c => c.key === key);
              return <option key={key} value={key}>{cfg?.label}</option>;
            })}
          </select>
        </div>
      </div>

      {selectedEvData && (
        <div
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <h3 style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "1rem", color: "var(--muted)" }}>
            {selectedEvent.label} 前後の {INDICATOR_CONFIGS.find(c => c.key === selectedIndicator)?.label}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", gap: "0.75rem" }}>
            {[-2, -1, 0, 1, 2, 3, 4].map(offset => {
              const key = `y${offset}`;
              const value = selectedEvData[key];
              return (
                <div
                  key={key}
                  style={{
                    backgroundColor: offset === 0 ? `${selectedEvent.color}30` : "transparent",
                    border: offset === 0 ? `2px solid ${selectedEvent.color}` : "1px solid var(--border)",
                    borderRadius: "0.375rem",
                    padding: "0.75rem",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "0.25rem" }}>
                    {offset === 0 ? "発生時" : offset > 0 ? `+${offset}年` : `${offset}年`}
                  </div>
                  <div className="tabular-nums" style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text)" }}>
                    {value !== undefined && typeof value === "number" ? value.toFixed(1) : "—"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// メインエクスポート
// ─────────────────────────────────────────────────────────

interface Props {
  mode: "admin" | "shock" | "event";
  activeIndicators: IndicatorKey[];
  yearRange: [number, number];
  activeCategories?: EventCategory[];
}

export function ComparisonView({ mode, activeIndicators, yearRange }: Props) {
  return (
    <>
      {mode === "admin" ? (
        <AdminChart activeIndicators={activeIndicators} yearRange={yearRange} />
      ) : mode === "shock" ? (
        <ShockChart activeIndicators={activeIndicators} yearRange={yearRange} />
      ) : (
        <EventDetailChart activeIndicators={activeIndicators} yearRange={yearRange} />
      )}
    </>
  );
}
