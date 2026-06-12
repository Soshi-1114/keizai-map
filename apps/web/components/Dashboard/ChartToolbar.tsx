"use client";

import { useId } from "react";
import type { EventCategory, IndicatorKey } from "@/lib/types";
import { RAW_DATA } from "@/lib/data";
import { generateCSV, downloadCSV } from "@/lib/csv";
import { BookmarkPanel } from "@/components/BookmarkPanel";

interface Props {
  activeIndicators: IndicatorKey[];
  activeCategories: EventCategory[];
  yearRange: [number, number];
  /** データ表の表示状態は MainView で持ち、どのモードでも同じ位置に DataTable を表示する */
  showDataTable: boolean;
  onToggleDataTable: () => void;
  /** id of the DataTable container so aria-controls can reference it */
  dataTableContainerId: string;
  variant?: "pc" | "mobile";
}

export function ChartToolbar({
  activeIndicators,
  activeCategories,
  yearRange,
  showDataTable,
  onToggleDataTable,
  dataTableContainerId,
  variant = "pc",
}: Props) {
  const labelId = useId();

  const handleExportCSV = () => {
    const csv = generateCSV(RAW_DATA, activeIndicators, yearRange);
    downloadCSV(csv, `keizai-map_${yearRange[0]}-${yearRange[1]}.csv`);
  };

  const isPc = variant === "pc";

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      className={`flex items-center gap-2 flex-wrap ${isPc ? "" : "w-full"}`}
    >
      <span id={labelId} className="sr-only">
        チャート操作ツールバー（保存・書き出し・データ表）
      </span>

      <BookmarkPanel
        indicators={activeIndicators.join(",")}
        range={yearRange.join(",")}
        events={activeCategories.join(",")}
      />

      <button
        type="button"
        onClick={handleExportCSV}
        aria-label={`${yearRange[0]}年から${yearRange[1]}年の選択指標を CSV でダウンロード`}
        className={`${
          isPc ? "" : "flex-1"
        } px-3 py-1.5 rounded-full text-xs border font-medium transition-colors hover:bg-[var(--bg)] hover:border-[var(--link)] hover:text-[var(--link)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`}
        style={{
          borderColor: "var(--border)",
          color: "var(--muted)",
          minHeight: isPc ? undefined : 44,
        }}
      >
        📥 CSV
      </button>

      <button
        type="button"
        onClick={onToggleDataTable}
        aria-expanded={showDataTable}
        aria-controls={dataTableContainerId}
        className={`${
          isPc ? "" : "flex-1"
        } px-3 py-1.5 rounded-full text-xs border font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`}
        style={{
          borderColor: showDataTable ? "var(--link)" : "var(--border)",
          backgroundColor: showDataTable ? "#1d4ed815" : "transparent",
          color: showDataTable ? "var(--link)" : "var(--muted)",
          fontWeight: showDataTable ? 600 : 400,
          minHeight: isPc ? undefined : 44,
        }}
      >
        📊 データ表{showDataTable ? "を閉じる" : ""}
      </button>
    </div>
  );
}
