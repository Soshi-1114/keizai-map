"use client";

import { memo } from "react";
import type { DataPoint, IndicatorKey } from "@/lib/types";
import { INDICATOR_CONFIGS, INDICATOR_LAST_YEAR } from "@/lib/data";

interface Props {
  data: DataPoint[];
  yearRange?: [number, number];
  /** 表示する指標。指定がない場合は全指標。0 件なら何も描画しない。 */
  activeIndicators?: IndicatorKey[];
  /** 後方互換: 単一指標フォーカス（既存呼び出し向け） */
  focusedKey?: IndicatorKey;
}

function unitShortOf(key: IndicatorKey): string {
  switch (key) {
    case "tax":
    case "debt":
      return "兆円";
    case "fx":
      return "円";
    case "births":
      return "万人";
    case "insurance":
      return "%";
    default:
      return "";
  }
}

function InsightCardsImpl({ data, activeIndicators, focusedKey }: Props) {
  if (data.length < 1) return null;

  const start = data[0];
  const end = data[data.length - 1];
  const sameYear = start.year === end.year || data.length < 2;

  const configs = focusedKey
    ? INDICATOR_CONFIGS.filter(c => c.key === focusedKey)
    : activeIndicators
      ? INDICATOR_CONFIGS.filter(c => activeIndicators.includes(c.key))
      : INDICATOR_CONFIGS;

  if (configs.length === 0) return null;

  return (
    <div
      className={configs.length === 1 ? "grid grid-cols-1 gap-3" : "grid grid-cols-2 md:grid-cols-4 gap-3"}
      aria-label={sameYear ? `${start.year}年の指標` : `${start.year}年から${end.year}年の変化`}
    >
      {configs.map(cfg => {
        const startVal = start[cfg.key] as number | null;
        const endVal = end[cfg.key] as number | null;
        if (startVal == null || endVal == null) return null;

        const unit = unitShortOf(cfg.key);

        const lastDataYear = INDICATOR_LAST_YEAR[cfg.key];

        if (sameYear) {
          return (
            <div
              key={cfg.key}
              className="rounded-xl border p-4"
              style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            >
              <div
                className="text-xs font-medium mb-2 truncate"
                style={{ color: cfg.color }}
              >
                {cfg.label}
              </div>
              <div className="text-2xl font-bold tabular-nums leading-none" style={{ color: cfg.color }}>
                {endVal.toFixed(1)}
                {unit && <span className="text-base ml-0.5 font-medium">{unit}</span>}
              </div>
              <div className="mt-3 text-tiny" style={{ color: "var(--muted)" }}>
                {start.year}年 単年値
              </div>
              <div className="mt-1 text-tiny tabular-nums" style={{ color: "var(--muted)" }}>
                データ最終: {lastDataYear}年
              </div>
            </div>
          );
        }

        const delta = endVal - startVal;
        const deltaPct = startVal !== 0 ? (delta / startVal) * 100 : 0;
        const sign = delta >= 0 ? "+" : "";
        const deltaColor = delta >= 0 ? "#22c55e" : "#ef4444";

        return (
          <div
            key={cfg.key}
            className="rounded-xl border p-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <div
              className="text-xs font-medium mb-2 truncate"
              style={{ color: cfg.color }}
            >
              {cfg.label}
            </div>
            <div className="text-2xl font-bold tabular-nums leading-none" style={{ color: deltaColor }}>
              {sign}{deltaPct.toFixed(1)}%
            </div>
            <div className="mt-2 space-y-0.5">
              <div className="text-tiny" style={{ color: "var(--muted)" }}>
                {start.year}年 → {end.year}年
              </div>
              <div className="text-tiny tabular-nums" style={{ color: "var(--muted)" }}>
                {startVal.toFixed(1)}{unit} → {endVal.toFixed(1)}{unit}
              </div>
              <div className="text-tiny tabular-nums" style={{ color: "var(--muted)" }}>
                データ最終: {lastDataYear}年
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const InsightCards = memo(InsightCardsImpl);

