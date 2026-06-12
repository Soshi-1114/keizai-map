"use client";

import type { EventCategory, IndicatorKey } from "@/lib/types";
import { FilterSection } from "./FilterSection";
import { RelatedArticles } from "./RelatedArticles";

interface Props {
  yearRange: [number, number];
  activeIndicators: IndicatorKey[];
  activeCategories: EventCategory[];
  onYearRangeChange: (range: [number, number]) => void;
  /** スライダー操作確定時 (pointerup / キー操作後) のコールバック */
  onYearRangeCommit?: (range: [number, number]) => void;
  onCategoryToggle: (cat: EventCategory) => void;
}

/**
 * xl (1280px) 以上で右側に常設するサイドバー。
 * 期間フィルター + 関連記事を集約してメインカラムの縦長スクロールを軽減する。
 * xl 未満では `hidden` で非表示にし、MainView 側で従来の縦並びを維持。
 */
export function Sidebar({
  yearRange,
  activeIndicators,
  activeCategories,
  onYearRangeChange,
  onYearRangeCommit,
  onCategoryToggle,
}: Props) {
  return (
    <aside
      className="hidden xl:flex xl:flex-col xl:gap-4 xl:sticky xl:top-4 xl:self-start"
      aria-label="サイドバー: フィルターと関連記事"
    >
      <FilterSection
        yearRange={yearRange}
        activeCategories={activeCategories}
        onYearRangeChange={onYearRangeChange}
        onYearRangeCommit={onYearRangeCommit}
        onCategoryToggle={onCategoryToggle}
        isMobile={false}
      />
      <RelatedArticles activeIndicators={activeIndicators} yearRange={yearRange} />
    </aside>
  );
}
