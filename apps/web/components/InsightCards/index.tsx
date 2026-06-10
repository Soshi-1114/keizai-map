import type { DataPoint } from "@/lib/types";
import { INDICATOR_CONFIGS } from "@/lib/data";

interface Props {
  data: DataPoint[];
  yearRange?: [number, number];
}

export function InsightCards({ data }: Props) {
  if (data.length < 2) return null;

  const start = data[0];
  const end = data[data.length - 1];
  const sameYear = start.year === end.year;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {INDICATOR_CONFIGS.map(cfg => {
        const startVal = start[cfg.key] as number | null;
        const endVal   = end[cfg.key]   as number | null;
        if (startVal == null || endVal == null) return null;

        const delta    = endVal - startVal;
        const deltaPct = startVal !== 0 ? (delta / startVal) * 100 : 0;
        const sign     = delta >= 0 ? "+" : "";
        const deltaColor = delta >= 0 ? "#22c55e" : "#ef4444";

        const unitShort =
          cfg.key === "tax" ? "兆円" :
          cfg.key === "fx"  ? "円"   : "";

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
