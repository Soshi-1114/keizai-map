"use client";

import type { EventCategory } from "@/lib/types";
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
  /** RangeSlider に伝搬する SP判定（親で1回 useIsMobile） */
  isMobile: boolean;
}

export function FilterSection({
  yearRange,
  activeCategories,
  onYearRangeChange,
  onCategoryToggle,
  isMobile,
}: Props) {
  return (
    <div
      className="rounded-xl border p-4 space-y-4"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      <div>
        <h2 className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>
          注目の期間
        </h2>
        <EraShortcuts yearRange={yearRange} onRangeChange={onYearRangeChange} />
      </div>

      <section aria-labelledby="range-heading">
        <h2 id="range-heading" className="text-xs font-medium mb-3" style={{ color: "var(--muted)" }}>
          表示期間
        </h2>
        <RangeSlider
          min={DATA_YEARS.MIN}
          max={DATA_YEARS.MAX}
          value={yearRange}
          onChange={onYearRangeChange}
          step={1}
          isMobile={isMobile}
          aria-label={`表示期間: ${yearRange[0]}年から${yearRange[1]}年まで`}
        />
      </section>

      <section aria-labelledby="event-heading">
        <h2 id="event-heading" className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>
          経済イベントフィルター
        </h2>
        <EventFilter
          categories={ALL_CATEGORIES}
          activeCategories={activeCategories}
          onToggle={onCategoryToggle}
        />
      </section>
    </div>
  );
}
