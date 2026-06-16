"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import type { DataPoint, EventCategory, IndicatorKey } from "@/lib/types";
import { ADMINISTRATIONS, EVENTS } from "@/lib/data";
import { getComparisonData } from "@/lib/comparison-data";
import { Chart } from "@/components/Chart";
import { AdminBar } from "@/components/AdminBar";

interface Props {
  isMobile: boolean;
  filteredData: DataPoint[];
  effectiveIndicators: IndicatorKey[];
  activeCategories: EventCategory[];
  yearRange: [number, number];
  /** G7比較の表示状態。MainView で保持（SP は MobileFiltersSheet からも切替可能） */
  showComparison: boolean;
  onShowComparisonChange: (next: boolean) => void;
}

/**
 * 推移ビュー専用のチャート描画パネル。
 * ブックマーク・CSV・データ表はモード横断機能のため ChartToolbar に分離し、
 * ここには「推移表示パラメータ」として G7 比較と Y 軸モードのみ残す。
 */
export function ChartPanel({
  isMobile,
  filteredData,
  effectiveIndicators,
  activeCategories,
  yearRange,
  showComparison,
  onShowComparisonChange,
}: Props) {
  const [yAxisMode, setYAxisMode] = useState<"auto" | "fixed">("auto");

  const showG7Trigger =
    effectiveIndicators.includes("wage") ||
    effectiveIndicators.includes("cpi") ||
    effectiveIndicators.includes("fx");

  return (
    <>
      {/* 推移ビュー固有の表示パラメータ（左: 比較線=PCのみ、右: 軸スケール=PCのみ）
          SP では G7 比較は MobileFiltersSheet 内、指標切り替えは chartContainer 上部に集約 */}
      <div
        className={`${isMobile ? "hidden" : "flex"} items-center gap-3 mb-3 flex-wrap`}
        role="toolbar"
        aria-label="推移ビューの表示パラメータ"
      >
        <div role="group" aria-label="比較線" className="flex items-center">
          {showG7Trigger && (
            <button
              onClick={() => onShowComparisonChange(!showComparison)}
              aria-pressed={showComparison}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              style={{
                borderColor: showComparison ? "var(--link)" : "var(--border)",
                color: showComparison ? "var(--link)" : "var(--muted)",
                backgroundColor: showComparison ? "#1d4ed815" : "transparent",
                fontWeight: showComparison ? 600 : 400,
              }}
            >
              <Globe size={13} aria-hidden />
              G7平均と比較
            </button>
          )}
        </div>

        {/* Y 軸レンジモードトグル（SP では差が出にくいので非表示） */}
        <div
          className="ml-auto hidden md:flex gap-0.5 rounded-full p-0.5 border"
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

      {/* SP では Recharts の YAxis label が目盛りと衝突するため、上に独立キャプションで表示 */}
      {isMobile && (
        <div
          className="text-xs mb-1 pl-1"
          style={{ color: "var(--muted)" }}
          aria-hidden
        >
          縦軸: 指数（1990=100）
        </div>
      )}

      <Chart
        data={showComparison ? getComparisonData(filteredData) : filteredData}
        events={EVENTS}
        administrations={ADMINISTRATIONS}
        activeIndicators={effectiveIndicators}
        activeCategories={activeCategories}
        showComparison={showComparison}
        isSingleIndicator={isMobile && effectiveIndicators.length === 1}
        isMobile={isMobile}
        yAxisMode={yAxisMode}
      />

      <div className={isMobile ? "pl-[42px] pr-[8px]" : "pl-[60px] pr-[12px]"}>
        <AdminBar
          administrations={ADMINISTRATIONS}
          yearRange={yearRange}
          isMobile={isMobile}
        />
      </div>
    </>
  );
}
