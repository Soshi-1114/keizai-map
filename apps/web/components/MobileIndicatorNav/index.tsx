"use client";

import type { DataPoint } from "@/lib/types";
import { INDICATOR_CONFIGS } from "@/lib/data";

interface MobileIndicatorNavProps {
  currentIndex: number;
  onIndexChange: (index: number) => void;
  filteredData: DataPoint[];
  yearRange: [number, number];
}

export function MobileIndicatorNav({ currentIndex, onIndexChange, filteredData, yearRange }: MobileIndicatorNavProps) {
  const current = INDICATOR_CONFIGS[currentIndex];
  const total = INDICATOR_CONFIGS.length;

  // 選択期間の変化率を計算
  const startPoint = filteredData[0];
  const endPoint = filteredData[filteredData.length - 1];
  const startVal = startPoint?.[current.key] ?? null;
  const endVal = endPoint?.[current.key] ?? null;
  const pctChange = startVal && endVal ? ((endVal - startVal) / startVal) * 100 : null;
  const sign = pctChange !== null && pctChange >= 0 ? "+" : "";
  const changeColor = pctChange === null ? "var(--muted)" : pctChange >= 0 ? "#22c55e" : "#ef4444";

  const handlePrev = () => onIndexChange(currentIndex === 0 ? total - 1 : currentIndex - 1);
  const handleNext = () => onIndexChange((currentIndex + 1) % total);

  return (
    <div
      className="flex items-center gap-3 px-3 py-2 rounded-xl"
      style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
    >
      {/* 前ボタン — 44px タップ領域確保 */}
      <button
        onClick={handlePrev}
        aria-label="前の指標"
        className="flex items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600"
        style={{
          minWidth: 44, minHeight: 44,
          backgroundColor: "var(--bg)",
          color: "var(--muted)",
          fontSize: 20,
          flexShrink: 0,
        }}
      >
        ‹
      </button>

      {/* 中央：指標名 + 変化率 + ドットナビ */}
      <div className="flex-1 flex flex-col items-center gap-1 min-w-0">
        {/* 指標名 */}
        <span className="text-sm font-bold truncate" style={{ color: current.color }}>
          {current.label}
        </span>

        {/* 変化率 + 期間 */}
        <div className="flex items-baseline gap-1.5">
          {pctChange !== null ? (
            <span className="text-base font-bold tabular-nums" style={{ color: changeColor }}>
              {sign}{pctChange.toFixed(1)}%
            </span>
          ) : (
            <span className="text-xs" style={{ color: "var(--muted)" }}>—</span>
          )}
          <span className="text-tiny" style={{ color: "var(--muted)" }}>
            {yearRange[0]}–{yearRange[1]}
          </span>
        </div>

        {/* ドットナビゲーター — 透明タップ領域 36px に視覚ドット 8px を内包（WCAG 2.5.5） */}
        <div className="flex mt-0.5" role="tablist" aria-label="指標を切り替え">
          {INDICATOR_CONFIGS.map((cfg, i) => {
            const isCurrent = i === currentIndex;
            return (
              <button
                key={cfg.key}
                role="tab"
                aria-selected={isCurrent}
                aria-label={cfg.label}
                onClick={() => onIndexChange(i)}
                className="focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600 rounded"
                style={{
                  minWidth: 28,
                  minHeight: 36,
                  padding: "12px 4px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    display: "block",
                    width: isCurrent ? 18 : 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: isCurrent ? current.color : "var(--border)",
                    transition: "width 0.2s ease, background-color 0.2s ease",
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* 次ボタン — 44px タップ領域確保 */}
      <button
        onClick={handleNext}
        aria-label="次の指標"
        className="flex items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600"
        style={{
          minWidth: 44, minHeight: 44,
          backgroundColor: "var(--bg)",
          color: "var(--muted)",
          fontSize: 20,
          flexShrink: 0,
        }}
      >
        ›
      </button>
    </div>
  );
}
