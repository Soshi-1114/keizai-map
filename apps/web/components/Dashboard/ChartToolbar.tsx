"use client";

import { useId } from "react";
import { Download, Table2 } from "lucide-react";
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

/**
 * チャート操作ツールバー。意味的に2グループへ分離:
 *  - 左セグメント「保存と履歴」: ブックマーク + 履歴ドロワー（永続化された設定への往復）
 *  - 右セグメント「書き出しと閲覧」: CSV + データ表（現在の表示を別形式で取り出す）
 * 視覚的には縦罫線（divider）で区切り、ARIA 上もそれぞれ role="group" + aria-label で
 * グルーピングする。SP では幅が足りないので grid 2x2 で並べる。
 */
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

  const csvButton = (
    <button
      type="button"
      onClick={handleExportCSV}
      aria-label={`${yearRange[0]}年から${yearRange[1]}年の選択指標を CSV でダウンロード`}
      className={`${
        isPc ? "" : "w-full"
      } inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs border font-medium transition-colors hover:bg-[var(--bg)] hover:border-[var(--link)] hover:text-[var(--link)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`}
      style={{
        borderColor: "var(--border)",
        color: "var(--muted)",
        minHeight: isPc ? undefined : 44,
      }}
    >
      <Download size={13} aria-hidden />
      CSV
    </button>
  );

  const dataTableButton = (
    <button
      type="button"
      onClick={onToggleDataTable}
      aria-expanded={showDataTable}
      aria-controls={dataTableContainerId}
      // SVG チャートをキーボード/SR で読めないため、本ボタンが代替アクセス手段
      aria-label={
        showDataTable
          ? "データ表を閉じる"
          : "データ表を開く（キーボード・スクリーンリーダー向け代替表示）"
      }
      title="キーボード/スクリーンリーダーで年次値を読みたい場合はこちら"
      className={`${
        isPc ? "" : "w-full"
      } inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs border font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`}
      style={{
        borderColor: showDataTable ? "var(--link)" : "var(--border)",
        backgroundColor: showDataTable ? "#1d4ed815" : "transparent",
        color: showDataTable ? "var(--link)" : "var(--muted)",
        fontWeight: showDataTable ? 600 : 400,
        minHeight: isPc ? undefined : 44,
      }}
    >
      <Table2 size={13} aria-hidden />
      データ表{showDataTable ? "を閉じる" : ""}
    </button>
  );

  // SP では grid 2x2: ブックマーク・履歴を1段目、CSV・データ表を2段目
  if (!isPc) {
    return (
      <div
        role="group"
        aria-labelledby={labelId}
        className="w-full grid grid-cols-2 gap-2"
      >
        <span id={labelId} className="sr-only">
          チャート操作ツールバー
        </span>
        {/* 1段目: 保存と履歴（BookmarkPanel が内部で2ボタン横並び） */}
        <div role="group" aria-label="保存と履歴" className="col-span-2">
          <BookmarkPanel
            indicators={activeIndicators.join(",")}
            range={yearRange.join(",")}
            events={activeCategories.join(",")}
          />
        </div>
        {/* 2段目: 書き出しと閲覧 */}
        <div role="group" aria-label="書き出しと閲覧" className="contents">
          {csvButton}
          {dataTableButton}
        </div>
      </div>
    );
  }

  return (
    <div
      role="toolbar"
      aria-labelledby={labelId}
      className="flex items-center gap-3 flex-wrap"
    >
      <span id={labelId} className="sr-only">
        チャート操作ツールバー
      </span>
      <div role="group" aria-label="保存と履歴" className="flex items-center gap-2">
        <BookmarkPanel
          indicators={activeIndicators.join(",")}
          range={yearRange.join(",")}
          events={activeCategories.join(",")}
        />
      </div>
      {/* 視覚的な区切り罫線（左セグメントと右セグメントの境界） */}
      <div
        aria-hidden
        className="h-6 w-px"
        style={{ backgroundColor: "var(--border)" }}
      />
      <div role="group" aria-label="書き出しと閲覧" className="flex items-center gap-2">
        {csvButton}
        {dataTableButton}
      </div>
    </div>
  );
}
