"use client";

import type { IndicatorKey } from "@/lib/types";
import { INDICATOR_CONFIGS } from "@/lib/data";

interface Props {
  activeIndicators: IndicatorKey[];
  onToggle: (key: IndicatorKey) => void;
  onSetAll: (keys: IndicatorKey[]) => void;
  variant: "pc" | "mobile";
}

const ALL_INDICATOR_KEYS = INDICATOR_CONFIGS.map(c => c.key) as IndicatorKey[];
const DEFAULT_INDICATORS: IndicatorKey[] = ["wage", "cpi"];

export function IndicatorToggleBar({ activeIndicators, onToggle, onSetAll, variant }: Props) {
  if (variant === "pc") {
    return (
      <section aria-labelledby="indicators-heading">
        <h2 id="indicators-heading" className="sr-only">表示する指標を選択</h2>
        <div
          className="flex gap-2 flex-wrap items-center"
          role="group"
          aria-labelledby="indicators-heading"
        >
          {INDICATOR_CONFIGS.map(cfg => {
            const active = activeIndicators.includes(cfg.key);
            return (
              <button
                key={cfg.key}
                onClick={() => onToggle(cfg.key)}
                aria-pressed={active}
                className="px-3 py-1.5 md:py-1 rounded-full text-sm border transition-all font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                style={{
                  borderColor: active ? cfg.color : "var(--border)",
                  color: active ? cfg.darkColor : "var(--muted)",
                  backgroundColor: active ? cfg.color + "15" : "transparent",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {cfg.label}
              </button>
            );
          })}
          <div className="ml-auto flex gap-1.5">
            <button
              onClick={() => onSetAll(ALL_INDICATOR_KEYS)}
              className="px-2.5 py-1 rounded-full text-xs border font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              style={{ borderColor: "var(--border)", color: "var(--muted)" }}
            >
              全指標
            </button>
            <button
              onClick={() => onSetAll(DEFAULT_INDICATORS)}
              className="px-2.5 py-1 rounded-full text-xs border font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              style={{ borderColor: "var(--border)", color: "var(--muted)" }}
            >
              リセット
            </button>
          </div>
        </div>
        <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
          最初は <strong>実質賃金 + 物価</strong> の 2 指標を表示しています。
          比べたい指標をクリックして追加できます（最大 9 指標）。
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="mobile-indicators-heading">
      <h2
        id="mobile-indicators-heading"
        className="text-xs font-medium mb-2"
        style={{ color: "var(--muted)" }}
      >
        重ねて表示する指標
      </h2>
      <div
        className="flex gap-1.5 flex-wrap"
        role="group"
        aria-labelledby="mobile-indicators-heading"
      >
        {INDICATOR_CONFIGS.map(cfg => {
          const active = activeIndicators.includes(cfg.key);
          return (
            <button
              key={cfg.key}
              onClick={() => onToggle(cfg.key)}
              aria-pressed={active}
              className="rounded-full text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              style={{
                minHeight: 36,
                padding: "0 10px",
                border: `1px solid ${active ? cfg.color : "var(--border)"}`,
                color: active ? cfg.darkColor : "var(--muted)",
                backgroundColor: active ? cfg.color + "15" : "transparent",
                fontWeight: active ? 600 : 400,
              }}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
