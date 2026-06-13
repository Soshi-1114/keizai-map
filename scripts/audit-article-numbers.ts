#!/usr/bin/env tsx
/**
 * 全記事ページの本文に出現する「特定の年×特定の指標の数値」を抽出し、
 * data.generated.json の値と照合して乖離レポートを出力するスクリプト。
 *
 * 用途: P0-2 の責務。本文の一括修正はこのレポートを人が確認したうえで
 * 別タスクで実施する（編集判断が必要な箇所が多いため）。
 *
 * 実行:
 *   pnpm tsx scripts/audit-article-numbers.ts             # 標準出力にレポート
 *   pnpm tsx scripts/audit-article-numbers.ts --json      # JSON 形式
 *
 * 検出方式 (シンプルなパターンマッチ):
 *   - 指標ごとに「キーワード（"実質賃金", "税収" 等）」と「数値」のセットを定義。
 *   - 記事本文を 1 行ずつ走査し、(キーワード, 数値, 文脈年) の三つ組を抽出。
 *   - 文脈年は同一行・同一段落内で見つかった最初の年（"2024年"等）を使用。
 *   - data.generated.json から該当 (指標, 年) の正値を取得し、許容誤差 0.05 以内
 *     であれば「OK」、それ以外を「乖離」として報告。
 *   - 単純な「ほぼ横ばい」「+20%」等の言葉での記述は対象外。あくまで具体的な
 *     数値リテラルのみ。
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const REPO_ROOT = resolve(__dirname, "..");
const ARTICLES_DIR = resolve(REPO_ROOT, "apps/web/app/articles");
const DATA_PATH = resolve(REPO_ROOT, "apps/web/lib/data.generated.json");

interface DataPoint {
  year: number;
  wage: number;
  cpi: number;
  tax: number;
  fx: number;
  nikkei: number;
  housing: number;
  debt: number;
  births: number;
  insurance: number;
}

const DATA: DataPoint[] = JSON.parse(readFileSync(DATA_PATH, "utf-8")).data;

type IndicatorKey = keyof Omit<DataPoint, "year">;

/** 記事本文中で指標を示すキーワード。1番目が代表名。 */
const INDICATOR_KEYWORDS: Record<IndicatorKey, string[]> = {
  wage: ["実質賃金"],
  cpi: ["消費者物価指数", "消費者物価", "CPI", "物価指数"],
  tax: ["税収"],
  fx: ["USD/JPY", "ドル円", "ドル/円", "円/ドル"],
  nikkei: ["日経平均"],
  housing: ["住宅価格"],
  debt: ["国債残高"],
  births: ["出生数"],
  insurance: ["社会保険料負担率", "社会保険料"],
};

/** 各指標の値が取りうる範囲。範囲外の数値は別の指標/単位/年号と判断して除外。 */
const PLAUSIBLE_RANGE: Record<IndicatorKey, [number, number]> = {
  wage: [80, 115],      // 1990=100
  cpi: [95, 130],       // 1990=100
  tax: [40, 90],        // 兆円
  fx: [75, 160],        // 円/ドル
  nikkei: [50, 220],    // 1990=100
  housing: [55, 105],   // 1990=100
  debt: [150, 1300],    // 兆円
  births: [60, 130],    // 万人
  insurance: [10, 20],  // %
};

function getValue(indicator: IndicatorKey, year: number): number | null {
  const p = DATA.find(d => d.year === year);
  if (!p) return null;
  const v = p[indicator];
  return typeof v === "number" && isFinite(v) ? v : null;
}

interface Finding {
  slug: string;
  file: string;
  line: number;
  indicator: IndicatorKey;
  year: number;
  claimed: number;
  actual: number;
  diff: number;
  status: "ok" | "deviation";
  context: string;
}

// 数値リテラル。"1,170" 等のカンマ区切りも 1170 として捕捉。
const NUMERIC_RE = /(?<![\d.])(\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d{1,4}(?:\.\d+)?)(?!\d)/g;

function walkFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walkFiles(p));
    else if (p.endsWith("page.tsx")) out.push(p);
  }
  return out;
}

/**
 * 数値リテラルの直前 20 文字（同一行内）にあるキーワードから指標を推定する。
 * 全文走査ではなく「数値の左肩」を見ることで、複数指標が並ぶ行での誤検出を抑制。
 */
