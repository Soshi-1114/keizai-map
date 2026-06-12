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
            onClick={() => onToggle(cat)}
            className="px-3 py-1 rounded-full text-sm border transition-all"
            style={{
              borderColor: color,
              color: active ? color : "var(--muted)",
              backgroundColor: active ? color + "20" : "transparent",
              opacity: active ? 1 : 0.5,
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
