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

export function EraShortcuts({ yearRange, onRangeChange }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {ERA_SHORTCUTS.map(({ label, range }) => {
        const isActive = yearRange[0] === range[0] && yearRange[1] === range[1];
        return (
          <button
            key={label}
            onClick={() => onRangeChange(range)}
            className="rounded-full text-xs border transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            style={{
              minHeight: 44,
              padding: "0 14px",
              borderColor:     isActive ? "var(--link)" : "var(--border)",
              color:           isActive ? "var(--link)" : "var(--muted)",
              backgroundColor: isActive ? "#1d4ed815" : "transparent",
              fontWeight:      isActive ? 600 : 400,
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
