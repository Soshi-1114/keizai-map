"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { EventCategory } from "@/lib/types";
import { DATA_YEARS } from "@/lib/constants";
import { EraShortcuts } from "@/components/EraShortcuts";
import { RangeSlider } from "@/components/RangeSlider";
import { EventFilter } from "@/components/EventFilter";

const ALL_CATEGORIES: EventCategory[] = ["税制", "経済", "経済政策"];

// ドラッグでシートを下方向に閉じる閾値（px）
const DRAG_CLOSE_THRESHOLD = 80;

interface Props {
  yearRange: [number, number];
  activeCategories: EventCategory[];
  onYearRangeChange: (range: [number, number]) => void;
  onCategoryToggle: (cat: EventCategory) => void;
  onClose: () => void;
}

export function MobileFiltersSheet({
  yearRange,
  activeCategories,
  onYearRangeChange,
  onCategoryToggle,
  onClose,
}: Props) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  // 閉じる際、フィルター変更を反映したチャートを見せたい
  const handleClose = useCallback(() => {
    document.getElementById("chart-container")?.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
    onClose();
  }, [onClose]);

  // Escape キーで閉じる
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  // マウント時: 背景の body スクロールをロックするだけに留める。
  // 開いた瞬間に scrollIntoView でチャート位置へ飛ぶと、ユーザーが触っていない
  // のに背景が動いて見えて混乱するため削除（以前の挙動）。
  // 代わりに handleClose 経由で閉じるタイミングでチャートへスクロール。
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // ドラッグ操作（ハンドル領域から下方向にスワイプで閉じる）
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragStartY.current = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartY.current === null) return;
    const delta = e.clientY - dragStartY.current;
    setDragOffset(Math.max(0, delta));
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (dragStartY.current === null) return;
      const delta = e.clientY - dragStartY.current;
      dragStartY.current = null;
      setDragOffset(0);
      if (delta > DRAG_CLOSE_THRESHOLD) handleClose();
    },
    [handleClose],
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={handleClose}
        aria-hidden
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-filters-title"
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl pt-2 px-6 pb-6 space-y-4 max-h-[80vh] overflow-y-auto"
        style={{
          backgroundColor: "var(--card)",
          borderTop: "1px solid var(--border)",
          animation: dragOffset === 0 ? "slideUp 0.3s ease-out" : undefined,
          transform: dragOffset > 0 ? `translateY(${dragOffset}px)` : undefined,
          transition: dragOffset === 0 ? "transform 0.2s ease-out" : "none",
          touchAction: "pan-y",
        }}
      >
        {/* ドラッグハンドル + 閉じるボタン */}
        <div className="flex items-center justify-between sticky top-0 -mx-6 px-6 pb-2"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="w-10" aria-hidden />
          <div
            className="flex-1 flex justify-center py-2 cursor-grab active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            role="button"
            tabIndex={-1}
            aria-label="シートをドラッグして閉じる"
          >
            <div className="h-1 w-12 rounded-full" style={{ backgroundColor: "var(--border)" }} />
          </div>
          <button
            onClick={handleClose}
            aria-label="フィルターを閉じる"
            className="flex items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            style={{
              minWidth: 44,
              minHeight: 44,
              fontSize: 20,
              color: "var(--muted)",
              backgroundColor: "transparent",
            }}
          >
            ✕
          </button>
        </div>

        <h2 id="mobile-filters-title" className="sr-only">フィルター設定</h2>

        {/* 注目の期間 */}
        <div>
          <h2 className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>注目の期間</h2>
          <EraShortcuts yearRange={yearRange} onRangeChange={onYearRangeChange} />
        </div>

        {/* 表示期間スライダー */}
        <section aria-labelledby="range-heading-sheet">
          <h2 id="range-heading-sheet" className="text-xs font-medium mb-3" style={{ color: "var(--muted)" }}>
            表示期間
          </h2>
          <RangeSlider
            min={DATA_YEARS.MIN}
            max={DATA_YEARS.MAX}
            value={yearRange}
            onChange={onYearRangeChange}
            step={1}
            aria-label={`表示期間: ${yearRange[0]}年から${yearRange[1]}年まで`}
          />
        </section>

        {/* イベントフィルター */}
        <section aria-labelledby="event-heading-sheet">
          <h2 id="event-heading-sheet" className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>
            経済イベントフィルター
          </h2>
          <EventFilter
            categories={ALL_CATEGORIES}
            activeCategories={activeCategories}
            onToggle={onCategoryToggle}
          />
        </section>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
