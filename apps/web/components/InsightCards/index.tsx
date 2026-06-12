import type { DataPoint, IndicatorKey } from "@/lib/types";
import { INDICATOR_CONFIGS } from "@/lib/data";

interface Props {
  data: DataPoint[];
  yearRange?: [number, number];
  /** 表示する指標。指定がない場合は全指標。0 件なら何も描画しない。 */
  activeIndicators?: IndicatorKey[];
  /** 後方互換: 単一指標フォーカス（既存呼び出し向け） */
  focusedKey?: IndicatorKey;
}

export function InsightCards({ data, activeIndicators, focusedKey }: Props) {
  if (data.length < 2) return null;

  const start = data[0];
  const end = data[data.length - 1];
  const sameYear = start.year === end.year;

  const configs = focusedKey
    ? INDICATOR_CONFIGS.filter(c => c.key === focusedKey)
    : activeIndicators
      ? INDICATOR_CONFIGS.filter(c => activeIndicators.includes(c.key))
      : INDICATOR_CONFIGS;

  if (configs.length === 0) return null;

  return (
    <div className={configs.length === 1 ? "grid grid-cols-1 gap-3" : "grid grid-cols-2 md:grid-cols-4 gap-3"}>
      {configs.map(cfg => {
        const startVal = start[cfg.key] as number | null;
        const endVal   = end[cfg.key]   as number | null;
        if (startVal == null || endVal == null) return null;

        const delta    = endVal - startVal;
        const deltaPct = startVal !== 0 ? (delta / startVal) * 100 : 0;
        const sign     = delta >= 0 ? "+" : "";
        const deltaColor = delta >= 0 ? "#22c55e" : "#ef4444";

        const unitShort =
          cfg.key === "tax" || cfg.key === "debt" ? "兆円" :
          cfg.key === "fx"  ? "円"   :
          cfg.key === "births" ? "万人" :
          cfg.key === "insurance" ? "%" : "";

        return (
          <div
            key={cfg.key}
            className="rounded-xl border p-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="text-xs font-medium mb-2 truncate" style={{ color: cfg.color }}>
              {cfg.label}
            </div>

            {sameYear ? (
              <div className="text-xl font-bold tabular-nums" style={{ color: cfg.color }}>
                {endVal.toFixed(1)}{unitShort && <span className="text-sm ml-0.5">{unitShort}</span>}
              </div>
            ) : (
              <div className="text-2xl font-bold tabular-nums leading-none" style={{ color: deltaColor }}>
                {sign}{deltaPct.toFixed(1)}%
              </div>
            )}

            <div className="mt-2 space-y-0.5">
              <div className="text-[11px]" style={{ color: "var(--muted)" }}>
                {start.year}年 → {end.year}年
              </div>
              <div className="text-[11px] tabular-nums" style={{ color: "var(--muted)" }}>
                {startVal.toFixed(1)}{unitShort} → {endVal.toFixed(1)}{unitShort}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
