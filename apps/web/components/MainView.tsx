"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { IndicatorKey, EventCategory } from "@/lib/types";
import { useIsMobile } from "@/lib/hooks";
import { RAW_DATA, ADMINISTRATIONS, EVENTS, INDICATOR_CONFIGS, DATA_UPDATED_AT } from "@/lib/data";
import { generateCSV, downloadCSV } from "@/lib/csv";
import { getComparisonData } from "@/lib/comparison-data";
import { DATA_YEARS } from "@/lib/constants";
import { generateNarrative, parseRange, parseIndicators, parseCategories, formatUpdatedAt } from "@/lib/utils";
import { addRecent } from "@/lib/bookmarks";
import { Chart } from "./Chart";
import { AdminBar } from "./AdminBar";
import { RangeSlider } from "./RangeSlider";
import { EventFilter } from "./EventFilter";
import { InsightCards } from "./InsightCards";
import { ThemeToggle } from "./ThemeToggle";
import { ComparisonView } from "./ComparisonView";
import { MobileIndicatorNav } from "./MobileIndicatorNav";
import { EraShortcuts } from "./EraShortcuts";
import { MobileFiltersSheet } from "./MobileFiltersSheet";
import { DataTable } from "./DataTable";
import { BookmarkPanel } from "./BookmarkPanel";

const ALL_CATEGORIES: EventCategory[] = ["税制", "経済", "経済政策"];
const ALL_INDICATOR_KEYS = INDICATOR_CONFIGS.map(c => c.key) as import("@/lib/types").IndicatorKey[];
const MIN_YEAR = DATA_YEARS.MIN;
const MAX_YEAR = DATA_YEARS.MAX;

type ViewMode = "chart" | "admin" | "shock" | "event";

