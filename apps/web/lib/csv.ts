import type { DataPoint, IndicatorKey } from "./types";

export function generateCSV(
  data: DataPoint[],
  selectedIndicators: IndicatorKey[],
  yearRange: [number, number]
): string {
  const [minYear, maxYear] = yearRange;
  const filteredData = data.filter(d => d.year >= minYear && d.year <= maxYear);

  // ヘッダー行
  const headers = ["年度", ...selectedIndicators];
  const rows: string[][] = [headers];

  // データ行
  for (const point of filteredData) {
    const row: string[] = [String(point.year)];
    for (const indicator of selectedIndicators) {
      const value = point[indicator];
      row.push(value !== undefined ? String(value) : "");
    }
    rows.push(row);
  }

  // CSV文字列を生成（RFC 4180に準拠）
  return rows
    .map(row =>
      row
        .map(cell => {
          // ダブルクォートと改行を含む場合はクォートで囲む
          if (cell.includes(",") || cell.includes('"') || cell.includes("\n")) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        })
        .join(",")
    )
    .join("\n");
}

export function downloadCSV(csv: string, filename: string = "keizai-map.csv"): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
