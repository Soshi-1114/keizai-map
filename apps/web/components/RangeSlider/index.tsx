"use client";

import { memo, useRef, useCallback, useState } from "react";

interface Props {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  /**
   * 確定時 (pointerup / キー操作後) に呼ばれるコールバック。
   * URL同期やドラッグ中に走らせたくない副作用に使う。
   * ドラッグ中も走る onChange と区別。
   */
  onCommit?: (value: [number, number]) => void;
  step?: number;
  /** SP判定。親で1回 useIsMobile を呼びprops配布 */
  isMobile: boolean;
  "aria-label"?: string;
}

type Handle = "lo" | "hi";

function RangeSliderImpl({ min, max, value, onChange, onCommit, step = 1, isMobile, ...rest }: Props) {
  const ariaLabel = rest["aria-label"];
  const [lo, hi] = value;
  const range = max - min;
  const loPct = ((lo - min) / range) * 100;
  const hiPct = ((hi - min) / range) * 100;
  const handleSize = isMobile ? 28 : 20;
  const halfHandle = handleSize / 2;

  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<Handle | null>(null);
  const [focused, setFocused] = useState<Handle | null>(null);

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

  const setHandle = useCallback(
    (which: Handle, nextRaw: number) => {
      if (which === "lo") {
        onChange([Math.max(min, Math.min(nextRaw, hi - step)), hi]);
      } else {
        onChange([lo, Math.min(max, Math.max(nextRaw, lo + step))]);
      }
    },
    [lo, hi, min, max, step, onChange],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!trackRef.current) return;
      e.preventDefault();
      trackRef.current.setPointerCapture(e.pointerId);
      const val = xToValue(e.clientX);
      if (val === null) return;
      dragging.current =
        Math.abs(val - lo) <= Math.abs(val - hi) ? "lo" : "hi";
      setHandle(dragging.current, val);
    },
    [lo, hi, xToValue, setHandle],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging.current) return;
      const val = xToValue(e.clientX);
      if (val === null) return;
      setHandle(dragging.current, val);
    },
    [xToValue, setHandle],
  );

  const handlePointerUp = useCallback(() => {
    if (dragging.current) {
      dragging.current = null;
      // 確定: ドラッグ終了。URL同期等のため onCommit を発火
      onCommit?.([lo, hi]);
    }
  }, [lo, hi, onCommit]);

  /** キーボードでハンドルを操作（←→: ±step、PgUp/Dn: ±10年、Home/End: 端） */
  const makeKeyHandler = (which: Handle) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    const current = which === "lo" ? lo : hi;
    const big = Math.max(step, Math.round(range / 10));
    let next: number | null = null;
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        next = current - step;
        break;
      case "ArrowRight":
      case "ArrowUp":
        next = current + step;
        break;
      case "PageDown":
        next = current - big;
        break;
      case "PageUp":
        next = current + big;
        break;
      case "Home":
        next = which === "lo" ? min : lo + step;
        break;
      case "End":
        next = which === "lo" ? hi - step : max;
        break;
      default:
        return;
    }
    e.preventDefault();
    setHandle(which, next);
    // キー操作は1ストロークで「確定」扱い (連打中も都度commit、debounceは useUrlSync 側に任せる)
    const after: [number, number] = which === "lo"
      ? [Math.max(min, Math.min(next, hi - step)), hi]
      : [lo, Math.min(max, Math.max(next, lo + step))];
    onCommit?.(after);
  };

  const handleStyle = (which: Handle, pct: number): React.CSSProperties => ({
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: handleSize,
    height: handleSize,
    left: `calc(${pct}% - ${halfHandle}px)`,
    backgroundColor: "#4F8EF7",
    border: "2px solid var(--bg)",
    borderRadius: "9999px",
    boxShadow:
      focused === which
        ? "0 0 0 3px #1d4ed8, 0 1px 3px rgba(0,0,0,0.2)"
        : "0 1px 3px rgba(0,0,0,0.2)",
    outline: "none",
    cursor: "grab",
    touchAction: "none",
    zIndex: focused === which ? 2 : 1,
  });

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
        role="group"
        aria-label={ariaLabel ?? `表示期間 ${lo}年から${hi}年`}
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
          role="slider"
          tabIndex={0}
          aria-label={`開始年（${min}〜${hi - step}）`}
          aria-valuemin={min}
          aria-valuemax={hi - step}
          aria-valuenow={lo}
          aria-valuetext={`${lo}年`}
          onKeyDown={makeKeyHandler("lo")}
          onFocus={() => setFocused("lo")}
          onBlur={() => setFocused(null)}
          style={handleStyle("lo", loPct)}
        />
        {/* hi ハンドル */}
        <div
          role="slider"
          tabIndex={0}
          aria-label={`終了年（${lo + step}〜${max}）`}
          aria-valuemin={lo + step}
          aria-valuemax={max}
          aria-valuenow={hi}
          aria-valuetext={`${hi}年`}
          onKeyDown={makeKeyHandler("hi")}
          onFocus={() => setFocused("hi")}
          onBlur={() => setFocused(null)}
          style={handleStyle("hi", hiPct)}
        />
      </div>
    </div>
  );
}

export const RangeSlider = memo(RangeSliderImpl);

