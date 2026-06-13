import { readFileSync, readdirSync, statSync } from "fs";
import { join, resolve } from "path";
import { describe, expect, it } from "vitest";
import { dataYearRangeLabel, derive, latestYear } from "./derived";
import { ADMINISTRATIONS, RAW_DATA } from "./data";

/**
 * 数値整合性のCIゲート。data.generated.json と FAQ/About/コンポーネント側の
 * 静的記述が乖離した場合にビルドを落とす。
 *
 * 編集方針「解説記事内のデータ引用は data.generated.json と一致させます
 * （差異が出ないようコンポーネントで検証）」を技術的に強制する。
 */

const REPO_ROOT = resolve(__dirname, "..");
const APP_DIR = resolve(REPO_ROOT, "app");
const COMPONENTS_DIR = resolve(REPO_ROOT, "components");

function walkFiles(dir: string, exts: string[]): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name.startsWith(".")) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) {
      out.push(...walkFiles(p, exts));
    } else if (exts.some(e => p.endsWith(e))) {
      out.push(p);
    }
  }
  return out;
}

const BANNED_LITERALS: { needle: string; reason: string; allowIn?: RegExp }[] = [
  {
    needle: "税収は+125%",
    reason: "誤記。data.generated.json では税収+34%程度（1990→最新年）",
    // about/page.tsx の訂正履歴エントリでは「誤記であった」事実として
    // 言及しているので許容（編集方針：「何をどう間違えていたかを隠さず記載する」）
    allowIn: /app\/about\/page\.tsx$/,
  },
  {
    needle: "税収は約2.3倍",
    reason: "誤記。data.generated.json では税収1.3倍程度（1990→最新年）",
    allowIn: /app\/about\/page\.tsx$/,
  },
  // 「1990〜2024年の」（データ範囲表記）は本来 latestYear に追従すべき。
  // 記事スラグや特定の歴史的年指定（例: real-wages-trend-1990-2024）は別。
];

describe("整合性: 静的テキストに禁止リテラルが含まれない", () => {
  const allFiles = [
    ...walkFiles(APP_DIR, [".tsx", ".ts"]),
    ...walkFiles(COMPONENTS_DIR, [".tsx", ".ts"]),
  ].filter(p => !p.endsWith(".test.ts") && !p.endsWith(".test.tsx"));

  for (const banned of BANNED_LITERALS) {
    it(`「${banned.needle}」を含むファイルがない (${banned.reason})`, () => {
      const hits: string[] = [];
      for (const f of allFiles) {
        if (banned.allowIn?.test(f)) continue;
        const text = readFileSync(f, "utf-8");
        if (text.includes(banned.needle)) hits.push(f.replace(REPO_ROOT + "/", ""));
      }
      expect(
        hits,
        `Banned literal "${banned.needle}" found in:\n${hits.join("\n")}`,
      ).toEqual([]);
    });
  }
});

describe("整合性: 派生統計のスナップショット", () => {
  // 静的テキストで参照される 4 指標。値が data 更新で意図せず変わったら
  // テストが落ちる（スナップショット側を更新すれば通る）= 変更を必ず気付ける。
  function rounded(stat: ReturnType<typeof derive>): Record<string, number | string> | null {
    if (!stat) return null;
    return {
      indicator: stat.indicator,
      startYear: stat.startYear,
      endYear: stat.endYear,
      startValue: stat.startValue,
      endValue: stat.endValue,
      pctChange: Number(stat.pctChange.toFixed(2)),
      ratio: Number(stat.ratio.toFixed(4)),
    };
  }

  it("派生統計のスナップショット (1990→最新年)", () => {
    const snapshot = {
      latestYear: latestYear(),
      dataYearRangeLabel: dataYearRangeLabel(),
      wage: rounded(derive("wage")),
      cpi: rounded(derive("cpi")),
      tax: rounded(derive("tax")),
      insurance: rounded(derive("insurance")),
    };
    expect(snapshot).toMatchInlineSnapshot(`
      {
        "cpi": {
          "endValue": 123.7,
          "endYear": 2025,
          "indicator": "cpi",
          "pctChange": 23.7,
          "ratio": 1.237,
          "startValue": 100,
          "startYear": 1990,
        },
        "dataYearRangeLabel": "1990〜2025",
        "insurance": {
          "endValue": 18.6,
          "endYear": 2025,
          "indicator": "insurance",
          "pctChange": 72.22,
          "ratio": 1.7222,
          "startValue": 10.8,
          "startYear": 1990,
        },
        "latestYear": 2025,
        "tax": {
          "endValue": 80.7,
          "endYear": 2025,
          "indicator": "tax",
          "pctChange": 34.28,
          "ratio": 1.3428,
          "startValue": 60.1,
          "startYear": 1990,
        },
        "wage": {
          "endValue": 97.9,
          "endYear": 2025,
          "indicator": "wage",
          "pctChange": -2.1,
          "ratio": 0.979,
          "startValue": 100,
          "startYear": 1990,
        },
      }
    `);
  });
});

describe("整合性: data.generated.json の論理整合", () => {
  it("年は 1990 から最新年まで欠損なく連番", () => {
    const years = RAW_DATA.map(d => d.year).sort((a, b) => a - b);
    expect(years[0]).toBe(1990);
    for (let i = 1; i < years.length; i++) {
      expect(years[i]).toBe(years[i - 1] + 1);
    }
  });

  it("税収・物価・社会保険料・実質賃金は全年で正の有限値", () => {
    for (const d of RAW_DATA) {
      for (const k of ["wage", "cpi", "tax", "insurance"] as const) {
        const v = d[k];
        expect(v, `${k} at ${d.year}`).toBeGreaterThan(0);
        expect(Number.isFinite(v), `${k} at ${d.year}`).toBe(true);
      }
    }
  });

  it("政権リストは最新年をカバー (高市政権が latestYear を含む)", () => {
    const last = latestYear();
    const covering = ADMINISTRATIONS.find(a => a.start <= last && last < a.end);
    expect(covering, `${last}年をカバーする政権がない`).toBeDefined();
  });
});