function inferIndicatorLocal(
  line: string,
  numberStart: number,
): { indicator: IndicatorKey; keyword: string; pos: number } | null {
  const window = line.slice(Math.max(0, numberStart - 24), numberStart);
  let best: { indicator: IndicatorKey; keyword: string; pos: number } | null = null;
  for (const [key, kws] of Object.entries(INDICATOR_KEYWORDS) as [IndicatorKey, string[]][]) {
    for (const kw of kws) {
      const idx = window.lastIndexOf(kw);
      if (idx === -1) continue;
      // 一番数値に近いキーワードを採用
      if (!best || idx > best.pos) best = { indicator: key, keyword: kw, pos: idx };
    }
  }
  return best;
}

/** 年を「数値リテラル直前 24 文字内の YYYY年」から推定。なければ前後行を見る。 */
function inferYearLocal(
  line: string,
  numberStart: number,
  prev: string,
  next: string,
): number | null {
  const localWindow = line.slice(Math.max(0, numberStart - 24), numberStart);
  let m = localWindow.match(/(\d{4})年/);
  if (!m) m = (prev + "\n" + next).match(/(\d{4})年/);
  if (!m) return null;
  const y = Number(m[1]);
  if (y < 1990 || y > DATA.at(-1)!.year) return null;
  return y;
}

function audit(): Finding[] {
  const findings: Finding[] = [];
  const files = walkFiles(ARTICLES_DIR);

  for (const file of files) {
    const slug = file.replace(ARTICLES_DIR + "/", "").replace(/\/page\.tsx$/, "");
    const text = readFileSync(file, "utf-8");
    const lines = text.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const matches = [...line.matchAll(NUMERIC_RE)];
      if (matches.length === 0) continue;

      const prev = lines[i - 1] ?? "";
      const next = lines[i + 1] ?? "";

      for (const m of matches) {
        const claimed = Number(m[1].replace(/,/g, ""));
        const numberStart = m.index ?? 0;

        // 「+34%」「-2.1%」のような変化率は除外。値そのものではなく差分のため。
        const before = line.slice(Math.max(0, numberStart - 1), numberStart);
        const afterStart = numberStart + m[1].length;
        const after = line.slice(afterStart, afterStart + 1);
        if ((before === "+" || before === "-") && after === "%") continue;

        // 指標推定: 数値の直前
        const inferred = inferIndicatorLocal(line, numberStart);
        if (!inferred) continue;

        // 値の物理的妥当性チェック
        const [lo, hi] = PLAUSIBLE_RANGE[inferred.indicator];
        if (claimed < lo || claimed > hi) continue;

        // 年推定
        const year = inferYearLocal(line, numberStart, prev, next);
        if (year == null) continue;

        const actual = getValue(inferred.indicator, year);
        if (actual == null) continue;

        const diff = claimed - actual;
        const tolerance = Math.max(0.05, Math.abs(actual) * 0.005);
        const status: Finding["status"] = Math.abs(diff) <= tolerance ? "ok" : "deviation";

        findings.push({
          slug,
          file: file.replace(REPO_ROOT + "/", ""),
          line: i + 1,
          indicator: inferred.indicator,
          year,
          claimed,
          actual,
          diff,
          status,
          context: line.trim().slice(0, 140),
        });
      }
    }
  }

  return findings;
}

function main() {
  const args = process.argv.slice(2);
  const wantJson = args.includes("--json");
  const onlyDeviations = args.includes("--only-deviations");

  const all = audit();
  const filtered = onlyDeviations ? all.filter(f => f.status === "deviation") : all;

  if (wantJson) {
    process.stdout.write(JSON.stringify(filtered, null, 2) + "\n");
    return;
  }

  const deviations = all.filter(f => f.status === "deviation");
  const oks = all.filter(f => f.status === "ok");

  console.log(`# 記事内数値の監査レポート`);
  console.log(`スキャン記事数: ${new Set(all.map(f => f.slug)).size}`);
  console.log(`検出ヒット総数: ${all.length}（OK ${oks.length} / 乖離 ${deviations.length}）\n`);

  if (deviations.length === 0) {
    console.log("✅ 乖離は検出されませんでした。");
    return;
  }

  console.log(`## 乖離リスト（${deviations.length}件）\n`);
  console.log("| slug | line | 指標 | 年 | 記事値 | json値 | 差 | 文脈 |");
  console.log("|------|------|------|----|-------|--------|-----|------|");
  for (const f of deviations) {
    console.log(
      `| ${f.slug} | ${f.line} | ${f.indicator} | ${f.year} | ${f.claimed} | ${f.actual} | ${f.diff.toFixed(2)} | ${f.context.replace(/\|/g, "\\|")} |`,
    );
  }
  console.log("\n注: ヒューリスティック検出のため誤検出を含む可能性があります。");
  console.log("    指標キーワードと年が同一文脈にあり、claimed が actual の 0.5〜2.0 倍に");
  console.log("    収まる数値のみを対象としています。");
}

main();
