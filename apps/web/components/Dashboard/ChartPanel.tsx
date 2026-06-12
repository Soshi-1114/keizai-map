"use client";

import { useId, useState } from "react";
import type { DataPoint, EventCategory, IndicatorKey } from "@/lib/types";
import { ADMINISTRATIONS, EVENTS, RAW_DATA } from "@/lib/data";
import { generateCSV, downloadCSV } from "@/lib/csv";
import { getComparisonData } from "@/lib/comparison-data";
import { Chart } from "@/components/Chart";
import { AdminBar } from "@/components/AdminBar";
import { DataTable } from "@/components/DataTable";
import { BookmarkPanel } from "@/components/BookmarkPanel";

interface Props {
  isMobile: boolean;
  filteredData: DataPoint[];
  effectiveIndicators: IndicatorKey[];
  activeIndicators: IndicatorKey[];
  activeCategories: EventCategory[];
  yearRange: [number, number];
}

export function ChartPanel({
  isMobile,
  filteredData,
  effectiveIndicators,
  activeIndicators,
  activeCategories,
  yearRange,
}: Props) {
  const [showComparison, setShowComparison] = useState(false);
  const [showDataTable, setShowDataTable] = useState(false);
  const [yAxisMode, setYAxisMode] = useState<"auto" | "fixed">("auto");
  const dataTableId = useId();

  const showG7Trigger =
    effectiveIndicators.includes("wage") ||
    effectiveIndicators.includes("cpi") ||
    effectiveIndicators.includes("fx");

  const handleExportCSV = () => {
    const csv = generateCSV(RAW_DATA, activeIndicators, yearRange);
    downloadCSV(csv, `keizai-map_${yearRange[0]}-${yearRange[1]}.csv`);
  };

  return (
    <>
      {/* G7比較トグル + ブックマーク + Y軸レンジ切替 */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {showG7Trigger && (
          <button
            onClick={() => setShowComparison(!showComparison)}
            aria-pressed={showComparison}
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

        {/* Y 軸レンジモードトグル */}
        <div
          className="ml-auto flex gap-0.5 rounded-full p-0.5 border"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
          role="group"
          aria-label="Y軸レンジモード"
        >
          <button
            type="button"
            onClick={() => setYAxisMode("auto")}
            aria-pressed={yAxisMode === "auto"}
            title="選択中の指標にフィットして変化を強調"
            className="px-2.5 py-1 rounded-full text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            style={{
              backgroundColor: yAxisMode === "auto" ? "var(--card)" : "transparent",
              color: yAxisMode === "auto" ? "var(--text)" : "var(--muted)",
              fontWeight: yAxisMode === "auto" ? 600 : 400,
              border: "none",
            }}
          >
            自動
          </button>
          <button
            type="button"
            onClick={() => setYAxisMode("fixed")}
            aria-pressed={yAxisMode === "fixed"}
            title="100=1990 基準で固定（指標間の絶対比較に有効）"
            className="px-2.5 py-1 rounded-full text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            style={{
              backgroundColor: yAxisMode === "fixed" ? "var(--card)" : "transparent",
              color: yAxisMode === "fixed" ? "var(--text)" : "var(--muted)",
              fontWeight: yAxisMode === "fixed" ? 600 : 400,
              border: "none",
            }}
          >
            100基準
          </button>
        </div>
      </div>

      <Chart
        data={showComparison ? getComparisonData(filteredData) : filteredData}
        events={EVENTS}
        administrations={ADMINISTRATIONS}
        activeIndicators={effectiveIndicators}
        activeCategories={activeCategories}
        showComparison={showComparison}
        isSingleIndicator={isMobile && effectiveIndicators.length === 1}
        yAxisMode={yAxisMode}
      />

      <div className={isMobile ? "pl-[42px] pr-[8px]" : "pl-[60px] pr-[12px]"}>
        <AdminBar administrations={ADMINISTRATIONS} yearRange={yearRange} />

        {/* CSV / データ表 ボタン — モバイルでは縦並び・全幅、PC では右寄せ */}
        <div className="mt-6 flex flex-col md:flex-row md:flex-wrap gap-2 md:justify-end">
          <button
            type="button"
            onClick={handleExportCSV}
            aria-label={`${yearRange[0]}年から${yearRange[1]}年の選択指標を CSV でダウンロード`}
            className="px-3 py-3 md:py-2 md:px-4 rounded-md border text-sm font-medium transition-colors hover:bg-[var(--bg)] hover:border-[var(--link)] hover:text-[var(--link)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--card)",
              color: "var(--text)",
              minHeight: 44,
            }}
          >
            📥 CSVでダウンロード
          </button>
          <button
            type="button"
            onClick={() => setShowDataTable(!showDataTable)}
            aria-expanded={showDataTable}
            aria-controls={dataTableId}
            className="px-3 py-3 md:py-2 md:px-4 rounded-md border text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            style={{
              borderColor: showDataTable ? "var(--link)" : "var(--border)",
              backgroundColor: showDataTable ? "var(--link)" : "var(--card)",
              color: showDataTable ? "#fff" : "var(--text)",
              minHeight: 44,
            }}
          >
            📊 データを{showDataTable ? "閉じる" : "表で見る"}
          </button>
        </div>

        {/* データテーブル（アクセシビリティ用代替ビュー） */}
        {showDataTable && (
          <div id={dataTableId}>
            <DataTable data={filteredData} activeIndicators={activeIndicators} />
          </div>
        )}
      </div>
    </>
  );
}
