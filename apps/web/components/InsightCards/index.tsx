import type { DataPoint } from "@keizai-map/types";

interface Props {
  data: DataPoint[];
  yearRange: [number, number];
}

function findClosest(data: DataPoint[], year: number): DataPoint | undefined {
  return data.reduce((prev, curr) =>
    Math.abs(curr.year - year) < Math.abs(prev.year - year) ? curr : prev
  );
}

const CARDS = [
  { key: "wage" as const, label: "実質賃金",       color: "#4F8EF7", unit: "",    suffix: "" },
  { key: "cpi"  as const, label: "消費者物価",     color: "#F7C94F", unit: "",    suffix: "" },
  { key: "tax"  as const, label: "税収",            color: "#E05C5C", unit: "兆円", suffix: "" },
  { key: "fx"   as const, label: "USD/JPY",         color: "#4FD9A0", unit: "円",  suffix: "" },
];

export function InsightCards({ data, yearRange }: Props) {
  const [startYear, endYear] = yearRange;
  const startPoint = findClosest(data, startYear);
  const endPoint   = findClosest(data, endYear);

  if (!startPoint || !endPoint) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {CARDS.map(({ key, label, color, unit }) => {
        const current = endPoint[key];
        const delta   = endPoint[key] - startPoint[key];
        const sign    = delta >= 0 ? "+" : "";
        return (
          <div
            key={key}
            className="rounded-lg p-4 border"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>{label}</div>
            <div className="text-xl font-bold" style={{ color }}>
              {current.toFixed(1)}{unit && <span className="text-sm ml-0.5">{unit}</span>}
            </div>
            <div className={`text-xs mt-1 ${delta >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {sign}{delta.toFixed(1)}{unit}
              <span className="ml-1" style={{ color: "var(--muted)" }}>({startYear}年比)</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
