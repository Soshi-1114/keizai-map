"use client";

import { useState } from "react";
import type { IndicatorKey, EventCategory } from "@/lib/types";
import { useIsMobile } from "@/lib/hooks";
import { INDICATOR_CONFIGS } from "@/lib/data";
import { parseRange, parseIndicators, parseCategories } from "@/lib/utils";
import {
  useFilteredData,
  useEffectiveIndicators,
  useUrlSync,
} from "@/lib/dashboard-hooks";
import { InsightCards } from "./InsightCards";
import { ComparisonView } from "./ComparisonView";
import { MobileIndicatorNav } from "./MobileIndicatorNav";
import { MobileFiltersSheet } from "./MobileFiltersSheet";
import { DashboardHeader } from "./Dashboard/DashboardHeader";
import { IndicatorToggleBar } from "./Dashboard/IndicatorToggleBar";
import { HeroStatsBar } from "./Dashboard/HeroStatsBar";
import { FilterSection } from "./Dashboard/FilterSection";
import { ViewModeTabs, VIEW_MODES, type ViewMode } from "./Dashboard/ViewModeTabs";
import { ChartPanel } from "./Dashboard/ChartPanel";
import { ShareButton } from "./Dashboard/ShareButton";
import { DashboardFooter } from "./Dashboard/DashboardFooter";
import { RelatedArticles } from "./Dashboard/RelatedArticles";

const ALL_INDICATOR_KEYS = INDICATOR_CONFIGS.map(c => c.key) as IndicatorKey[];

const VIEW_MODE_DESCRIPTIONS: Record<ViewMode, string> = Object.fromEntries(
  VIEW_MODES.map(m => [m.key, m.description]),
) as Record<ViewMode, string>;

interface MainViewProps {
  initialParams?: {
    range?: string;
    indicators?: string;
    events?: string;
  };
}

export function MainView({ initialParams }: MainViewProps) {
  const isMobile = useIsMobile();

  const [viewMode, setViewMode] = useState<ViewMode>("chart");
  const [mobileIndicatorIndex, setMobileIndicatorIndex] = useState(0);
  const [showFiltersSheet, setShowFiltersSheet] = useState(false);

  const [yearRange, setYearRange] = useState<[number, number]>(() =>
    parseRange(initialParams?.range ?? null),
  );
  const [activeIndicators, setActiveIndicators] = useState<IndicatorKey[]>(() =>
    parseIndicators(initialParams?.indicators ?? null, ALL_INDICATOR_KEYS),
  );
  const [activeCategories, setActiveCategories] = useState<EventCategory[]>(() =>
    parseCategories(initialParams?.events ?? null),
  );

  const effectiveIndicators = useEffectiveIndicators(isMobile, activeIndicators, mobileIndicatorIndex);
  const { filteredData, narrative } = useFilteredData(yearRange);
  useUrlSync(activeIndicators, yearRange, activeCategories);

  const toggleIndicator = (key: IndicatorKey) =>
    setActiveIndicators(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key],
    );

  const toggleCategory = (cat: EventCategory) =>
    setActiveCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat],
    );

  return (
    <main
      id="main"
      className="min-h-screen p-4 md:p-10"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="max-w-7xl mx-auto space-y-5">
        <DashboardHeader />

        {/* 指標トグル: PC では水平バー、モバイルではナビ + トグル */}
        {!isMobile ? (
          <IndicatorToggleBar
            variant="pc"
            activeIndicators={activeIndicators}
            onToggle={toggleIndicator}
            onSetAll={setActiveIndicators}
          />
        ) : (
          <div className="space-y-3">
            <MobileIndicatorNav
              currentIndex={mobileIndicatorIndex}
              onIndexChange={setMobileIndicatorIndex}
              filteredData={filteredData}
              yearRange={yearRange}
            />
            <IndicatorToggleBar
              variant="mobile"
              activeIndicators={activeIndicators}
              onToggle={toggleIndicator}
              onSetAll={setActiveIndicators}
            />
          </div>
        )}

        {/* ヒーロー統計バー（PC のみ） */}
        {!isMobile && (
          <HeroStatsBar
            data={filteredData}
            activeIndicators={effectiveIndicators}
            topN={4}
          />
        )}

        {/* フィルターボタン（モバイル） */}
        {isMobile && (
          <button
            onClick={() => setShowFiltersSheet(true)}
            className="w-full flex items-center justify-between px-4 rounded-xl border transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            style={{
              minHeight: 48,
              borderColor: "var(--border)",
              backgroundColor: "var(--card)",
            }}
            aria-haspopup="dialog"
            aria-expanded={showFiltersSheet}
          >
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 16 }} aria-hidden>⚙️</span>
              <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                フィルター
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "var(--bg)", color: "var(--muted)" }}
              >
                {yearRange[0]}–{yearRange[1]}年
              </span>
              <span style={{ color: "var(--muted)", fontSize: 16 }} aria-hidden>›</span>
            </div>
          </button>
        )}

        {/* フィルターセクション（PC） */}
        {!isMobile && (
          <FilterSection
            yearRange={yearRange}
            activeCategories={activeCategories}
            onYearRangeChange={setYearRange}
            onCategoryToggle={toggleCategory}
          />
        )}

        {/* ボトムシート（モバイル） */}
        {isMobile && showFiltersSheet && (
          <MobileFiltersSheet
            yearRange={yearRange}
            activeCategories={activeCategories}
            onYearRangeChange={setYearRange}
            onCategoryToggle={toggleCategory}
            onClose={() => setShowFiltersSheet(false)}
          />
        )}

        {/* ビューモードを上位レベルに昇格 + 現在モードの説明 */}
        <div className={`flex items-center gap-2 ${isMobile ? "flex-col" : ""}`}>
          <ViewModeTabs viewMode={viewMode} onChange={setViewMode} isMobile={isMobile} />
          {!isMobile && (
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              {VIEW_MODE_DESCRIPTIONS[viewMode]}
            </p>
          )}
          {!isMobile && <div className="flex-1" />}
          {!isMobile && <ShareButton variant="inline" />}
        </div>

        {/* Chart / ComparisonView コンテナ */}
        <div
          className="rounded-xl border p-4"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        >

          {viewMode === "chart" ? (
            <ChartPanel
              isMobile={isMobile}
              filteredData={filteredData}
              effectiveIndicators={effectiveIndicators}
              activeIndicators={activeIndicators}
              activeCategories={activeCategories}
              yearRange={yearRange}
            />
          ) : (
            <ComparisonView
              mode={viewMode}
              activeIndicators={activeIndicators}
              yearRange={yearRange}
              activeCategories={activeCategories}
            />
          )}
        </div>

        <InsightCards
          data={filteredData}
          yearRange={yearRange}
          activeIndicators={effectiveIndicators}
        />

        {narrative && (
          <div
            className="rounded-xl border px-5 py-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <p className="text-xs font-medium mb-1.5" style={{ color: "var(--link)" }}>
              この期間のポイント
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>
              {narrative}
            </p>
          </div>
        )}

        <RelatedArticles activeIndicators={effectiveIndicators} yearRange={yearRange} />

        {isMobile && <ShareButton variant="block" />}

        <DashboardFooter />
      </div>
    </main>
  );
}
