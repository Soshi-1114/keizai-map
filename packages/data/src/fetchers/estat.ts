import { fetchWithTimeout, rebaseTo100 } from "./utils";

const BASE_URL = "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData";

function getAppId(): string {
  const id = process.env.ESTAT_API_KEY;
  if (!id) throw new Error("ESTAT_API_KEY が設定されていません");
  return id;
}

async function estatFetch(params: Record<string, string>): Promise<unknown> {
  const url = new URL(BASE_URL);
  url.searchParams.set("appId", getAppId());
  url.searchParams.set("lang", "J");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetchWithTimeout(url.toString());
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
  const vals = (json as any)?.GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF?.VALUE;
  if (!vals) return [];
  return Array.isArray(vals) ? vals : [vals];
}

function yearFromTime(t: string): number { return parseInt(t.slice(0, 4), 10); }

function annualAverage(values: Array<Record<string, string>>): Map<number, number> {
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
  for (const [y, arr] of byYear) result.set(y, arr.reduce((a, b) => a + b) / arr.length);
  return result;
}

/** CPI: 総務省 消費者物価指数 (2020年基準) → 月次年平均 → 1990=100 */
export async function fetchCPI(): Promise<Map<number, number>> {
  console.log("  📊 CPI (e-Stat) を取得中...");
  const json = await estatFetch({ statsDataId: "0003427113", cdArea: "00000", cdCat01: "0001" });
  const annual = annualAverage(extractValues(json));
  return rebaseTo100(annual, 1990);
}

/** 出生数: 厚労省 人口動態調査 → 万人換算 */
export async function fetchBirths(): Promise<Map<number, number>> {
  console.log("  📊 出生数 (e-Stat) を取得中...");
  const json = await estatFetch({ statsDataId: "0003411601", cdArea: "00000", cdCat01: "01" });
  const annual = annualAverage(extractValues(json));
  const inMan = new Map<number, number>();
  for (const [y, v] of annual) inMan.set(y, Math.round((v / 10000) * 10) / 10);
  return inMan;
}

// ─── 月次取得（年集約せずそのまま返す）────────────────────────────

/**
 * e-Stat の @time フィールドから "YYYY-MM" を抽出。
 * 観測された形式: "YYYY00MMMM"（例: "2026000404" → 2026-04, "1971000101" → 1971-01）
 * 月次データは末尾2文字が "01"〜"12"。年次レコードは "0000" 等になり弾く。
 */
function yearMonthFromTime(t: string): string | null {
  if (!t || t.length < 6) return null;
  const year = t.slice(0, 4);
  if (!/^\d{4}$/.test(year)) return null;
  const month = t.slice(-2);
  if (!/^(0[1-9]|1[0-2])$/.test(month)) return null;
  return `${year}-${month}`;
}

/**
 * 月次の値を YYYY-MM キーの Map に変換。
 * @tab="1" の原指数のみ採用し、前年同月比（@tab="3"）等は除外。
 */
function monthlyMap(values: Array<Record<string, string>>, tab = "1"): Map<string, number> {
  const result = new Map<string, number>();
  for (const v of values) {
    if (v["@tab"] != null && v["@tab"] !== tab) continue;
    const raw = v.$;
    if (!raw || raw === "-" || raw === "…" || raw === "x") continue;
    const num = parseFloat(raw);
    if (isNaN(num)) continue;
    const ym = yearMonthFromTime(v["@time"] ?? "");
    if (!ym) continue;
    if (parseInt(ym.slice(0, 4), 10) < 1985) continue;
    result.set(ym, num);
  }
  return result;
}

/** CPI 月次（総合指数 2020=100、原数値） */
export async function fetchCPIMonthly(): Promise<Map<string, number>> {
  console.log("  📊 CPI 月次 (e-Stat) を取得中...");
  const json = await estatFetch({
    statsDataId: "0003427113",
    cdArea: "00000",
    cdCat01: "0001",
    cdTab: "1", // 1=原指数
  });
  return monthlyMap(extractValues(json), "1");
}

/** 出生数 月次（人 → 千人へ。月次は値が小さいので「千人」単位の方が読みやすい） */
export async function fetchBirthsMonthly(): Promise<Map<string, number>> {
  console.log("  📊 出生数 月次 (e-Stat) を取得中...");
  const json = await estatFetch({ statsDataId: "0003411601", cdArea: "00000", cdCat01: "01" });
  const raw = monthlyMap(extractValues(json));
  const inSenNin = new Map<string, number>();
  for (const [ym, v] of raw) inSenNin.set(ym, Math.round(v / 100) / 10);
  return inSenNin;
}
