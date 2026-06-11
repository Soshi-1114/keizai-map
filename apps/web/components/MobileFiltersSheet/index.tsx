"use client";

import type { EventCategory } from "@/lib/types";
import { COLORS } from "@/lib/constants";
import { DATA_YEARS } from "@/lib/constants";
import { EraShortcuts } from "@/components/EraShortcuts";
import { RangeSlider } from "@/components/RangeSlider";
import { EventFilter } from "@/components/EventFilter";

const ALL_CATEGORIES: EventCategory[] = ["税制", "経済", "経済政策"];

interface Props {
  yearRange: [number, number];
  activeCategories: EventCategory[];
  onYearRangeChange: (range: [number, number]) => void;
  onCategoryToggle: (cat: EventCategory) => void;
  onClose: () => void;
}

export function MobileFiltersSheet({
  yearRange,
  activeCategories,
  onYearRangeChange,
  onCategoryToggle,
  onClose,
}: Props) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl p-6 space-y-4 max-h-[80vh] overflow-y-auto"
        style={{
          backgroundColor: "var(--card)",
          borderTop: "1px solid var(--border)",
          animation: "slideUp 0.3s ease-out",
        }}
      >
        {/* Handle */}
        <div className="flex justify-center mb-2">
          <div className="h-1 w-12 rounded-full" style={{ backgroundColor: "var(--border)" }} />
        </div>

        {/* 注目の期間 */}
        <div>
          <h2 className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>注目の期間</h2>
          <EraShortcuts yearRange={yearRange} onRangeChange={onYearRangeChange} />
        </div>

        {/* 表示期間スライダー */}
        <section aria-labelledby="range-heading-sheet">
          <h2 id="range-heading-sheet" className="text-xs font-medium mb-3" style={{ color: "var(--muted)" }}>
            表示期間
          </h2>
          <RangeSlider
            min={DATA_YEARS.MIN}
            max={DATA_YEARS.MAX}
            value={yearRange}
            onChange={onYearRangeChange}
            step={1}
            aria-label={`表示期間: ${yearRange[0]}年から${yearRange[1]}年まで`}
          />
        </section>

        {/* イベントフィルター */}
        <section aria-labelledby="event-heading-sheet">
          <h2 id="event-heading-sheet" className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>
            経済イベントフィルター
          </h2>
          <EventFilter
            categories={ALL_CATEGORIES}
            activeCategories={activeCategories}
            onToggle={onCategoryToggle}
          />
        </section>

        {/* 閉じるボタン */}
        <div className="pt-4 border-t" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            style={{ backgroundColor: COLORS.PRIMARY, color: "#fff" }}
          >
            閉じる
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