const VIEW_MODES: { key: ViewMode; label: string }[] = [
  { key: "chart", label: "グラフ" },
  { key: "admin", label: "政権比較" },
  { key: "shock", label: "ショック比較" },
  { key: "event", label: "イベント詳細" },
];

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
  const [showDataTable, setShowDataTable] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [mobileIndicatorIndex, setMobileIndicatorIndex] = useState(0);
  const [showFiltersSheet, setShowFiltersSheet] = useState(false);
  const [yearRange, setYearRange] = useState<[number, number]>(() =>
    parseRange(initialParams?.range ?? null)
  );
  const [activeIndicators, setActiveIndicators] = useState<IndicatorKey[]>(() =>
    parseIndicators(initialParams?.indicators ?? null, ALL_INDICATOR_KEYS)
  );
  const [activeCategories, setActiveCategories] = useState<EventCategory[]>(() =>
    parseCategories(initialParams?.events ?? null)
  );

  const effectiveIndicators = isMobile ? [INDICATOR_CONFIGS[mobileIndicatorIndex].key] : activeIndicators;

  const filteredData = RAW_DATA.filter(d => d.year >= yearRange[0] && d.year <= yearRange[1]);
  const narrative = generateNarrative(filteredData);

  // URL 更新 + 履歴自動保存（スライダー連打による SecurityError を防ぐため 300ms デバウンス）
  const urlTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    clearTimeout(urlTimer.current);
    urlTimer.current = setTimeout(() => {
      const indicatorsStr = activeIndicators.join(",");
      const rangeStr      = yearRange.join(",");
      const eventsStr     = activeCategories.join(",");
      const params = new URLSearchParams({
        indicators: indicatorsStr,
        range: rangeStr,
        events: eventsStr,
      });
      window.history.replaceState(null, "", `/?${params.toString()}`);
      // 履歴に保存（localStorage）
      addRecent(indicatorsStr, rangeStr, eventsStr);
    }, 300);
    return () => clearTimeout(urlTimer.current);
  }, [activeIndicators, yearRange, activeCategories]);

  const toggleIndicator = (key: IndicatorKey) =>
    setActiveIndicators(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );

  const toggleCategory = (cat: EventCategory) =>
    setActiveCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );

  const handleShare = () => {
    const text = `賃金・物価・税収・為替の推移を政権帯とともに確認できます。\n\n#KeizaiMap #日本経済\n${window.location.href}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <main className="min-h-screen p-4 md:p-10" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <div className="max-w-7xl mx-auto space-y-5">

        {/* Header */}
        <header className="flex items-end justify-between pb-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div>
            <h1
              className="font-bold tracking-tight"
              style={{ fontSize: "clamp(22px, 5vw, 38px)" }}
            >
              KeizaiMap
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>数字で見る、日本の30年</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/about" className="text-xs hover:underline" style={{ color: "var(--muted)" }}>
              データソースについて
            </Link>
          </div>
        </header>

        {/* Indicator toggles - PC only */}
        {!isMobile && (
          <section aria-labelledby="indicators-heading">
            <h2 id="indicators-heading" className="sr-only">表示する指標を選択</h2>
            <div className="flex gap-2 flex-wrap items-center" role="group" aria-labelledby="indicators-heading">
              {INDICATOR_CONFIGS.map(cfg => {
                const active = activeIndicators.includes(cfg.key);
                return (
                  <button
                    key={cfg.key}
                    onClick={() => toggleIndicator(cfg.key)}
                    aria-pressed={active}
                    className="px-3 py-1.5 md:py-1 rounded-full text-sm border transition-all font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    style={{
                      borderColor: active ? cfg.color : "var(--border)",
                      color: active ? cfg.darkColor : "var(--muted)",
                      backgroundColor: active ? cfg.color + "15" : "transparent",
                      opacity: 1,
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    {cfg.label}
                  </button>
                );
              })}
              <div className="ml-auto flex gap-1.5">
                <button
                  onClick={() => setActiveIndicators(ALL_INDICATOR_KEYS)}
                  className="px-2.5 py-1 rounded-full text-xs border font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                >
                  全指標
                </button>
                <button
                  onClick={() => setActiveIndicators(["wage", "cpi"])}
                  className="px-2.5 py-1 rounded-full text-xs border font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                >
                  リセット
                </button>
              </div>
            </div>
            <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
              最初は <strong>実質賃金 + 物価</strong> の 2 指標を表示しています。比べたい指標をクリックして追加できます（最大 9 指標）。
            </p>
          </section>
        )}

        {/* Mobile indicator nav */}
        {isMobile && (
          <MobileIndicatorNav
            currentIndex={mobileIndicatorIndex}
            onIndexChange={setMobileIndicatorIndex}
            filteredData={filteredData}
            yearRange={yearRange}
          />
        )}

        {/* ヒーロー統計バー（PC のみ） */}
        {!isMobile && filteredData.length >= 2 && (() => {
          const s = filteredData[0];
          const e = filteredData[filteredData.length - 1];
          return (
            <div
              className="rounded-xl border px-4 py-3 flex flex-wrap items-center gap-x-5 gap-y-2"
              style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            >
              <span className="text-xs font-semibold shrink-0" style={{ color: "var(--muted)" }}>
                {s.year}年 → {e.year}年
              </span>
              {INDICATOR_CONFIGS.map(cfg => {
                const sv = s[cfg.key] as number;
                const ev = e[cfg.key] as number;
                const pct = ((ev - sv) / sv) * 100;
                const sign = pct >= 0 ? "+" : "";
                const color = pct >= 0 ? "#22c55e" : "#ef4444";
                return (
                  <span key={cfg.key} className="flex items-baseline gap-1">
                    <span className="text-xs" style={{ color: "var(--muted)" }}>{cfg.label}</span>
                    <span className="text-sm font-bold tabular-nums" style={{ color }}>
                      {sign}{pct.toFixed(1)}%
                    </span>
                  </span>
                );
              })}
            </div>
          );
        })()}

        {/* フィルターボタン（モバイルのみ） */}
        {isMobile && (
          <button
            onClick={() => setShowFiltersSheet(true)}
            className="w-full flex items-center justify-between px-4 rounded-xl border transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            style={{
              minHeight: 48,
              borderColor: "var(--border)",
              backgroundColor: "var(--card)",
            }}
          >
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 16 }}>⚙️</span>
              <span className="text-sm font-medium" style={{ color: "var(--text)" }}>フィルター</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--bg)", color: "var(--muted)" }}>
                {yearRange[0]}–{yearRange[1]}年
              </span>
              <span style={{ color: "var(--muted)", fontSize: 16 }}>›</span>
            </div>
          </button>
        )}

        {/* フィルターセクション（PC） */}
        {!isMobile && (
          <div className="rounded-xl border p-4 space-y-4" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <div>
              <h2 className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>注目の期間</h2>
              <EraShortcuts yearRange={yearRange} onRangeChange={setYearRange} />
            </div>
            <section aria-labelledby="range-heading">
              <h2 id="range-heading" className="text-xs font-medium mb-3" style={{ color: "var(--muted)" }}>表示期間</h2>
              <RangeSlider min={MIN_YEAR} max={MAX_YEAR} value={yearRange} onChange={setYearRange} step={1} aria-label={`表示期間: ${yearRange[0]}年から${yearRange[1]}年まで`} />
            </section>
            <section aria-labelledby="event-heading">
              <h2 id="event-heading" className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>経済イベントフィルター</h2>
              <EventFilter categories={ALL_CATEGORIES} activeCategories={activeCategories} onToggle={toggleCategory} />
            </section>
          </div>
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

        {/* Chart + AdminBar / 比較モード */}
        <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          {/* モード切替（モバイルは全幅、PCはシェアボタンと並列） */}
          <div className={`flex items-center gap-2 mb-3 ${isMobile ? "flex-col" : ""}`}>
            <div
              className={`flex gap-0.5 rounded-lg p-0.5 ${isMobile ? "w-full" : ""}`}
              style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)" }}
            >
              {VIEW_MODES.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setViewMode(key)}
                  className={`py-1.5 rounded-md transition-all text-xs ${isMobile ? "flex-1" : "px-3"}`}
                  style={{
                    backgroundColor: viewMode === key ? "var(--card)" : "transparent",
                    color:           viewMode === key ? "var(--text)" : "var(--muted)",
                    fontWeight:      viewMode === key ? 600 : 400,
                    boxShadow:       viewMode === key ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            {!isMobile && <div className="flex-1" />}
            {!isMobile && (
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#1DA1F2", color: "#fff" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.842L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Xでシェア
              </button>
            )}
          </div>

          {/* コンテンツ切替 */}
          {viewMode === "chart" ? (
            <>
              {/* G7比較トグル + ブックマーク */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {(effectiveIndicators.includes("wage") || effectiveIndicators.includes("cpi") || effectiveIndicators.includes("fx")) && (
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className="px-3 py-1.5 rounded-full text-xs border transition-all font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    style={{
                      borderColor: showComparison ? "var(--link)" : "var(--border)",
                      color: showComparison ? "var(--link)" : "var(--muted)",
                      backgroundColor: showComparison ? "#1d4ed815" : "transparent",
                      fontWeight: showComparison ? 600 : 400,
                    }}
                  >
                    🌍 G7平均と比較
                  </button>
                )}
                <BookmarkPanel
                  indicators={activeIndicators.join(",")}
                  range={yearRange.join(",")}
                  events={activeCategories.join(",")}
                />
              </div>

              <Chart
                data={showComparison ? getComparisonData(filteredData) : filteredData}
                events={EVENTS}
                administrations={ADMINISTRATIONS}
                activeIndicators={effectiveIndicators}
                activeCategories={activeCategories}
                showComparison={showComparison}
                isSingleIndicator={isMobile}
              />
              <div className={isMobile ? "pl-[42px] pr-[8px]" : "pl-[60px] pr-[12px]"}>
                <AdminBar administrations={ADMINISTRATIONS} yearRange={yearRange} />
                <div style={{ marginTop: "1.5rem", display: isMobile ? "none" : "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => {
                      const csv = generateCSV(RAW_DATA, activeIndicators, yearRange);
                      downloadCSV(csv, `keizai-map_${yearRange[0]}-${yearRange[1]}.csv`);
                    }}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "0.375rem",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--card)",
                      color: "var(--text)",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      transition: "all 200ms",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.outline = "2px solid #2563eb";
                      e.currentTarget.style.outlineOffset = "2px";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.outline = "none";
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--bg)";
                      e.currentTarget.style.borderColor = "var(--link)";
                      e.currentTarget.style.color = "var(--link)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--card)";
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.color = "var(--text)";
                    }}
                  >
                    📥 CSVでエクスポート
                  </button>
                  <button
                    onClick={() => setShowDataTable(!showDataTable)}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "0.375rem",
                      border: "1px solid var(--border)",
                      backgroundColor: showDataTable ? "var(--link)" : "var(--card)",
                      color: showDataTable ? "#fff" : "var(--text)",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      transition: "all 200ms",
                    }}
                    onMouseEnter={(e) => {
                      if (!showDataTable) {
                        e.currentTarget.style.backgroundColor = "var(--bg)";
                        e.currentTarget.style.borderColor = "var(--link)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!showDataTable) {
                        e.currentTarget.style.backgroundColor = "var(--card)";
                        e.currentTarget.style.borderColor = "var(--border)";
                      }
                    }}
                  >
                    📊 データを表で見る
                  </button>
                </div>

                {/* データテーブル（アクセシビリティ用代替ビュー） */}
                {showDataTable && (
                  <DataTable data={filteredData} activeIndicators={activeIndicators} />
                )}
              </div>
            </>
          ) : (
            <ComparisonView mode={viewMode} activeIndicators={activeIndicators} />
          )}
        </div>

        {/* Insight cards（モバイルは選択中指標のみ、PCは全指標） */}
        <InsightCards
          data={filteredData}
          yearRange={yearRange}
          focusedKey={isMobile ? INDICATOR_CONFIGS[mobileIndicatorIndex].key : undefined}
        />

        {/* 自動解説：選択期間の傾向を文章で要約 */}
        {narrative && (
          <div
            className="rounded-xl border px-5 py-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <p className="text-xs font-medium mb-1.5" style={{ color: "var(--link)" }}>この期間のポイント</p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>{narrative}</p>
          </div>
        )}


        {/* モバイル：フッターのシェアボタン */}
        {isMobile && (
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#1DA1F2", color: "#fff" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.842L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Xでシェア
          </button>
        )}

        {/* Footer */}
        <footer className="text-xs text-center pt-4 border-t space-y-1" style={{ color: "var(--muted)", borderColor: "var(--border)" }}>
          <p>データ出典: 厚労省・総務省・財務省・日本銀行 &nbsp;|&nbsp; 数値はすべて公開統計に基づきます</p>
          {DATA_UPDATED_AT && (
            <p>最終更新: {formatUpdatedAt(DATA_UPDATED_AT)}</p>
          )}
          <p>
            <Link href="/about" className="hover:underline" style={{ color: "var(--muted)" }}>
              データソースについて
            </Link>
            &nbsp;|&nbsp;
            <Link href="/privacy" className="hover:underline" style={{ color: "var(--muted)" }}>
              プライバシーポリシー
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
