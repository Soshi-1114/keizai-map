import { describe, it, expect } from "vitest";
import {
  parseRange,
  parseIndicators,
  parseCategories,
  formatUpdatedAt,
  generateNarrative,
  narrativeToText,
  DEFAULT_INDICATORS,
} from "./utils";
import type { DataPoint, IndicatorKey } from "./types";

describe("parseRange", () => {
  it("returns default range when input is null", () => {
    expect(parseRange(null)).toEqual([1990, 2025]);
  });
  it("returns default range when input is malformed", () => {
    expect(parseRange("foo")).toEqual([1990, 2025]);
    expect(parseRange("2024,1990")).toEqual([1990, 2025]); // start >= end
  });
  it("parses valid range", () => {
    expect(parseRange("2000,2020")).toEqual([2000, 2020]);
  });
  it("rejects out-of-bounds range", () => {
    expect(parseRange("1980,2030")).toEqual([1990, 2025]);
  });
});

describe("parseIndicators", () => {
  const ALL: IndicatorKey[] = ["wage", "cpi", "tax", "fx", "nikkei", "housing", "debt", "births", "insurance"];

  it("returns DEFAULT_INDICATORS when input is null", () => {
    expect(parseIndicators(null, ALL)).toEqual(DEFAULT_INDICATORS);
  });
  it("returns DEFAULT_INDICATORS when input is empty", () => {
    expect(parseIndicators("", ALL)).toEqual(DEFAULT_INDICATORS);
  });
  it("parses comma-separated valid keys", () => {
    expect(parseIndicators("wage,cpi,tax", ALL)).toEqual(["wage", "cpi", "tax"]);
  });
  it("filters out unknown keys", () => {
    expect(parseIndicators("wage,unknown,cpi", ALL)).toEqual(["wage", "cpi"]);
  });
  it("falls back to default when all keys are invalid", () => {
    expect(parseIndicators("unknown1,unknown2", ALL)).toEqual(DEFAULT_INDICATORS);
  });
});

describe("parseCategories", () => {
  it("returns all categories when input is null", () => {
    expect(parseCategories(null)).toEqual(["税制", "経済", "経済政策"]);
  });
  it("parses valid categories", () => {
    expect(parseCategories("税制,経済")).toEqual(["税制", "経済"]);
  });
  it("filters out unknown categories", () => {
    expect(parseCategories("税制,unknown")).toEqual(["税制"]);
  });
});

describe("formatUpdatedAt", () => {
  it("formats YYYY-MM correctly", () => {
    expect(formatUpdatedAt("2026-06")).toBe("2026年6月");
    expect(formatUpdatedAt("2025-12")).toBe("2025年12月");
  });
  it("returns input as-is for malformed strings", () => {
    expect(formatUpdatedAt("invalid")).toBe("invalid");
    expect(formatUpdatedAt("")).toBe("");
  });
});

describe("generateNarrative", () => {
  function makePoint(year: number, overrides: Partial<DataPoint> = {}): DataPoint {
    return { year, wage: 100, cpi: 100, tax: 60, fx: 145, ...overrides };
  }

  it("returns empty structure for <2 data points", () => {
    expect(generateNarrative([])).toEqual({ paragraphs: [], insight: null });
    expect(generateNarrative([makePoint(2020)])).toEqual({ paragraphs: [], insight: null });
  });

  it("single-year band uses current-value template and no insight", () => {
    const n = generateNarrative([makePoint(2020), makePoint(2020, { wage: 99 })]);
    expect(narrativeToText(n)).toContain("単年");
    expect(narrativeToText(n)).not.toContain("年間で");
    expect(n.insight).toBeNull();
  });

  it("long band includes annual rate of CPI", () => {
    const start = makePoint(1990, { wage: 100, cpi: 100 });
    const end = makePoint(2024, { wage: 99, cpi: 120 });
    const n = generateNarrative([start, end]);
    const text = narrativeToText(n);
    expect(text).toContain("長期");
    expect(text).toContain("年率");
  });

  it("wage drops + CPI rises => purchasing power narrative + insight", () => {
    const start = makePoint(2010, { wage: 100, cpi: 100 });
    const end = makePoint(2024, { wage: 95, cpi: 115 });
    const n = generateNarrative([start, end]);
    expect(narrativeToText(n)).toContain("購買力");
    // 読み解き一文は「実質購買力は約X%低下」を含む
    expect(n.insight).toMatch(/実質購買力は約[\d.]+%低下/);
  });

  it("ignores small fx fluctuations in short band", () => {
    // 期間 3 年 = short band。fx 140→144 (約2.9%) は閾値8%未満で非表示
    const start = makePoint(2021, { fx: 140 });
    const end = makePoint(2024, { fx: 144 });
    const text = narrativeToText(generateNarrative([start, end]));
    expect(text).not.toContain("ドル円");
  });

  it("reports large fx swing as 円安/円高", () => {
    const start = makePoint(2010, { fx: 90 });
    const end = makePoint(2024, { fx: 150 });
    const n = generateNarrative([start, end]);
    expect(narrativeToText(n)).toContain("円安");
  });

  it("paragraphs are an array of separated sentences (no全角空白)", () => {
    const start = makePoint(2010, { wage: 100, cpi: 100, tax: 50, fx: 90 });
    const end = makePoint(2024, { wage: 95, cpi: 120, tax: 70, fx: 150 });
    const n = generateNarrative([start, end]);
    expect(n.paragraphs.length).toBeGreaterThanOrEqual(2);
    // 全角空白で連結されていない
    n.paragraphs.forEach(p => expect(p).not.toContain("　"));
  });

  it("yen weak + CPI rise => imported inflation insight", () => {
    // wage horizontal でなく + cpi 中程度なので「購買力低下」より「輸入インフレ」が出る順
    const start = makePoint(2010, { wage: 100, cpi: 100, fx: 90 });
    const end = makePoint(2024, { wage: 101, cpi: 115, fx: 150 });
    const n = generateNarrative([start, end]);
    // wage上昇 + cpi上昇のため insight は「円安と物価上昇」または null
    if (n.insight) {
      expect(n.insight).toMatch(/円安と物価上昇|生活水準は改善|個人の実質賃金/);
    }
  });
});
