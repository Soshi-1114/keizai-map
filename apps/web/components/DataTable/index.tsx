import type { DataPoint, IndicatorKey } from "@/lib/types";
import { INDICATOR_CONFIGS } from "@/lib/data";

interface Props {
  data: DataPoint[];
  activeIndicators: IndicatorKey[];
}

export function DataTable({ data, activeIndicators }: Props) {
  const shownConfigs = INDICATOR_CONFIGS.filter(c => activeIndicators.includes(c.key));

  return (
    <div style={{ marginTop: "1.5rem", overflow: "auto" }}>
      <table
        aria-label="経済指標データ"
        style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid var(--border)" }}>
            <th
              scope="col"
              style={{ padding: "0.75rem", textAlign: "left", fontWeight: 600, color: "var(--text)" }}
            >
              年度
            </th>
            {shownConfigs.map(cfg => (
              <th
                key={cfg.key}
                scope="col"
                style={{ padding: "0.75rem", textAlign: "right", fontWeight: 600, color: cfg.color }}
              >
                {cfg.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((point, idx) => (
            <tr
              key={point.year}
              style={{
                borderBottom: "1px solid var(--border)",
                backgroundColor: idx % 2 === 0 ? "transparent" : "var(--card)",
              }}
            >
              <th
                scope="row"
                style={{ padding: "0.75rem", textAlign: "left", fontWeight: 500, color: "var(--text)" }}
              >
                {point.year}
              </th>
              {shownConfigs.map(cfg => {
                const value = point[cfg.key];
                return (
                  <td
                    key={cfg.key}
                    style={{ padding: "0.75rem", textAlign: "right", color: "var(--text)", fontFamily: "monospace" }}
                  >
                    {value != null ? (typeof value === "number" ? value.toFixed(1) : value) : "—"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
