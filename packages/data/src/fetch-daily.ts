/**
 * KeizaiMap 日次データ取得スクリプト（直近90日）
 *
 * 実行: pnpm fetch:daily (packages/data) または pnpm data:fetch:daily (リポジトリルート)
 * 環境変数: FRED_API_KEY（apps/web/.env.local から読む）
 *
 * 取得指標:
 *   ✅ USD/JPY  : FRED API (DEXJPUS, FRB NY 正午仲値)
 *   ✅ Nikkei   : FRED API (NIKKEI225, 終値)
 *
 * 出力: apps/web/lib/data.daily.generated.json
 *
 * 週次 cron で再生成する想定。MarketCard の 1D/1W/1M レンジで参照される。
 */

import * as fs from "fs";
import * as path from "path";
import { fetchUsdJpyDaily, fetchNikkeiDaily, type FredPoint } from "./fetchers/fred";

const OUT_PATH = path.resolve(__dirname, "../../../apps/web/lib/data.daily.generated.json");
// 直近 N 日を保存（パネルの 1D / 1W / 1M レンジで使用）
const DAYS_TO_KEEP = 90;
// FRED から取り直す範囲（祝日・週末欠損があるので余裕を持って広めに引く）
const DAYS_TO_FETCH = 120;

interface DailyPoint {
  /** "YYYY-MM-DD" */
  date: string;
  value: number;
}

interface DailySeriesPayload {
  /** "YYYY-MM-DD"（生成日） */
  generatedAt: string;
  /** USD/JPY 日次 */
  fx: DailyPoint[];
  /** Nikkei 225 日次（終値） */
  nikkei: DailyPoint[];
}

function sortDate(a: DailyPoint, b: DailyPoint): number {
  return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
}

function tailRecent(items: FredPoint[], n: number): DailyPoint[] {
  const sorted = [...items].sort(sortDate);
  return sorted.slice(-n).map(p => ({ date: p.date, value: p.value }));
}

async function loadEnvLocal(): Promise<void> {
  const envPath = path.resolve(__dirname, "../../../apps/web/.env.local");
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, "utf-8");
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.+?)\s*$/);
    if (!m) continue;
    const [, key, value] = m;
    if (process.env[key]) continue;
    process.env[key] = value.replace(/^["']|["']$/g, "");
  }
}

async function safeFetch(
  fn: () => Promise<FredPoint[]>,
  label: string,
): Promise<FredPoint[]> {
  try {
    const result = await fn();
    if (result.length === 0) {
      console.warn(`  ⚠️  ${label}: 0件`);
      return [];
    }
    console.log(`  ✅ ${label}: ${result.length}件取得`);
    return result;
  } catch (err) {
    console.warn(`  ⚠️  ${label} 取得失敗: ${(err as Error).message}`);
    return [];
  }
}

async function main(): Promise<void> {
  console.log("📅 KeizaiMap 日次データ取得（直近90日）\n");

  await loadEnvLocal();

  if (!process.env.FRED_API_KEY) {
    console.error("❌ FRED_API_KEY が設定されていません（apps/web/.env.local を確認）");
    process.exit(1);
  }

  const [fxAll, nikkeiAll] = await Promise.all([
    safeFetch(() => fetchUsdJpyDaily(DAYS_TO_FETCH), "USD/JPY"),
    safeFetch(() => fetchNikkeiDaily(DAYS_TO_FETCH), "Nikkei 225"),
  ]);

  const fx = tailRecent(fxAll, DAYS_TO_KEEP);
  const nikkei = tailRecent(nikkeiAll, DAYS_TO_KEEP);

  if (fx.length === 0 && nikkei.length === 0) {
    console.error("\n❌ 日次データが0件です。書き出しを中止します。");
    process.exit(1);
  }

  const generatedAt = new Date().toISOString().slice(0, 10);
  const payload: DailySeriesPayload = { generatedAt, fx, nikkei };

  fs.writeFileSync(OUT_PATH, JSON.stringify(payload, null, 2) + "\n", "utf-8");
  console.log(`\n💾 書き出し: ${OUT_PATH}`);
  console.log(`   FX:     ${fx[0]?.date} 〜 ${fx[fx.length - 1]?.date} (${fx.length}件)`);
  console.log(`   Nikkei: ${nikkei[0]?.date} 〜 ${nikkei[nikkei.length - 1]?.date} (${nikkei.length}件)`);
}

main().catch((err) => {
  console.error("❌ 致命的エラー:", err);
  process.exit(1);
});
