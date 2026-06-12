import { describe, it, expect } from "vitest";
import {
  parseRange,
  parseIndicators,
  parseCategories,
  formatUpdatedAt,
  generateNarrative,
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

  it("returns empty string for <2 data points", () => {
    expect(generateNarrative([])).toBe("");
    expect(generateNarrative([makePoint(2020)])).toBe("");
  });

  it("single-year band uses current-value template", () => {
    const text = generateNarrative([makePoint(2020), makePoint(2020, { wage: 99 })]);
    expect(text).toContain("単年");
    expect(text).not.toContain("年間で");
  });

  it("long band includes annual rate of CPI", () => {
    const start = makePoint(1990, { wage: 100, cpi: 100 });
    const end = makePoint(2024, { wage: 99, cpi: 120 });
    const text = generateNarrative([start, end]);
    expect(text).toContain("長期");
    expect(text).toContain("年率");
  });

  it("wage drops + CPI rises => purchasing power narrative", () => {
    const start = makePoint(2010, { wage: 100, cpi: 100 });
    const end = makePoint(2024, { wage: 95, cpi: 115 });
    const text = generateNarrative([start, end]);
    expect(text).toContain("購買力");
  });

  it("ignores small fx fluctuations in short band", () => {
    // 期間 3 年 = short band。fx 140→144 (約2.9%) は閾値8%未満で非表示
    const start = makePoint(2021, { fx: 140 });
    const end = makePoint(2024, { fx: 144 });
    const text = generateNarrative([start, end]);
    expect(text).not.toContain("ドル円");
  });

  it("reports large fx swing as 円安/円高", () => {
    const start = makePoint(2010, { fx: 90 });
    const end = makePoint(2024, { fx: 150 });
    const text = generateNarrative([start, end]);
    expect(text).toContain("円安");
  });
});
