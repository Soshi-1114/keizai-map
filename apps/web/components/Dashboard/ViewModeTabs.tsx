"use client";

export type ViewMode = "chart" | "admin" | "shock" | "event";

interface Props {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
  isMobile: boolean;
}

export const VIEW_MODES: { key: ViewMode; label: string }[] = [
  { key: "chart", label: "グラフ" },
  { key: "admin", label: "政権比較" },
  { key: "shock", label: "ショック比較" },
  { key: "event", label: "イベント詳細" },
];

export function ViewModeTabs({ viewMode, onChange, isMobile }: Props) {
  return (
    <div
      className={`flex gap-0.5 rounded-lg p-0.5 ${isMobile ? "w-full" : ""}`}
      style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)" }}
      role="tablist"
      aria-label="表示モード"
    >
      {VIEW_MODES.map(({ key, label }) => {
        const active = viewMode === key;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(key)}
            className={`py-1.5 rounded-md transition-all text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
              isMobile ? "flex-1" : "px-3"
            }`}
            style={{
              backgroundColor: active ? "var(--card)" : "transparent",
              color: active ? "var(--text)" : "var(--muted)",
              fontWeight: active ? 600 : 400,
              boxShadow: active ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
