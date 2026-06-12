import { MapPin } from "lucide-react";
import type { EconomicEvent, IndicatorKey } from "@/lib/types";
import { INDICATOR_CONFIGS } from "@/lib/data";

/** 元の単位での表示文字列を生成（Chart 本体と共有のため再公開） */
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

interface Props {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
    payload: Record<string, number | null>;
  }>;
  label?: number;
  /** Chart 側で計算した「現在表示中のイベント一覧」 */
  visibleEvents: EconomicEvent[];
}

/**
 * チャート用カスタム Tooltip。指数値 + 元単位値 + 近傍イベント情報を統合表示する。
 *
 * 元は `Chart/index.tsx` の関数内 (renderごとに新しい参照) として定義されていたため、
 * Recharts 内部で content の参照変化により余計な再描画が起きていた。
 * 独立ファイル化することで安定参照になり、`<Tooltip content={EventTooltip} />` のように
 * **コンポーネント参照を直接渡せる**。
 */
export function EventTooltip({ active, payload, label, visibleEvents }: Props) {
  if (!active || !payload?.length || label == null) return null;

  const nearEvents = visibleEvents
    .filter(e => Math.abs(e.year - label) <= 1)
    .sort((a, b) => Math.abs(a.year - label) - Math.abs(b.year - label));

  const dataItems = payload.filter(p => p.value != null && !String(p.dataKey).startsWith("g7"));

  return (
    <div
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "8px 12px",
        fontSize: 12,
        maxWidth: 260,
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
      }}
    >
      <div
        style={{
          color: "var(--text)",
          fontWeight: "bold",
          marginBottom: nearEvents.length ? 6 : 4,
        }}
      >
        {label}年
      </div>

      {nearEvents.length > 0 && (
        <div
          style={{
            marginBottom: 6,
            paddingBottom: 6,
            borderBottom: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {nearEvents.map(ev => (
            <div
              key={`${ev.year}-${ev.label}`}
              style={{
                color: ev.color,
                fontWeight: 600,
                fontSize: 11,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <MapPin size={11} aria-hidden />
              {ev.year !== label ? `${ev.year}年 ` : ""}
              {ev.label}
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
          <div
            key={String(entry.dataKey)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              color: entry.color,
              lineHeight: "1.6",
            }}
          >
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
