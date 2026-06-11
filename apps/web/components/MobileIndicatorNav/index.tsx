"use client";

import { INDICATOR_CONFIGS, RAW_DATA } from "@/lib/data";

interface MobileIndicatorNavProps {
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export function MobileIndicatorNav({ currentIndex, onIndexChange }: MobileIndicatorNavProps) {
  const current = INDICATOR_CONFIGS[currentIndex];

  // 1990 → 2024 の変化率を計算
  const startVal = RAW_DATA[0]?.[current.key] ?? 100;
  const endVal = RAW_DATA[RAW_DATA.length - 1]?.[current.key] ?? 100;
  const pctChange = ((endVal - startVal) / startVal) * 100;
  const sign = pctChange >= 0 ? "+" : "";
  const color = pctChange >= 0 ? "#22c55e" : "#ef4444";

  const handlePrev = () => {
    onIndexChange(currentIndex === 0 ? INDICATOR_CONFIGS.length - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    onIndexChange((currentIndex + 1) % INDICATOR_CONFIGS.length);
  };

  return (
    <div className="flex items-center justify-between gap-2 p-3 rounded-lg mb-3" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)", border: "1px solid" }}>
      <button
        onClick={handlePrev}
        className="px-2 py-1 rounded-md text-xs font-medium transition-colors hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600"
        style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
      >
        ← 前
      </button>

      <div className="flex-1 text-center">
        <div className="text-xs" style={{ color: "var(--muted)" }}>
          {currentIndex + 1} / {INDICATOR_CONFIGS.length}
        </div>
        <div className="text-sm font-bold" style={{ color: current.color }}>
          {current.label}
        </div>
        <div className="text-xs font-semibold mt-0.5" style={{ color }}>
          {sign}{pctChange.toFixed(1)}%
        </div>
      </div>

      <button
        onClick={handleNext}
        className="px-2 py-1 rounded-md text-xs font-medium transition-colors hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600"
        style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
      >
        次 →
      </button>
    </div>
  );
}
