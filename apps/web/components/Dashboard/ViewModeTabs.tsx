"use client";

import { TrendingUp, Landmark, Zap, Search, type LucideIcon } from "lucide-react";

export type ViewMode = "chart" | "admin" | "shock" | "event";

interface Props {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
  isMobile: boolean;
}

// 目的別ラベル + アイコン + 説明文（hover/フォーカス時にツールチップ）
export const VIEW_MODES: {
  key: ViewMode;
  label: string;
  shortLabel: string;
  Icon: LucideIcon;
  description: string;
}[] = [
  { key: "chart", label: "指標推移",       shortLabel: "推移",     Icon: TrendingUp, description: "選択した指標を時系列で重ね見" },
  { key: "admin", label: "政権別の変化率", shortLabel: "政権",     Icon: Landmark,   description: "各政権期間中の指標変化率を棒グラフで比較" },
  { key: "shock", label: "経済危機の影響", shortLabel: "ショック", Icon: Zap,        description: "バブル崩壊・リーマン・コロナの前後を比較" },
  { key: "event", label: "個別イベント",   shortLabel: "イベント", Icon: Search,     description: "特定の経済イベント周辺を詳細に分析" },
];

export function ViewModeTabs({ viewMode, onChange, isMobile }: Props) {
  return (
    <div
      className={`flex gap-0.5 rounded-lg p-0.5 ${isMobile ? "w-full" : ""}`}
      style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)" }}
      role="tablist"
      aria-label="分析モードを選択"
    >
      {VIEW_MODES.map(({ key, label, shortLabel, Icon, description }) => {
        const active = viewMode === key;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={active}
            aria-label={`${label} — ${description}`}
            title={description}
            onClick={() => onChange(key)}
            className={`inline-flex items-center justify-center gap-1.5 rounded-md transition-all text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
              isMobile ? "flex-1" : "px-3 py-1.5"
            }`}
            style={{
              minHeight: isMobile ? 44 : undefined,
              backgroundColor: active ? "var(--card)" : "transparent",
              color: active ? "var(--text)" : "var(--muted)",
              fontWeight: active ? 600 : 400,
              boxShadow: active ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            }}
          >
            <Icon size={14} aria-hidden />
            {isMobile ? shortLabel : label}
          </button>
        );
      })}
    </div>
  );
}
