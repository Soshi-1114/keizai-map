import { describe, it, expect } from "vitest";
import { generateNarrative, narrativeToText, parseRange, parseIndicators, parseCategories } from "./utils";
import type { DataPoint } from "./types";

const point = (year: number, overrides: Partial<DataPoint> = {}): DataPoint => ({
  year, wage: 100, cpi: 100, tax: 60, fx: 145, ...overrides,
});

describe("generateNarrative — duration bands", () => {
  it("short band (2-5 years) uses 短期 prefix", () => {
    const n = generateNarrative([point(2020), point(2024)]);
    expect(narrativeToText(n)).toMatch(/短期/);
  });

  it("medium band (6-15 years) uses 年間で prefix without 短期/長期 keywords", () => {
    const text = narrativeToText(generateNarrative([point(2010), point(2020)]));
    expect(text).toMatch(/10年間（2010→2020）で/);
    expect(text).not.toMatch(/短期/);
    expect(text).not.toMatch(/長期/);
  });

  it("long band (>15 years) appends 年率 line", () => {
    const n = generateNarrative([
      point(1990, { cpi: 100 }),
      point(2024, { cpi: 130 }),
    ]);
    const text = narrativeToText(n);
    expect(text).toMatch(/長期/);
    expect(text).toMatch(/年率/);
    // 1990→2024 (34年) で cpi 100→130 = 約 0.78%/年
    expect(text).toMatch(/年率 約0\.\d+%/);
  });
});

describe("generateNarrative — tax & fx branches", () => {
  it("emits tax sentence when |taxPct| exceeds threshold", () => {
    const n = generateNarrative([
      point(2010, { tax: 40 }),
      point(2024, { tax: 70 }), // +75%
    ]);
    expect(narrativeToText(n)).toMatch(/税収は\d+%増加/);
  });

  it("does not emit tax sentence when within threshold (medium band)", () => {
    const n = generateNarrative([
      point(2010, { tax: 60 }),
      point(2020, { tax: 65 }), // +8.3% < medium threshold 15
    ]);
    expect(narrativeToText(n)).not.toMatch(/税収は/);
  });

  it("円高 phrase appears when fx drops past threshold", () => {
    const n = generateNarrative([
      point(2010, { fx: 150 }),
      point(2024, { fx: 100 }), // -33%
    ]);
    expect(narrativeToText(n)).toMatch(/円高/);
  });
});

describe("generateNarrative — insight branches", () => {
  it("insight #2: wage flat + tax rising → 個人の実質賃金 phrase", () => {
    const n = generateNarrative([
      point(2010, { wage: 100, cpi: 100, tax: 40 }),
      point(2020, { wage: 101, cpi: 101, tax: 65 }), // wage flat, tax +62%
    ]);
    expect(n.insight).toMatch(/個人の実質賃金/);
  });

  it("insight #3: 円安 + CPI rise → 円安と物価上昇 phrase", () => {
    const n = generateNarrative([
      point(2010, { wage: 102, cpi: 100, fx: 90, tax: 60 }),
      point(2020, { wage: 103, cpi: 115, fx: 150, tax: 60 }), // wage stable→上昇微小、cpi+15%、fx +66%
    ]);
    expect(n.insight).toMatch(/円安と物価上昇/);
  });

  it("insight #4: wage up + cpi stable → 生活水準は改善 phrase", () => {
    const n = generateNarrative([
      point(2010, { wage: 100, cpi: 100 }),
      point(2020, { wage: 115, cpi: 101 }),
    ]);
    expect(n.insight).toMatch(/生活水準は改善/);
  });

  it("insight returns null when no priority condition matches", () => {
    // wage 上昇 + cpi 上昇 (両方 threshold 超え) は どの分岐にも該当しない
    const n = generateNarrative([
      point(2010, { wage: 100, cpi: 100, tax: 60, fx: 145 }),
      point(2020, { wage: 115, cpi: 115, tax: 60, fx: 145 }),
    ]);
    expect(n.insight).toBeNull();
  });
});

describe("narrativeToText", () => {
  it("joins paragraphs with single half-width space", () => {
    const text = narrativeToText({ paragraphs: ["a。", "b。"], insight: "c。" });
    expect(text).toBe("a。 b。 c。");
  });

  it("omits insight separator when insight is null", () => {
    expect(narrativeToText({ paragraphs: ["a。"], insight: null })).toBe("a。");
  });
});

describe("parseRange — boundary cases", () => {
  it("rejects equal start/end (start must be < end)", () => {
    expect(parseRange("2010,2010")).toEqual([1990, 2025]);
  });

  it("accepts the full data range exactly", () => {
    expect(parseRange("1990,2025")).toEqual([1990, 2025]);
  });

  it("rejects non-numeric input", () => {
    expect(parseRange("abc,def")).toEqual([1990, 2025]);
    expect(parseRange("2010,")).toEqual([1990, 2025]);
  });
});

describe("parseIndicators — allKeys filter", () => {
  it("respects allKeys argument (filters out keys not in allKeys)", () => {
    // wage は allKeys に含まれないので除外される
    expect(parseIndicators("wage,cpi", ["cpi", "tax"])).toEqual(["cpi"]);
  });

  it("falls back to DEFAULT_INDICATORS intersected with allKeys when input invalid", () => {
    // allKeys=["tax"] のみ → DEFAULT=["wage","cpi"] ∩ ["tax"] = [] になる
    expect(parseIndicators("garbage", ["tax"])).toEqual([]);
  });
});

describe("parseCategories — order preservation", () => {
  it("preserves input order of valid categories", () => {
    expect(parseCategories("経済政策,税制")).toEqual(["経済政策", "税制"]);
  });

  it("returns canonical order when input null", () => {
    expect(parseCategories(null)).toEqual(["税制", "経済", "経済政策"]);
  });
});
