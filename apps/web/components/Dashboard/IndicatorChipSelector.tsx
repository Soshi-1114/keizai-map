"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { IndicatorKey } from "@/lib/types";
import { INDICATOR_CONFIGS } from "@/lib/data";

/** SPで常時表示する主要4指標。残り5指標は details で折りたたむ */
const PRIMARY_INDICATORS: IndicatorKey[] = ["wage", "cpi", "tax", "fx"];

interface Props {
  /** "multi" は selected 配列に含まれる全指標、"single" は 1 指標のみ強調 */
  mode: "multi" | "single";
  selected: IndicatorKey[] | IndicatorKey;
  onToggle: (key: IndicatorKey) => void;
  /** disabled なら斜線 + クリック不可。データが無い等で表示できない指標を示す */
  disabledKeys?: IndicatorKey[];
  label?: string;
  /** true の場合、主要4指標を常時表示・残り5指標を details で折りたたむ */
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
  const restConfigs = INDICATOR_CONFIGS.filter(
    c => !PRIMARY_INDICATORS.includes(c.key),
  );
  const restActiveKey = (() => {
    if (mode === "multi") {
      return restConfigs.some(c => (selected as IndicatorKey[]).includes(c.key));
    }
    return restConfigs.some(c => (selected as IndicatorKey) === c.key);
  })();
  // 展開/折りたたみ。初期値: 「もっと見る」内に選択中があれば開く
  const [expanded, setExpanded] = useState(restActiveKey);
  const restActiveCount = (() => {
    if (mode === "multi") {
      return restConfigs.filter(c =>
        (selected as IndicatorKey[]).includes(c.key),
      ).length;
    }
    return restConfigs.filter(c => (selected as IndicatorKey) === c.key).length;
  })();

  const isActive = (key: IndicatorKey) =>
    mode === "multi"
      ? (selected as IndicatorKey[]).includes(key)
      : selected === key;

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

  // compact: 主要4 + details で折りたたみ
  const primaryConfigs = INDICATOR_CONFIGS.filter(c =>
    PRIMARY_INDICATORS.includes(c.key),
  );

  return (
    <div className="mb-3">
      <div className="text-xs mb-2" style={{ color: "var(--muted)" }}>
        {label}
      </div>
      <div className="flex gap-1.5 flex-wrap" role="group" aria-label={label}>
        {primaryConfigs.map(renderChip)}
      </div>
      <div className="mt-2">
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          aria-expanded={expanded}
          className="text-xs cursor-pointer inline-flex items-center gap-1 rounded-full px-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          style={{
            minHeight: 44,
            color: "var(--muted)",
            border: "1px dashed var(--border)",
            backgroundColor: "transparent",
          }}
        >
          <span aria-hidden>{expanded ? "−" : "＋"}</span>
          {expanded ? "閉じる" : "もっと見る"} ({restConfigs.length}指標
          {restActiveCount > 0 && ` / ${restActiveCount}選択中`})
        </button>
        {expanded && (
          <div
            className="flex gap-1.5 flex-wrap mt-2"
            role="group"
            aria-label="追加の指標"
          >
            {restConfigs.map(renderChip)}
          </div>
        )}
      </div>
    </div>
  );
}
