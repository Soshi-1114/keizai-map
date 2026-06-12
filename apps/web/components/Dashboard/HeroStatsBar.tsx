import type { DataPoint, IndicatorKey } from "@/lib/types";
import { INDICATOR_CONFIGS } from "@/lib/data";

interface Props {
  data: DataPoint[];
  /** ハイライト表示する指標の最大数（変化が大きい順） */
  topN?: number;
  activeIndicators?: IndicatorKey[];
}

/** 期間の最初と最後の差分を計算し変化が大きい順に並べる */
export function HeroStatsBar({ data, topN = 4, activeIndicators }: Props) {
  if (data.length < 2) return null;
  const s = data[0];
  const e = data[data.length - 1];

  const targets = activeIndicators && activeIndicators.length > 0
    ? INDICATOR_CONFIGS.filter(c => activeIndicators.includes(c.key))
    : INDICATOR_CONFIGS;

  const rows = targets
    .map(cfg => {
      const sv = s[cfg.key] as number | undefined;
      const ev = e[cfg.key] as number | undefined;
      if (sv == null || ev == null || sv === 0) return null;
      const pct = ((ev - sv) / sv) * 100;
      return { cfg, pct };
    })
    .filter((x): x is { cfg: typeof INDICATOR_CONFIGS[number]; pct: number } => x !== null)
    .sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct))
    .slice(0, topN);

  if (rows.length === 0) return null;

  return (
    <div
      className="rounded-xl border px-4 py-3 flex flex-wrap items-center gap-x-5 gap-y-2"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      aria-label={`${s.year}年から${e.year}年の変化が大きい指標`}
    >
      <span className="text-xs font-semibold shrink-0" style={{ color: "var(--muted)" }}>
        {s.year}年 → {e.year}年
      </span>
      {rows.map(({ cfg, pct }) => {
        const sign = pct >= 0 ? "+" : "";
        const color = pct >= 0 ? "#22c55e" : "#ef4444";
        return (
          <span key={cfg.key} className="flex items-baseline gap-1">
            <span className="text-xs" style={{ color: "var(--muted)" }}>{cfg.label}</span>
            <span className="text-sm font-bold tabular-nums" style={{ color }}>
              {sign}{pct.toFixed(1)}%
            </span>
          </span>
        );
      })}
    </div>
  );
}
