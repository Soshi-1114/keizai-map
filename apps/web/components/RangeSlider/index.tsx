"use client";

import { useRef, useCallback } from "react";
import { useIsMobile } from "@/lib/hooks";

interface Props {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
}

export function RangeSlider({ min, max, value, onChange, step = 1 }: Props) {
  const isMobile = useIsMobile();
  const [lo, hi] = value;
  const range = max - min;
  const loPct = ((lo - min) / range) * 100;
  const hiPct = ((hi - min) / range) * 100;
  const handleSize = isMobile ? 24 : 16;
  const halfHandle = handleSize / 2;

  const trackRef = useRef<HTMLDivElement>(null);
  // Which handle is being dragged: "lo" | "hi" | null
  const dragging = useRef<"lo" | "hi" | null>(null);

  /** ポインター X 座標からスナップ済み値を計算 */
  const xToValue = useCallback(
    (clientX: number): number | null => {
      if (!trackRef.current) return null;
      const rect = trackRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return Math.round((min + ratio * range) / step) * step;
    },
    [min, range, step],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!trackRef.current) return;
      e.preventDefault();
      trackRef.current.setPointerCapture(e.pointerId);

      const val = xToValue(e.clientX);
      if (val === null) return;
      // より近いハンドルを選択（同距離なら lo を優先）
      dragging.current =
        Math.abs(val - lo) <= Math.abs(val - hi) ? "lo" : "hi";

      // クリック位置に即時移動
      if (dragging.current === "lo") {
        onChange([Math.max(min, Math.min(val, hi - step)), hi]);
      } else {
        onChange([lo, Math.min(max, Math.max(val, lo + step))]);
      }
    },
    [lo, hi, min, max, step, onChange, xToValue],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging.current) return;
      const val = xToValue(e.clientX);
      if (val === null) return;
      if (dragging.current === "lo") {
        onChange([Math.max(min, Math.min(val, hi - step)), hi]);
      } else {
        onChange([lo, Math.min(max, Math.max(val, lo + step))]);
      }
    },
    [lo, hi, min, max, step, onChange, xToValue],
  );

  const handlePointerUp = useCallback(() => {
    dragging.current = null;
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm" style={{ color: "var(--text)" }}>
        <span>{lo}年</span>
        <span>{hi}年</span>
      </div>

      <div
        ref={trackRef}
        className="relative select-none cursor-pointer"
        style={{ height: handleSize + 8, touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* トラック背景 */}
        <div
          className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-1 rounded-full"
          style={{ backgroundColor: "var(--border)" }}
        />
        {/* アクティブ区間 */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full"
          style={{
            left: `${loPct}%`,
            right: `${100 - hiPct}%`,
            backgroundColor: "#4F8EF7",
          }}
        />
        {/* lo ハンドル */}
        <div
          className="absolute top-1/2 -translate-y-1/2 rounded-full shadow pointer-events-none"
          style={{
            width: handleSize,
            height: handleSize,
            left: `calc(${loPct}% - ${halfHandle}px)`,
            backgroundColor: "#4F8EF7",
            border: "2px solid var(--bg)",
          }}
        />
        {/* hi ハンドル */}
        <div
          className="absolute top-1/2 -translate-y-1/2 rounded-full shadow pointer-events-none"
          style={{
            width: handleSize,
            height: handleSize,
            left: `calc(${hiPct}% - ${halfHandle}px)`,
            backgroundColor: "#4F8EF7",
            border: "2px solid var(--bg)",
          }}
        />
      </div>
    </div>
  );
}
