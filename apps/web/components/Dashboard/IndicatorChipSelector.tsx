"use client";

import { useId, useState } from "react";
import { Check } from "lucide-react";
import type { IndicatorKey } from "@/lib/types";
import { INDICATOR_CONFIGS } from "@/lib/data";

interface Props {
  /** "multi" は selected 配列に含まれる全指標、"single" は 1 指標のみ強調 */
  mode: "multi" | "single";
  selected: IndicatorKey[] | IndicatorKey;
  onToggle: (key: IndicatorKey) => void;
  /** disabled なら斜線 + クリック不可。データが無い等で表示できない指標を示す */
  disabledKeys?: IndicatorKey[];
  label?: string;
  /**
   * true の場合、すべての指標チップを単一ボタン「+ 他の指標を重ねる」に畳む。
   * SP のチャートカード内で利用。「重なり」を差別化として言語化しつつFVを軽くする。
   */
  compact?: boolean;
}

/**
 * 指標選択チップ。SP/PC/ComparisonView 全モードで共通利用。
 * 親 state を唯一のソースとし、内部 state は details の open/close のみ。
 */
export function IndicatorChipSelector({
  mode,
  selected,
  onToggle,
  disabledKeys = [],
  label = "重ねて表示する指標",
  compact = false,
}: Props) {
  const panelId = useId();
  const [expanded, setExpanded] = useState(false);

  const isActive = (key: IndicatorKey) =>
    mode === "multi"
      ? (selected as IndicatorKey[]).includes(key)
      : selected === key;

  const activeCount = INDICATOR_CONFIGS.filter(c => isActive(c.key)).length;
  const totalCount = INDICATOR_CONFIGS.length;

  const renderChip = (cfg: (typeof INDICATOR_CONFIGS)[number]) => {
    const active = isActive(cfg.key);
    const disabled = disabledKeys.includes(cfg.key);
    return (
      <button
        key={cfg.key}
        onClick={() => !disabled && onToggle(cfg.key)}
        disabled={disabled}
        aria-pressed={active}
        aria-disabled={disabled}
        className="rounded-full text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 inline-flex items-center gap-1"
        style={{
          minHeight: 44,
          padding: "0 12px",
          border: active && !disabled ? "1px solid transparent" : "1px solid var(--border)",
          color: disabled
            ? "var(--muted)"
            : active
              ? "#ffffff"
              : "var(--muted)",
          backgroundColor: active && !disabled ? cfg.color : "transparent",
          fontWeight: active ? 700 : 400,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          textDecoration: disabled ? "line-through" : "none",
        }}
        title={disabled ? "このモードでは表示できません" : undefined}
      >
        {active && !disabled && (
          <Check size={12} strokeWidth={3} aria-hidden />
        )}
        {cfg.label}
      </button>
    );
  };

  if (!compact) {
    // すべての指標を1列で表示（PC・ComparisonView 互換）
    return (
      <div className="mb-4">
        <div className="text-xs mb-2" style={{ color: "var(--muted)" }}>
          {label}
        </div>
        <div
          className="flex gap-1.5 flex-wrap"
          role="group"
          aria-label={label}
        >
          {INDICATOR_CONFIGS.map(renderChip)}
        </div>
      </div>
    );
  }

  // compact: 全チップを単一ボタンに畳む。デフォルト2指標が重なったチャートが
  // 既に見えている状態を前提に、追加の指標は触りたい人だけが展開する。
  // multi: 「他の指標を重ねる」(X/9 表示中)
  // single: 「指標を切り替え」(現在の指標名) — 「重ねる」表現は単一選択モードに合わない
  const isSingleMode = mode === "single";
  const currentSingleLabel = isSingleMode
    ? INDICATOR_CONFIGS.find(c => c.key === (selected as IndicatorKey))?.label ?? ""
    : "";

  const buttonClosedLabel = isSingleMode ? "指標を切り替え" : "他の指標を重ねる";

  return (
    <div className="mb-3">
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        aria-expanded={expanded}
        aria-controls={panelId}
        className="inline-flex items-center gap-1.5 text-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 py-1"
        style={{
          color: "var(--link)",
          background: "transparent",
          border: "none",
          fontWeight: 600,
          minHeight: 32,
        }}
      >
        <span aria-hidden>{expanded ? "−" : "＋"}</span>
        <span className="underline underline-offset-2 decoration-1">
          {expanded ? "指標選択を閉じる" : buttonClosedLabel}
        </span>
        <span
          className="text-xs tabular-nums"
          style={{ color: "var(--muted)", fontWeight: 400, marginLeft: 4 }}
        >
          （{isSingleMode ? currentSingleLabel : `${activeCount}/${totalCount} 表示中`}）
        </span>
      </button>
      {expanded && (
        <div
          id={panelId}
          className="flex gap-1.5 flex-wrap mt-3"
          role="group"
          aria-label={label}
        >
          {INDICATOR_CONFIGS.map(renderChip)}
        </div>
      )}
    </div>
  );
}
