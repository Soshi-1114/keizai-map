/**
 * KeizaiMap データ取得スクリプト（年次・1990-2025）
 *
 * 実行: pnpm fetch (packages/data) または pnpm data:fetch (リポジトリルート)
 *
 * データソース:
 *   ✅ CPI    : e-Stat API (総務省 消費者物価指数 2020年基準)
 *   ✅ 出生数 : e-Stat API (厚労省 人口動態調査)
 *   ✅ 為替    : FRED API (DEXJPUS 日次→年平均) → 失敗時 fallback
 *   🔄 税収    : 財務省 CSV → 失敗時 fallback
 *   🔄 国債残高 : 財務省 CSV → 失敗時 fallback
 *   📌 賃金・日経・住宅・社保: 公開API非対応のため fallback 固定
 *     （fallback 値は四半期ごとに人手で更新）
 *
 * 注: 旧 BOJ CSV フェッチャーは公開 URL が 404 を返すため FRED に置換。
 *     コードは packages/data/src/fetchers/boj.ts に残置（参考用）。
 */

import * as fs from "fs";
import * as path from "path";
import { fetchCPI, fetchBirths } from "./fetchers/estat";
import { fetchUsdJpyAnnual, fetchNikkeiAnnual } from "./fetchers/fred";
import { fetchTaxFromMOF, fetchDebtFromMOF } from "./fetchers/mof";
import * as fallback from "./fetchers/fallback";
import { round1 } from "./fetchers/utils";

const FX_FROM_YEAR = 1990;

const TARGET_YEARS: number[] = [];
for (let y = 1990; y <= 2025; y++) TARGET_YEARS.push(y);

interface DataPoint {
  year: number;
  wage: number | null;
  cpi: number | null;
  tax: number | null;
  fx: number | null;
  nikkei: number | null;
  /** 日経平均 年平均（実値・円）。MarketCard の Max レンジで使用 */
  nikkeiYen: number | null;
  housing: number | null;
  debt: number | null;
  births: number | null;
  insurance: number | null;
}

/** Map 結果と fallback を年次でマージ */
function mergeWithFallback(fetched: Map<number, number>, fb: Record<number, number>): (year: number) => number | null {
  return (year: number) => {
    const v = fetched.get(year);
    if (v != null && !isNaN(v)) return round1(v);
    const f = fb[year];
    return f != null ? round1(f) : null;
  };
}

async function safeFetch<T>(fn: () => Promise<Map<number, number>>, label: string): Promise<Map<number, number>> {
  try {
    const result = await fn();
    if (result.size === 0) {
      console.warn(`  ⚠️  ${label}: 0件、fallback を使用します`);
      return new Map();
    }
    console.log(`  ✅ ${label}: ${result.size}件取得`);
    return result;
  } catch (err) {
    console.warn(`  ⚠️  ${label} 取得失敗、fallback を使用: ${(err as Error).message}`);
    return new Map();
  }
}

async function loadEnvLocal(): Promise<void> {
  const envPath = path.resolve(process.cwd(), "../../apps/web/.env.local");
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

async function main() {
  console.log("📊 KeizaiMap データ取得（年次・1990-2025）\n");

  await loadEnvLocal();

  // FRED 取得には API キーが必要。未設定なら fallback / null に切り替わる。
  const fxFetcher = process.env.FRED_API_KEY
    ? () => fetchUsdJpyAnnual(FX_FROM_YEAR)
    : async () => {
        console.warn("  ⚠️  FRED_API_KEY 未設定: USD/JPY は fallback を使用");
        return new Map<number, number>();
      };
  const nikkeiYenFetcher = process.env.FRED_API_KEY
    ? () => fetchNikkeiAnnual(FX_FROM_YEAR)
    : async () => {
        console.warn("  ⚠️  FRED_API_KEY 未設定: Nikkei 実値はスキップ");
        return new Map<number, number>();
      };

  // 並列フェッチ（失敗しても fallback に切り替わる）
  const [cpiMap, birthsMap, fxMap, taxMap, debtMap, nikkeiYenMap] = await Promise.all([
    safeFetch(fetchCPI, "CPI"),
    safeFetch(fetchBirths, "出生数"),
    safeFetch(fxFetcher, "USD/JPY"),
    safeFetch(fetchTaxFromMOF, "税収"),
    safeFetch(fetchDebtFromMOF, "国債残高"),
    safeFetch(nikkeiYenFetcher, "Nikkei 225 (実値)"),
  ]);

  const getCPI      = mergeWithFallback(cpiMap,    fallback.CPI_FALLBACK);
  const getBirths   = mergeWithFallback(birthsMap, fallback.BIRTHS_FALLBACK);
  const getFX       = mergeWithFallback(fxMap,     fallback.FX_FALLBACK);
  const getTax      = mergeWithFallback(taxMap,    fallback.TAX_FALLBACK);
  const getDebt     = mergeWithFallback(debtMap,   fallback.DEBT_FALLBACK);

  const data: DataPoint[] = TARGET_YEARS.map((year) => {
    const ny = nikkeiYenMap.get(year);
    return {
      year,
      wage:      round1(fallback.WAGE_FALLBACK[year]),
      cpi:       getCPI(year),
      tax:       getTax(year),
      fx:        getFX(year),
      nikkei:    round1(fallback.NIKKEI_FALLBACK[year]),
      nikkeiYen: ny != null && !isNaN(ny) ? round1(ny) : null,
      housing:   round1(fallback.HOUSING_FALLBACK[year]),
      debt:      getDebt(year),
      births:    getBirths(year),
      insurance: round1(fallback.INSURANCE_FALLBACK[year]),
    };
  }).filter((d) => d.cpi !== null);

  if (data.length === 0) {
    console.error("❌ 有効なデータが0件です");
    process.exit(1);
  }

  const outPath = path.resolve(process.cwd(), "../../apps/web/lib/data.generated.json");
  const output = {
    generatedAt: new Date().toISOString().slice(0, 7),
    data,
  };
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2) + "\n");

  const latest = data[data.length - 1];
  console.log(`\n✅ ${data.length}件 → ${outPath}`);
  console.log(`   最新値 (${latest.year}年): wage=${latest.wage} cpi=${latest.cpi} tax=${latest.tax} fx=${latest.fx}`);
  console.log(`                            nikkei=${latest.nikkei} housing=${latest.housing} debt=${latest.debt}`);
  console.log(`                            births=${latest.births} insurance=${latest.insurance}`);
  console.log("\n📝 自動更新ソース: e-Stat (CPI/出生数) / FRED (FX) / MOF (税収/国債)");
  console.log("   API 失敗時は fallback.ts の確定値を使用します。");
}

main().catch((err) => {
  console.error("❌ 予期しないエラー:", err);
  process.exit(1);
});
