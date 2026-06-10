"use client";

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

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm" style={{ color: "var(--text)" }}>
        <span>{lo}年</span>
        <span>{hi}年</span>
      </div>
      <div className="relative flex items-center select-none" style={{ height: handleSize + 8 }}>
        {/* Track */}
        <div className="absolute inset-x-0 h-1 rounded-full" style={{ backgroundColor: "var(--border)" }} />
        {/* Active fill */}
        <div
          className="absolute h-1 rounded-full bg-[#4F8EF7]"
          style={{ left: `${loPct}%`, right: `${100 - hiPct}%` }}
        />
        {/* Visual handles */}
        <div
          className="absolute rounded-full bg-[#4F8EF7] border-2 border-[#10121A] shadow pointer-events-none z-10"
          style={{
            width: handleSize,
            height: handleSize,
            left: `calc(${loPct}% - ${halfHandle}px)`,
          }}
        />
        <div
          className="absolute rounded-full bg-[#4F8EF7] border-2 border-[#10121A] shadow pointer-events-none z-10"
          style={{
            width: handleSize,
            height: handleSize,
            left: `calc(${hiPct}% - ${halfHandle}px)`,
          }}
        />
        {/* Invisible inputs */}
        <input
          type="range"
          min={min} max={max} step={step} value={lo}
          onChange={e => {
            const v = Math.min(Number(e.target.value), hi - step);
            onChange([v, hi]);
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: lo > max - step ? 5 : 3 }}
        />
        <input
          type="range"
          min={min} max={max} step={step} value={hi}
          onChange={e => {
            const v = Math.max(Number(e.target.value), lo + step);
            onChange([lo, v]);
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: 4 }}
        />
      </div>
    </div>
  );
}
