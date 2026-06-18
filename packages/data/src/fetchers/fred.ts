import { fetchWithTimeout } from "./utils";

/**
 * FRED (Federal Reserve Economic Data) API フェッチャー。
 * USD/JPY (DEXJPUS) と 日経平均 (NIKKEI225) の日次系列を取得する。
 *
 * 認証: 環境変数 FRED_API_KEY（apps/web/.env.local）
 * Docs: https://fred.stlouisfed.org/docs/api/fred/series_observations.html
 */

const FRED_BASE = "https://api.stlouisfed.org/fred/series/observations";

export interface FredPoint {
  /** "YYYY-MM-DD" */
  date: string;
  value: number;
}

interface FredResponse {
  observations: Array<{ date: string; value: string }>;
}

/** ISO 日付 "YYYY-MM-DD" を N 日前に巻き戻す */
function shiftDate(iso: string, deltaDays: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return d.toISOString().slice(0, 10);
}

async function fetchSeries(
  seriesId: string,
  apiKey: string,
  observationStart: string,
): Promise<FredPoint[]> {
  const url =
    `${FRED_BASE}?series_id=${encodeURIComponent(seriesId)}` +
    `&api_key=${encodeURIComponent(apiKey)}` +
    `&file_type=json` +
    `&observation_start=${observationStart}`;
  const res = await fetchWithTimeout(url, {
    headers: { "User-Agent": "Mozilla/5.0 (KeizaiMap data fetcher)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from FRED ${seriesId}`);
  const json = (await res.json()) as FredResponse;
  const points: FredPoint[] = [];
  for (const obs of json.observations ?? []) {
    // FRED は欠損日を "." で返す（祝日・週末など）
    if (!obs.value || obs.value === ".") continue;
    const v = parseFloat(obs.value);
    if (!Number.isFinite(v)) continue;
    points.push({ date: obs.date, value: v });
  }
  return points;
}

function requireApiKey(): string {
  const key = process.env.FRED_API_KEY;
  if (!key) throw new Error("FRED_API_KEY が設定されていません（apps/web/.env.local を確認）");
  return key;
}

/** 過去 daysBack 日分の日次系列を取得（FRED の欠損日は除外済み） */
export async function fetchFredDaily(seriesId: string, daysBack: number): Promise<FredPoint[]> {
  const key = requireApiKey();
  const today = new Date().toISOString().slice(0, 10);
  const start = shiftDate(today, -daysBack);
  return fetchSeries(seriesId, key, start);
}

/** 指定年（含む）以降の日次系列を取得 */
export async function fetchFredSinceYear(seriesId: string, fromYear: number): Promise<FredPoint[]> {
  const key = requireApiKey();
  return fetchSeries(seriesId, key, `${fromYear}-01-01`);
}

/** USD/JPY 年平均（fromYear 以降）を Map<year, value> で返す */
export async function fetchUsdJpyAnnual(fromYear: number): Promise<Map<number, number>> {
  console.log(`  💴 USD/JPY 年次 (FRED DEXJPUS, ${fromYear}年〜) を取得中...`);
  const daily = await fetchFredSinceYear("DEXJPUS", fromYear);
  return aggregateToAnnual(daily);
}

/** USD/JPY 日次（FRB NY 正午仲値） */
export async function fetchUsdJpyDaily(daysBack: number): Promise<FredPoint[]> {
  console.log(`  💴 USD/JPY 日次 (FRED DEXJPUS, 直近${daysBack}日) を取得中...`);
  return fetchFredDaily("DEXJPUS", daysBack);
}

/** 日経平均 日次（終値） */
export async function fetchNikkeiDaily(daysBack: number): Promise<FredPoint[]> {
  console.log(`  📈 Nikkei 225 日次 (FRED NIKKEI225, 直近${daysBack}日) を取得中...`);
  return fetchFredDaily("NIKKEI225", daysBack);
}

/** Nikkei 225 年平均（fromYear 以降、実値・円） */
export async function fetchNikkeiAnnual(fromYear: number): Promise<Map<number, number>> {
  console.log(`  📈 Nikkei 年次 (FRED NIKKEI225, ${fromYear}年〜) を取得中...`);
  const daily = await fetchFredSinceYear("NIKKEI225", fromYear);
  return aggregateToAnnual(daily);
}

/** 日次配列 → 月平均 Map<"YYYY-MM", number> */
export function aggregateToMonthly(points: FredPoint[]): Map<string, number> {
  const buckets = new Map<string, number[]>();
  for (const p of points) {
    const ym = p.date.slice(0, 7);
    if (!buckets.has(ym)) buckets.set(ym, []);
    buckets.get(ym)!.push(p.value);
  }
  const result = new Map<string, number>();
  for (const [ym, vals] of buckets) {
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    result.set(ym, Math.round(avg * 100) / 100);
  }
  return result;
}

/** 日次配列 → 年平均 Map<number, number> */
export function aggregateToAnnual(points: FredPoint[]): Map<number, number> {
  const buckets = new Map<number, number[]>();
  for (const p of points) {
    const y = parseInt(p.date.slice(0, 4), 10);
    if (!Number.isFinite(y)) continue;
    if (!buckets.has(y)) buckets.set(y, []);
    buckets.get(y)!.push(p.value);
  }
  const result = new Map<number, number>();
  for (const [y, vals] of buckets) {
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    result.set(y, Math.round(avg * 10) / 10);
  }
  return result;
}
