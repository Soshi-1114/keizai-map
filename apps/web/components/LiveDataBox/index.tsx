import type { IndicatorKey } from "@/lib/types";
import { RAW_DATA, INDICATOR_CONFIGS } from "@/lib/data";

interface Item {
  year: number;
  key: IndicatorKey;
  label?: string;
  note?: string;
}

export function LiveDataBox({ items }: { items: Item[] }) {
  const rendered = items.map(({ year, key, label, note }) => {
    const point = RAW_DATA.find((d) => d.year === year);
    const cfg = INDICATOR_CONFIGS.find((c) => c.key === key);
    const raw = point?.[key];
    const value =
      raw != null
        ? `${raw.toFixed(key === "tax" || key === "debt" ? 1 : 1)}${cfg?.unit?.replace(/（|）/g, "") ?? ""}`
        : "—";
    return { label: label ?? `${year}年`, value, color: cfg?.color, note };
  });

  return (
    <div
      className="rounded-xl border p-4 grid grid-cols-2 md:grid-cols-4 gap-4 my-4"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      {rendered.map(({ label, value, note, color }) => (
        <div key={label}>
          <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>{label}</div>
          <div className="text-xl font-bold tabular-nums" style={{ color: color ?? "var(--text)" }}>
            {value}
          </div>
          {note && <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{note}</div>}
        </div>
      ))}
    </div>
  );
}
