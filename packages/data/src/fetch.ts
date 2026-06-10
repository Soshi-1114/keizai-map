/**
 * e-Stat API から経済指標データを取得し、
 * apps/web/lib/data.generated.json に書き出す。
 *
 * 実行: pnpm fetch (packages/data ディレクトリ内)
 *       または pnpm data:fetch (リポジトリルート)
 *
 * データソース:
 *   CPI  : e-Stat API statsDataId=0003427113 (総務省 消費者物価指数 2020年基準) ← 自動更新
 *   賃金  : ハードコード ← e-Stat 毎月勤労統計は2014年以降が API 非対応のため
 *   税収  : ハードコード
 *   為替  : ハードコード
 */

import * as fs from "fs";
import * as path from "path";

const APP_ID = process.env.ESTAT_API_KEY;
if (!APP_ID) {
  console.error("❌ ESTAT_API_KEY 環境変数が設定されていません");
  process.exit(1);
}

const BASE_URL = "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData";
const TARGET_YEARS = [
  1990, 1992, 1994, 1996, 1998, 2000, 2002,
  2004, 2006, 2008, 2010, 2012, 2014, 2016,
  2018, 2020, 2022, 2024,
];

// ─────────────────────────────────────────────
// ハードコードデータ（税収・為替・賃金）
// ─────────────────────────────────────────────

// 実質賃金指数 (1990=100)
// 出典: 厚労省 毎月勤労統計調査（e-Stat毎月勤労統計は2014以降API非対応のためハードコード）
const WAGE_DATA: Record<number, number> = {
  1990: 100.0, 1992: 107.2, 1994: 108.1, 1996: 110.3, 1998: 109.5,
  2000: 107.8, 2002: 104.1, 2004: 102.9, 2006: 103.4, 2008: 102.8,
  2010: 98.5,  2012: 97.4,  2014: 97.1,  2016: 97.5,  2018: 99.1,
  2020: 96.5,  2022: 97.8,  2024: 99.2,
};

// 税収（兆円）出典: 財務省 一般会計租税及び印紙収入
const TAX_DATA: Record<number, number> = {
  1990: 60.1, 1992: 54.4, 1994: 51.0, 1996: 52.1, 1998: 49.4,
  2000: 50.7, 2002: 43.8, 2004: 45.6, 2006: 49.1, 2008: 44.3,
  2010: 41.5, 2012: 43.9, 2014: 50.0, 2016: 55.5, 2018: 60.4,
  2020: 60.8, 2022: 71.1, 2024: 72.1,
};

// USD/JPY 年平均 出典: 日本銀行 時系列統計
const FX_DATA: Record<number, number> = {
  1990: 144.8, 1992: 126.7, 1994: 102.2, 1996: 108.8, 1998: 130.9,
  2000: 107.8, 2002: 125.3, 2004: 108.2, 2006: 116.3, 2008: 103.4,
  2010: 87.8,  2012: 79.8,  2014: 105.9, 2016: 108.8, 2018: 110.4,
  2020: 106.8, 2022: 131.5, 2024: 151.8,
};

// ─────────────────────────────────────────────
// e-Stat API ヘルパー
// ─────────────────────────────────────────────

async function estatFetch(params: Record<string, string>): Promise<unknown> {
  const url = new URL(BASE_URL);
  url.searchParams.set("appId", APP_ID!);
  url.searchParams.set("lang", "J");
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = await res.json() as any;
  const status: number = json?.GET_STATS_DATA?.RESULT?.STATUS ?? -1;
  if (status !== 0) {
    const msg: string = json?.GET_STATS_DATA?.RESULT?.ERROR_MSG ?? "不明なエラー";
    throw new Error(`e-Stat API エラー (status=${status}): ${msg}`);
  }
  return json;
}

function extractValues(json: unknown): Array<Record<string, string>> {
  const vals = (json as any)
    ?.GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF?.VALUE;
  if (!vals) return [];
  return Array.isArray(vals) ? vals : [vals];
}

