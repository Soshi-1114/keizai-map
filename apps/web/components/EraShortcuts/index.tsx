"use client";

const ERA_SHORTCUTS: { label: string; range: [number, number] }[] = [
  { label: "バブル崩壊",  range: [1990, 1998] },
  { label: "小泉改革",    range: [2002, 2008] },
  { label: "アベノミクス", range: [2012, 2020] },
  { label: "コロナ禍",    range: [2018, 2022] },
  { label: "円安加速",    range: [2020, 2024] },
];

interface Props {
  yearRange: [number, number];
  onRangeChange: (range: [number, number]) => void;
}

const formatYearShort = (y: number) => `'${String(y).slice(2)}`;

export function EraShortcuts({ yearRange, onRangeChange }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {ERA_SHORTCUTS.map(({ label, range }) => {
        const isActive = yearRange[0] === range[0] && yearRange[1] === range[1];
        const period = `${formatYearShort(range[0])}–${formatYearShort(range[1])}`;
        return (
          <button
            key={label}
            onClick={() => onRangeChange(range)}
            aria-label={`${label}（${range[0]}〜${range[1]}年）`}
            className="rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 flex flex-col items-center justify-center leading-tight"
            style={{
              minHeight: 44,
              padding: "4px 14px",
              borderColor:     isActive ? "var(--link)" : "var(--border)",
              color:           isActive ? "var(--link)" : "var(--muted)",
              backgroundColor: isActive ? "var(--indigo-tint)" : "transparent",
              fontWeight:      isActive ? 600 : 400,
            }}
          >
            <span className="text-xs">{label}</span>
            <span
              className="tabular-nums"
              style={{
                fontSize: 10,
                opacity: isActive ? 0.85 : 0.7,
              }}
            >
              {period}
            </span>
          </button>
        );
      })}
    </div>
  );
}
