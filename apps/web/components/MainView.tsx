"use client";

import { useEffect, useId, useState } from "react";
import dynamic from "next/dynamic";
import type { IndicatorKey, EventCategory } from "@/lib/types";
import { useIsMobile } from "@/lib/hooks";
import { INDICATOR_CONFIGS } from "@/lib/data";
import { parseRange, parseIndicators, parseCategories } from "@/lib/utils";
import {
  useFilteredData,
  useUrlSync,
} from "@/lib/dashboard-hooks";
import { InsightCards } from "./InsightCards";
import { MobileFiltersSheet } from "./MobileFiltersSheet";
import { DataTable } from "./DataTable";
import { DashboardHeader } from "./Dashboard/DashboardHeader";
import { IndicatorToggleBar } from "./Dashboard/IndicatorToggleBar";
import { HeroStory } from "./Dashboard/HeroStory";
import { FilterSection } from "./Dashboard/FilterSection";
import { ViewModeTabs, VIEW_MODES, type ViewMode } from "./Dashboard/ViewModeTabs";
import { ShareButton } from "./Dashboard/ShareButton";
import { ChartToolbar } from "./Dashboard/ChartToolbar";
import { DashboardFooter } from "./Dashboard/DashboardFooter";
import { RelatedArticles } from "./Dashboard/RelatedArticles";
import { AboutAndFAQ } from "./Dashboard/AboutAndFAQ";

// recharts を含む重いコンポーネントを分割。SSR で HTML を返したうえで JS チャンクを並列ロード
const ChartPanel = dynamic(() => import("./Dashboard/ChartPanel").then(m => ({ default: m.ChartPanel })), {
  loading: () => <div style={{ minHeight: 360 }} aria-label="グラフ読み込み中" />,
});
const ComparisonView = dynamic(() => import("./ComparisonView").then(m => ({ default: m.ComparisonView })), {
  loading: () => <div style={{ minHeight: 360 }} aria-label="比較ビュー読み込み中" />,
});

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
  const [showFiltersSheet, setShowFiltersSheet] = useState(false);
  // DataTable はモード横断機能。state を MainView に持ち上げ、推移/政権/ショック/イベント
  // のどのビューでもチャート下に表示できるようにする。
  const [showDataTable, setShowDataTable] = useState(false);
  const dataTableContainerId = useId();

  const [yearRange, setYearRange] = useState<[number, number]>(() =>
    parseRange(initialParams?.range ?? null),
  );
  const [activeIndicators, setActiveIndicators] = useState<IndicatorKey[]>(() =>
    parseIndicators(initialParams?.indicators ?? null, ALL_INDICATOR_KEYS),
  );
  const [activeCategories, setActiveCategories] = useState<EventCategory[]>(() =>
    parseCategories(initialParams?.events ?? null),
  );

  // 単一指標モード（ショック/イベント）で使う主指標。
  // 推移/政権モードの activeIndicators[0] と同期させ、モード切替で
  // 選択が失われないようにする。
  const [primaryIndicator, setPrimaryIndicator] = useState<IndicatorKey>(() =>
    activeIndicators[0] ?? "wage",
  );

  useEffect(() => {
    if (activeIndicators.length === 0) return;
    if (!activeIndicators.includes(primaryIndicator)) {
      setPrimaryIndicator(activeIndicators[0]);
    }
  }, [activeIndicators, primaryIndicator]);

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

        {/* ファーストビューの読み解き — PC/SP 両方で表示 */}
        <HeroStory data={filteredData} yearRange={yearRange} />

        {/* 指標トグル: PC では水平バー、モバイルではコンパクトトグル */}
        <IndicatorToggleBar
          variant={isMobile ? "mobile" : "pc"}
          activeIndicators={activeIndicators}
          onToggle={toggleIndicator}
          onSetAll={setActiveIndicators}
        />

        {/* フィルターボタン（モバイル）— 上下2段組で主アクションを明示 */}
        {isMobile && (
          <button
            onClick={() => setShowFiltersSheet(true)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            style={{
              minHeight: 56,
              borderColor: "var(--border)",
              backgroundColor: "var(--card)",
            }}
            aria-haspopup="dialog"
            aria-expanded={showFiltersSheet}
          >
            <span className="flex flex-col items-start">
              <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                フィルター
              </span>
              <span className="text-xs tabular-nums" style={{ color: "var(--muted)" }}>
                表示期間: {yearRange[0]}–{yearRange[1]}年
              </span>
            </span>
            <span style={{ color: "var(--muted)", fontSize: 18 }} aria-hidden>›</span>
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

        {/* ビューモードを上位レベルに昇格 + 現在モードの説明（SP/PC両方で表示） */}
        <div className={`flex items-center gap-2 ${isMobile ? "flex-col items-stretch" : ""}`}>
          <ViewModeTabs viewMode={viewMode} onChange={setViewMode} isMobile={isMobile} />
          <p
            className={`text-xs ${isMobile ? "text-center" : ""}`}
            style={{ color: "var(--muted)" }}
          >
            {VIEW_MODE_DESCRIPTIONS[viewMode]}
          </p>
          {!isMobile && <div className="flex-1" />}
          {!isMobile && <ShareButton variant="inline" />}
        </div>

        {/* モード横断ツールバー（ブックマーク・CSV・データ表）— どのビューモードでも操作可 */}
        <ChartToolbar
          variant={isMobile ? "mobile" : "pc"}
          activeIndicators={activeIndicators}
          activeCategories={activeCategories}
          yearRange={yearRange}
          showDataTable={showDataTable}
          onToggleDataTable={() => setShowDataTable(v => !v)}
          dataTableContainerId={dataTableContainerId}
        />

        {/* Chart / ComparisonView コンテナ
            SP: 横余白を最小化 + 画面端まで広げる (-mx-2) ことで描画幅 +24px */}
        <div
          id="chart-container"
          className="rounded-xl border p-2 md:p-4 -mx-2 md:mx-0 scroll-mt-4"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        >

          {viewMode === "chart" ? (
            <ChartPanel
              isMobile={isMobile}
              filteredData={filteredData}
              effectiveIndicators={activeIndicators}
              activeCategories={activeCategories}
              yearRange={yearRange}
            />
          ) : (
            <ComparisonView
              mode={viewMode}
              activeIndicators={activeIndicators}
              onToggleIndicator={toggleIndicator}
              primaryIndicator={primaryIndicator}
              onChangePrimary={setPrimaryIndicator}
              yearRange={yearRange}
              activeCategories={activeCategories}
            />
          )}
        </div>

        {/* データテーブル（モード横断のアクセシビリティ用代替ビュー） */}
        {showDataTable && (
          <div
            id={dataTableContainerId}
            className="rounded-xl border p-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <DataTable data={filteredData} activeIndicators={activeIndicators} />
          </div>
        )}

        <InsightCards
          data={filteredData}
          yearRange={yearRange}
          activeIndicators={activeIndicators}
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

        <RelatedArticles activeIndicators={activeIndicators} yearRange={yearRange} />

        <AboutAndFAQ />

        {isMobile && <ShareButton variant="block" />}

        <DashboardFooter />
      </div>
    </main>
  );
}
