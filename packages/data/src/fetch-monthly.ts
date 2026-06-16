/**
 * KeizaiMap 月次データ取得スクリプト（直近24か月）
 *
 * 実行: pnpm fetch:monthly (packages/data) または pnpm data:fetch:monthly (リポジトリルート)
 * 環境変数: ESTAT_API_KEY（apps/web/.env.local から読む）
 *
 * 取得指標（v1：月次粒度）:
 *   ✅ CPI    : e-Stat API (総務省 消費者物価指数 2020年基準・原数値・@tab=1)
 *
 * v2 候補:
 *   ⏳ 出生数 : e-Stat の人口動態調査は年次テーブルのみ。月報用 statsDataId
 *               （人口動態統計月報・概数）は別途調査が必要
 *   ⏳ 為替    : BOJ の月次 CSV はセッション必要。FRED の DEXJPUS 等の代替源
 *               を検討
 *
 * 出力: apps/web/lib/data.monthly.generated.json
 */

import * as fs from "fs";
import * as path from "path";
import { fetchCPIMonthly } from "./fetchers/estat";

const OUT_PATH = path.resolve(__dirname, "../../../apps/web/lib/data.monthly.generated.json");
// 過去 N か月を切り出して保存（パネルの「直近の動き」用に過剰データを抱えない）
const MONTHS_TO_KEEP = 24;

interface MonthlyPoint {
  ym: string; // "YYYY-MM"
  value: number;
}

interface MonthlySeriesPayload {
  generatedAt: string; // "YYYY-MM"
  /** CPI 月次（2020年基準の原数値・原指数）。前月比/前年同月比はパネル側で derive */
  cpi: MonthlyPoint[];
}

function sortYm(a: MonthlyPoint, b: MonthlyPoint): number {
  return a.ym < b.ym ? -1 : a.ym > b.ym ? 1 : 0;
}

function tailRecent<T extends MonthlyPoint>(items: T[], n: number): T[] {
  const sorted = [...items].sort(sortYm);
  return sorted.slice(-n);
}

async function loadEnvLocal(): Promise<void> {
  // apps/web/.env.local から ESTAT_API_KEY 等を拾う（dotenv 依存を増やさない最小実装）
  const envPath = path.resolve(__dirname, "../../../apps/web/.env.local");
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, "utf-8");
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.+?)\s*$/);
    if (!m) continue;
    const [, key, value] = m;
    if (process.env[key]) continue; // 既存値を上書きしない
    process.env[key] = value.replace(/^["']|["']$/g, "");
  }
}

async function main(): Promise<void> {
  console.log("📅 KeizaiMap 月次データ取得（直近24か月）\n");

  await loadEnvLocal();

  if (!process.env.ESTAT_API_KEY) {
    console.error("❌ ESTAT_API_KEY が設定されていません（apps/web/.env.local を確認）");
    process.exit(1);
  }

  const cpiMap = await fetchCPIMonthly().catch((e: Error) => {
    console.warn(`  ⚠️  CPI 月次取得失敗: ${e.message}`);
    return new Map<string, number>();
  });

  const cpiAll: MonthlyPoint[] = Array.from(cpiMap, ([ym, value]) => ({ ym, value }));
  console.log(`\n  ✅ CPI: ${cpiAll.length}件 → 直近${MONTHS_TO_KEEP}か月を保存`);

  const now = new Date();
  const generatedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const payload: MonthlySeriesPayload = {
    generatedAt,
    cpi: tailRecent(cpiAll, MONTHS_TO_KEEP),
  };

  if (payload.cpi.length === 0) {
    console.error("\n❌ CPI 月次データが0件です。書き出しを中止します。");
    process.exit(1);
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(payload, null, 2) + "\n", "utf-8");
  console.log(`\n💾 書き出し: ${OUT_PATH}`);
  console.log(`   CPI: ${payload.cpi[0]?.ym} 〜 ${payload.cpi[payload.cpi.length - 1]?.ym}`);
}

main().catch((err) => {
  console.error("❌ 致命的エラー:", err);
  process.exit(1);
});
