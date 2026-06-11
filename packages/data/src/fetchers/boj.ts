import { fetchText, parseCSV, parseNumberClean } from "./utils";

/**
 * 日銀 時系列統計データ FX レート（USD/JPY 月次仲値）
 * 公開 CSV: https://www.stat-search.boj.or.jp/ssi/cgi-bin/famecgi2?cgi=$nme_a000&lstSelection=FM08'FM08_M_JY
 * （セッション依存のためフォールバック CSV を併用）
 */
const BOJ_FX_CSV_URL = "https://www.stat-search.boj.or.jp/info/dload/FM08_M_JY.csv";

/** 為替（USD/JPY 年平均） */
export async function fetchFXFromBOJ(): Promise<Map<number, number>> {
  console.log("  💴 USD/JPY (BOJ CSV) を取得中...");
  try {
    const csv = await fetchText(BOJ_FX_CSV_URL, "shift_jis");
    const rows = parseCSV(csv);
    const byYear = new Map<number, number[]>();
    for (const row of rows) {
      if (row.length < 2) continue;
      const date = row[0]?.trim(); // 例 "1990/01"
      const val = parseNumberClean(row[1]);
      const m = date?.match(/^(\d{4})/);
      if (!m || val == null) continue;
      const year = parseInt(m[1], 10);
      if (year < 1980 || year > 2030) continue;
      if (!byYear.has(year)) byYear.set(year, []);
      byYear.get(year)!.push(val);
    }
    const result = new Map<number, number>();
    for (const [y, arr] of byYear) result.set(y, Math.round((arr.reduce((a, b) => a + b) / arr.length) * 10) / 10);
    if (result.size === 0) throw new Error("BOJ FX: 0件");
    return result;
  } catch (err) {
    console.warn(`  ⚠️  BOJ FX フェッチ失敗、ハードコードにフォールバック: ${(err as Error).message}`);
    return new Map();
  }
}
