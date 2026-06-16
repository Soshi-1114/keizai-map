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
import { Sidebar } from "./Dashboard/Sidebar";

// recharts を含む重いコンポーネントを分割。SSR で HTML を返したうえで JS チャンクを並列ロード
const ChartPanel = dynamic(() => import("./Dashboard/ChartPanel").then(m => ({ default: m.ChartPanel })), {
  loading: () => <div style={{ minHeight: 360 }} aria-label="グラフ読み込み中" />,
});
const ComparisonView = dynamic(() => import("./ComparisonView").then(m => ({ default: m.ComparisonView })), {
  loading: () => <div style={{ minHeight: 360 }} aria-label="比較ビュー読み込み中" />,
});
const MonthlyPanel = dynamic(() => import("./MonthlyPanel").then(m => ({ default: m.MonthlyPanel })), {
  loading: () => <div style={{ minHeight: 280 }} aria-label="月次パネル読み込み中" />,
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
  // ViewModeTabs ↔ chart-container を aria-controls で紐付ける固定ID。
  // MobileFiltersSheet 内 getElementById("chart-container") との互換のため固定値を維持。
  const tabpanelId = "chart-container";

  const [yearRange, setYearRange] = useState<[number, number]>(() =>
    parseRange(initialParams?.range ?? null),
  );
  // ドラッグ中の中間値 (yearRange) と分離した「確定済み」値。
  // URL同期は committedYearRange を使い、ドラッグ中の URL 書き換え連発を防ぐ。
  // EraShortcuts や MobileFiltersSheet の閉じる時など、明示的な確定操作で同時更新する
  // (詳細は FilterSection/MobileFiltersSheet 内の handleEraChange を参照)。
  const [committedYearRange, setCommittedYearRange] = useState<[number, number]>(() =>
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
  // URL同期は確定済みrangeで行う。ドラッグ中の中間値はURLに反映しない。
  useUrlSync(activeIndicators, committedYearRange, activeCategories);

  const toggleIndicator = (key: IndicatorKey) =>
    setActiveIndicators(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key],
    );

  const toggleCategory = (cat: EventCategory) =>
    setActiveCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat],
    );

  const chartContainer = (
    <div
      id="chart-container"
      className="rounded-xl border p-2 md:p-4 -mx-2 md:mx-0 scroll-mt-4"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      role="tabpanel"
      aria-label={VIEW_MODE_DESCRIPTIONS[viewMode]}
    >
      {viewMode === "chart" ? (
        <ChartPanel
          isMobile={isMobile}
          filteredData={filteredData}
          effectiveIndicators={activeIndicators}
          activeCategories={activeCategories}
          yearRange={yearRange}
          onToggleIndicator={toggleIndicator}
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
          isMobile={isMobile}
        />
      )}
    </div>
  );

  const dataTableBlock = showDataTable && (
    <div
      id={dataTableContainerId}
      className="rounded-xl border p-4"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      <DataTable data={filteredData} activeIndicators={activeIndicators} />
    </div>
  );

  const narrativeBlock = narrative.paragraphs.length > 0 && (
    <div
      className="rounded-xl border px-5 py-4 space-y-2"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      aria-labelledby="narrative-heading"
    >
      <p
        id="narrative-heading"
        className="text-xs font-medium"
        style={{ color: "var(--link)" }}
      >
        この期間のポイント
      </p>
      {narrative.paragraphs.map((p, i) => (
        <p
          key={i}
          className="text-sm leading-relaxed"
          style={{ color: "var(--text)" }}
        >
          {p}
        </p>
      ))}
      {narrative.insight && (
        <p
          className="text-sm leading-relaxed font-semibold mt-3 pl-3 border-l-2"
          style={{ color: "var(--link)", borderColor: "var(--link)" }}
        >
          {narrative.insight}
        </p>
      )}
    </div>
  );

  const insightCardsBlock = (
    <InsightCards
      data={filteredData}
      yearRange={yearRange}
      activeIndicators={activeIndicators}
    />
  );

  // SP のフィルター呼び出しボタン
  const filterButton = (
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
  );

  // 分析モードタブ + 現在モードの説明。SP はチャート直下に降ろす。
  const viewModeBlock = (
    <div className={`flex items-center gap-2 ${isMobile ? "flex-col items-stretch" : ""}`}>
      <ViewModeTabs
        viewMode={viewMode}
        onChange={setViewMode}
        isMobile={isMobile}
        tabpanelId={tabpanelId}
      />
      <p
        className={`text-xs ${isMobile ? "text-center" : ""}`}
        style={{ color: "var(--muted)" }}
      >
        {VIEW_MODE_DESCRIPTIONS[viewMode]}
      </p>
      {!isMobile && <div className="flex-1" />}
      {!isMobile && <ShareButton variant="inline" />}
    </div>
  );

  const chartToolbar = (
    <ChartToolbar
      variant={isMobile ? "mobile" : "pc"}
      activeIndicators={activeIndicators}
      activeCategories={activeCategories}
      yearRange={yearRange}
      showDataTable={showDataTable}
      onToggleDataTable={() => setShowDataTable(v => !v)}
      dataTableContainerId={dataTableContainerId}
    />
  );

  return (
    <main
      id="main"
      className="min-h-screen p-4 md:p-10"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="max-w-screen-2xl mx-auto xl:grid xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-8 space-y-5 xl:space-y-0">
        <div className="space-y-5 xl:col-start-1">
        <DashboardHeader />

        {/* ファーストビューの読み解き — PC/SP 両方で表示 */}
        <HeroStory data={filteredData} yearRange={yearRange} />

        {/* ボトムシート（モバイル） — DOM 位置は固定で fixed 配置のため上に置く */}
        {isMobile && showFiltersSheet && (
          <MobileFiltersSheet
            yearRange={yearRange}
            activeCategories={activeCategories}
            onYearRangeChange={setYearRange}
            onYearRangeCommit={setCommittedYearRange}
            onCategoryToggle={toggleCategory}
            onClose={() => setShowFiltersSheet(false)}
          />
        )}

        {isMobile ? (
          /* SP レイアウト: 段階的開示
             1. Hero（上で描画済み）
             2. チャート ← FV にチャートを上げる
             3. フィルター（期間調整）
             4. 分析モードタブ ← チャート直下に下げる
             5. 解説 / インサイトカード / 関連記事
             6. ツールバー（CSV/データ表/ブックマーク/履歴） ← 第3層へ */
          <>
            {chartContainer}
            <MonthlyPanel />
            {filterButton}
            {viewModeBlock}
            {narrativeBlock}
            {insightCardsBlock}
            <RelatedArticles activeIndicators={activeIndicators} yearRange={yearRange} />
            <AboutAndFAQ />
            {chartToolbar}
            {dataTableBlock}
            <ShareButton variant="block" />
          </>
        ) : (
          /* PC レイアウト: 従来の縦並びを維持 */
          <>
            <IndicatorToggleBar
              variant="pc"
              activeIndicators={activeIndicators}
              onToggle={toggleIndicator}
              onSetAll={setActiveIndicators}
            />
            {/* フィルターセクション（PC、xl未満のみ。xl以上は Sidebar に移動） */}
            <div className="xl:hidden">
              <FilterSection
                yearRange={yearRange}
                activeCategories={activeCategories}
                onYearRangeChange={setYearRange}
                onYearRangeCommit={setCommittedYearRange}
                onCategoryToggle={toggleCategory}
                isMobile={isMobile}
              />
            </div>
            {viewModeBlock}
            {chartContainer}
            <MonthlyPanel />
            {chartToolbar}
            {dataTableBlock}
            {narrativeBlock}
            {insightCardsBlock}
            {/* 関連記事は xl 以上では Sidebar に集約。xl 未満ではここに表示 */}
            <div className="xl:hidden">
              <RelatedArticles activeIndicators={activeIndicators} yearRange={yearRange} />
            </div>
            <AboutAndFAQ />
          </>
        )}

        <DashboardFooter />
        </div>

        {/* xl 以上のみ表示するサイドバー */}
        {!isMobile && (
          <Sidebar
            yearRange={yearRange}
            activeIndicators={activeIndicators}
            activeCategories={activeCategories}
            onYearRangeChange={setYearRange}
            onYearRangeCommit={setCommittedYearRange}
            onCategoryToggle={toggleCategory}
          />
        )}
      </div>
    </main>
  );
}