function yearFromTime(timeCode: string): number {
  return parseInt(timeCode.slice(0, 4), 10);
}

/** values を年ごとに平均 */
function annualAverage(
  values: Array<Record<string, string>>,
): Map<number, number> {
  const byYear = new Map<number, number[]>();
  for (const v of values) {
    const raw = v.$;
    if (!raw || raw === "-" || raw === "…" || raw === "x") continue;
    const num = parseFloat(raw);
    if (isNaN(num)) continue;
    const year = yearFromTime(v["@time"] ?? "");
    if (year < 1985 || year > 2030) continue;
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year)!.push(num);
  }
  const result = new Map<number, number>();
  for (const [year, vals] of byYear) {
    result.set(year, vals.reduce((a, b) => a + b) / vals.length);
  }
  return result;
}

/** baseYear の値を 100 として換算 */
function rebaseTo100(
  data: Map<number, number>,
  baseYear: number,
): Map<number, number> {
  const base = data.get(baseYear);
  if (!base) throw new Error(`${baseYear}年のデータが見つかりません`);
  const result = new Map<number, number>();
  for (const [year, val] of data) {
    result.set(year, Math.round((val / base) * 1000) / 10);
  }
  return result;
}

function round1(n: number | null | undefined): number | null {
  if (n == null) return null;
  return Math.round(n * 10) / 10;
}

// ─────────────────────────────────────────────
// CPI 取得 (e-Stat: 0003427113 / 2020年基準)
// 全国 総合指数 → 月次データを年平均 → 1990=100 に換算
// ─────────────────────────────────────────────
async function fetchCPI(): Promise<Map<number, number>> {
  console.log("  消費者物価指数 (CPI) を取得中...");
  const json = await estatFetch({
    statsDataId: "0003427113",
    cdArea: "00000",  // 全国
    cdCat01: "0001",  // 総合
  });

  const values = extractValues(json);
  console.log(`    → ${values.length}件取得`);
  if (values.length === 0) throw new Error("CPI: データが0件です");

  const annual = annualAverage(values);
  console.log(`    → ${annual.size}年分に集計`);

  const rebased = rebaseTo100(annual, 1990);
  const years = [...rebased.keys()].sort((a, b) => a - b);
  console.log(`    → 年範囲: ${years[0]}–${years[years.length - 1]}`);
  return rebased;
}

// ─────────────────────────────────────────────
// メイン
// ─────────────────────────────────────────────
async function main() {
  console.log("📊 e-Stat API からデータを取得します\n");

  // CPI を e-Stat から取得
  let cpiMap: Map<number, number>;
  try {
    cpiMap = await fetchCPI();
  } catch (err) {
    console.error("\n❌ CPI 取得に失敗しました:", err);
    process.exit(1);
  }

  // ターゲット年ごとにデータを構築
  const data = TARGET_YEARS.map((year) => ({
    year,
    wage: round1(WAGE_DATA[year]),
    cpi: round1(cpiMap.get(year)),
    tax: TAX_DATA[year] ?? null,
    fx: FX_DATA[year] ?? null,
  })).filter((d) => d.cpi !== null);

  if (data.length === 0) {
    console.error("❌ 有効なデータが0件です");
    process.exit(1);
  }

  // apps/web/lib/data.generated.json に書き出し
  // pnpm --filter で実行されるため cwd = packages/data/
  const outPath = path.resolve(
    process.cwd(),
    "../../apps/web/lib/data.generated.json",
  );
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2) + "\n");

  const latest = data[data.length - 1];
  console.log(`\n✅ ${data.length}件 → ${outPath}`);
  console.log(
    `   最新値 (${latest.year}年): 賃金=${latest.wage} CPI=${latest.cpi} 税収=${latest.tax} USD/JPY=${latest.fx}`,
  );
  console.log("\n📝 備考: 賃金・税収・為替はハードコード。");
  console.log("   CPI は e-Stat API から自動更新されます。");
}

main().catch((err) => {
  console.error("❌ 予期しないエラー:", err);
  process.exit(1);
});
