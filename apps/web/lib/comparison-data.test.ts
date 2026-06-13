import { describe, it, expect } from "vitest";
import { getComparisonData, G7_WAGE, G7_CPI, G7_FX } from "./comparison-data";
import type { DataPoint } from "./types";

const point = (year: number): DataPoint => ({
  year, wage: 100, cpi: 100, tax: 60, fx: 145,
});

describe("getComparisonData", () => {
  it("appends G7 fields for years present in the G7 dictionaries", () => {
    const out = getComparisonData([point(1990), point(2020)]);
    expect(out[0].g7wage).toBe(G7_WAGE[1990]);
    expect(out[0].g7cpi).toBe(G7_CPI[1990]);
    expect(out[0].g7fx).toBe(G7_FX[1990]);
    expect(out[1].g7wage).toBe(G7_WAGE[2020]);
  });

  it("sets G7 fields to undefined for years not in dictionary (odd years)", () => {
    // G7 系列は偶数年のみ提供
    const out = getComparisonData([point(1991), point(2021)]);
    expect(out[0].g7wage).toBeUndefined();
    expect(out[0].g7cpi).toBeUndefined();
    expect(out[0].g7fx).toBeUndefined();
    expect(out[1].g7wage).toBeUndefined();
  });

  it("preserves order and all original DataPoint fields", () => {
    const input = [point(1990), point(1991), point(1992)];
    const out = getComparisonData(input);
    expect(out).toHaveLength(3);
    expect(out.map(p => p.year)).toEqual([1990, 1991, 1992]);
    expect(out[0].wage).toBe(100);
    expect(out[0].cpi).toBe(100);
  });

  it("does not mutate input objects (returns new references)", () => {
    const input = [point(1990)];
    const out = getComparisonData(input);
    expect(out[0]).not.toBe(input[0]);
    expect((input[0] as { g7wage?: number }).g7wage).toBeUndefined();
  });

  it("returns empty array for empty input", () => {
    expect(getComparisonData([])).toEqual([]);
  });
});

describe("G7 baseline dictionaries", () => {
  it("all start at 100.0 in 1990 (rebased index)", () => {
    expect(G7_WAGE[1990]).toBe(100.0);
    expect(G7_CPI[1990]).toBe(100.0);
    expect(G7_FX[1990]).toBe(100.0);
  });

  it("G7_CPI is monotonically non-decreasing across known years", () => {
    const years = Object.keys(G7_CPI).map(Number).sort((a, b) => a - b);
    for (let i = 1; i < years.length; i++) {
      expect(G7_CPI[years[i]]).toBeGreaterThanOrEqual(G7_CPI[years[i - 1]]);
    }
  });
});
