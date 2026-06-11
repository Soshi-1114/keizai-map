import { rebaseTo100 } from "./utils";

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
