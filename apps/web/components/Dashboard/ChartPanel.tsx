"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import type { DataPoint, EventCategory, IndicatorKey } from "@/lib/types";
import { ADMINISTRATIONS, EVENTS } from "@/lib/data";
import { getComparisonData } from "@/lib/comparison-data";
import { Chart } from "@/components/Chart";
import { AdminBar } from "@/components/AdminBar";
import { IndicatorChipSelector } from "./IndicatorChipSelector";

interface Props {
  isMobile: boolean;
  filteredData: DataPoint[];
  effectiveIndicators: IndicatorKey[];
  activeCategories: EventCategory[];
  yearRange: [number, number];
  /** SP では指標セレクタをチャートカード内に出すため、親から toggle ハンドラを受け取る */
  onToggleIndicator?: (key: IndicatorKey) => void;
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
  onToggleIndicator,
}: Props) {
  const [showComparison, setShowComparison] = useState(false);
  const [yAxisMode, setYAxisMode] = useState<"auto" | "fixed">("auto");

  const showG7Trigger =
    effectiveIndicators.includes("wage") ||
    effectiveIndicators.includes("cpi") ||
    effectiveIndicators.includes("fx");

  return (
    <>
      {/* 推移ビュー固有の表示パラメータ（左: 比較線、右: 軸スケール） */}
      <div
        className="flex items-center gap-3 mb-3 flex-wrap"
        role="toolbar"
        aria-label="推移ビューの表示パラメータ"
      >
        <div role="group" aria-label="比較線" className="flex items-center">
          {showG7Trigger && (
            <button
              onClick={() => setShowComparison(!showComparison)}
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

      {/* SP では指標セレクタをチャート＋政権帯の直下に配置（PC では上部 IndicatorToggleBar を利用）。
          デフォルト2指標が重なったチャートを先に見せ、追加は触りたい人だけが展開する段階的開示。 */}
      {isMobile && onToggleIndicator && (
        <div className="mt-3">
          <IndicatorChipSelector
            mode="multi"
            selected={effectiveIndicators}
            onToggle={onToggleIndicator}
            compact
          />
        </div>
      )}
    </>
  );
}
