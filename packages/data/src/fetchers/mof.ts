import { fetchText, parseCSV, parseNumberClean } from "./utils";

/**
 * 財務省 一般会計税収（決算ベース）
 * 公開 PDF/Excel しか提供されていないが、メンテナンスされた GitHub ミラーがあれば優先利用。
 * フォールバック値は公開資料から取得した最新の確定値。
 */
const MOF_TAX_CSV_URL = "https://www.mof.go.jp/tax_policy/summary/condition/010.csv";

/** 税収（兆円） */
export async function fetchTaxFromMOF(): Promise<Map<number, number>> {
  console.log("  💰 税収 (財務省 CSV) を取得中...");
  try {
    const csv = await fetchText(MOF_TAX_CSV_URL, "shift_jis");
    const rows = parseCSV(csv);
    const result = new Map<number, number>();
    for (const row of rows) {
      if (row.length < 2) continue;
      const yearMatch = row[0]?.match(/(\d{4})/);
      const val = parseNumberClean(row[row.length - 1]);
      if (!yearMatch || val == null) continue;
      const year = parseInt(yearMatch[1], 10);
      if (year < 1985 || year > 2030) continue;
      result.set(year, Math.round(val * 10) / 10);
    }
    if (result.size === 0) throw new Error("MOF 税収: 0件");
    return result;
  } catch (err) {
    console.warn(`  ⚠️  MOF 税収フェッチ失敗、ハードコードにフォールバック: ${(err as Error).message}`);
    return new Map();
  }
}

/**
 * 財務省 国債及び借入金現在高（普通国債残高）
 * 公開 CSV からの自動取得を試行
 */
const MOF_DEBT_CSV_URL = "https://www.mof.go.jp/jgbs/reference/appendix/breakdown.csv";

export async function fetchDebtFromMOF(): Promise<Map<number, number>> {
  console.log("  📑 国債残高 (財務省 CSV) を取得中...");
  try {
    const csv = await fetchText(MOF_DEBT_CSV_URL, "shift_jis");
    const rows = parseCSV(csv);
    const result = new Map<number, number>();
    for (const row of rows) {
      if (row.length < 2) continue;
      const yearMatch = row[0]?.match(/(\d{4})/);
      const val = parseNumberClean(row[1]);
      if (!yearMatch || val == null) continue;
      const year = parseInt(yearMatch[1], 10);
      if (year < 1985 || year > 2030) continue;
      result.set(year, Math.round(val * 10) / 10);
    }
    if (result.size === 0) throw new Error("MOF 国債: 0件");
    return result;
  } catch (err) {
    console.warn(`  ⚠️  MOF 国債フェッチ失敗、ハードコードにフォールバック: ${(err as Error).message}`);
    return new Map();
  }
}
