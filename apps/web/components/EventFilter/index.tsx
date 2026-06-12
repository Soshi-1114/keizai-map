"use client";

import type { EventCategory } from "@/lib/types";

interface Props {
  categories: EventCategory[];
  activeCategories: EventCategory[];
  onToggle: (category: EventCategory) => void;
}

// EVENTS の参照線色と一致させ、薄背景上の WCAG AA を満たす深色
const COLORS: Record<EventCategory, string> = {
  "税制":   "#B45309",
  "経済":   "#B91C1C",
  "経済政策": "#047857",
};

export function EventFilter({ categories, activeCategories, onToggle }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map(cat => {
        const active = activeCategories.includes(cat);
        const color  = COLORS[cat];
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onToggle(cat)}
            aria-pressed={active}
            aria-label={`${cat}カテゴリのイベントを${active ? "非表示" : "表示"}`}
            className="rounded-full text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            style={{
              // タップ領域 44x44 を確保（WCAG 2.5.5 推奨）
              minHeight: 44,
              padding: "0 14px",
              // 非アクティブ時も透明度を下げず、線種で状態を区別
              border: active ? `2px solid ${color}` : "1.5px dashed var(--border)",
              color: active ? color : "var(--text)",
              backgroundColor: active ? color + "15" : "transparent",
            }}
          >
            <span
              aria-hidden
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: 9999,
                marginRight: 6,
                backgroundColor: active ? color : "transparent",
                border: `1.5px solid ${color}`,
                verticalAlign: "middle",
              }}
            />
            {cat}
          </button>
        );
      })}
    </div>
  );
}
