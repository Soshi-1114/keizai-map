/**
 * KeizaiMap データ取得スクリプト（年次・1990-2024）
 *
 * 実行: pnpm fetch (packages/data) または pnpm data:fetch (リポジトリルート)
 *
 * データソース:
 *   ✅ CPI    : e-Stat API (総務省 消費者物価指数 2020年基準)
 *   ✅ 出生数 : e-Stat API (厚労省 人口動態調査)
 *   🔄 為替    : 日銀 CSV → 失敗時 fallback
 *   🔄 税収    : 財務省 CSV → 失敗時 fallback
 *   🔄 国債残高 : 財務省 CSV → 失敗時 fallback
 *   📌 賃金・日経・住宅・社保: 公開API非対応のため fallback 固定
 *     （fallback 値は四半期ごとに人手で更新）
 */

import * as fs from "fs";
import * as path from "path";
import { fetchCPI, fetchBirths } from "./fetchers/estat";
import { fetchFXFromBOJ } from "./fetchers/boj";
import { fetchTaxFromMOF, fetchDebtFromMOF } from "./fetchers/mof";
import * as fallback from "./fetchers/fallback";
import { round1 } from "./fetchers/utils";

const TARGET_YEARS: number[] = [];
for (let y = 1990; y <= 2024; y++) TARGET_YEARS.push(y);

interface DataPoint {
  year: number;
  wage: number | null;
  cpi: number | null;
  tax: number | null;
  fx: number | null;
  nikkei: number | null;
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

async function main() {
  console.log("📊 KeizaiMap データ取得（年次・1990-2024）\n");

  // 並列フェッチ（失敗しても fallback に切り替わる）
  const [cpiMap, birthsMap, fxMap, taxMap, debtMap] = await Promise.all([
    safeFetch(fetchCPI, "CPI"),
    safeFetch(fetchBirths, "出生数"),
    safeFetch(fetchFXFromBOJ, "USD/JPY"),
    safeFetch(fetchTaxFromMOF, "税収"),
    safeFetch(fetchDebtFromMOF, "国債残高"),
  ]);

  const getCPI      = mergeWithFallback(cpiMap,    fallback.CPI_FALLBACK);
  const getBirths   = mergeWithFallback(birthsMap, fallback.BIRTHS_FALLBACK);
  const getFX       = mergeWithFallback(fxMap,     fallback.FX_FALLBACK);
  const getTax      = mergeWithFallback(taxMap,    fallback.TAX_FALLBACK);
  const getDebt     = mergeWithFallback(debtMap,   fallback.DEBT_FALLBACK);

  const data: DataPoint[] = TARGET_YEARS.map((year) => ({
    year,
    wage:      round1(fallback.WAGE_FALLBACK[year]),
    cpi:       getCPI(year),
    tax:       getTax(year),
    fx:        getFX(year),
    nikkei:    round1(fallback.NIKKEI_FALLBACK[year]),
    housing:   round1(fallback.HOUSING_FALLBACK[year]),
    debt:      getDebt(year),
    births:    getBirths(year),
    insurance: round1(fallback.INSURANCE_FALLBACK[year]),
  })).filter((d) => d.cpi !== null);

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
  console.log("\n📝 自動更新ソース: e-Stat (CPI/出生数) / BOJ (FX) / MOF (税収/国債)");
  console.log("   API 失敗時は fallback.ts の確定値を使用します。");
}

main().catch((err) => {
  console.error("❌ 予期しないエラー:", err);
  process.exit(1);
});
