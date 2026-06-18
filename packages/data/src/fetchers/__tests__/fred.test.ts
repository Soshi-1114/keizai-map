import { describe, it, expect } from "vitest";
import { aggregateToMonthly, aggregateToAnnual, type FredPoint } from "../fred";

describe("aggregateToMonthly", () => {
  it("buckets by YYYY-MM and averages within each month", () => {
    const points: FredPoint[] = [
      { date: "2025-01-02", value: 150 },
      { date: "2025-01-03", value: 152 },
      { date: "2025-02-03", value: 160 },
    ];
    const out = aggregateToMonthly(points);
    expect(out.get("2025-01")).toBe(151);
    expect(out.get("2025-02")).toBe(160);
  });

  it("rounds month averages to 2 decimals", () => {
    const points: FredPoint[] = [
      { date: "2025-03-01", value: 100 },
      { date: "2025-03-02", value: 100.555 },
      { date: "2025-03-03", value: 100 },
    ];
    const out = aggregateToMonthly(points);
    // (100 + 100.555 + 100) / 3 = 100.185 → 100.19
    expect(out.get("2025-03")).toBe(100.19);
  });

  it("returns an empty Map for empty input", () => {
    expect(aggregateToMonthly([])).toEqual(new Map());
  });

  it("handles a single point per month", () => {
    const points: FredPoint[] = [{ date: "2024-12-31", value: 158.42 }];
    const out = aggregateToMonthly(points);
    expect(out.get("2024-12")).toBe(158.42);
    expect(out.size).toBe(1);
  });

  it("preserves chronological keys across year boundaries", () => {
    const points: FredPoint[] = [
      { date: "2024-12-31", value: 158 },
      { date: "2025-01-02", value: 159 },
    ];
    const out = aggregateToMonthly(points);
    expect(Array.from(out.keys())).toEqual(["2024-12", "2025-01"]);
  });
});

describe("aggregateToAnnual", () => {
  it("buckets by year and averages within each year", () => {
    const points: FredPoint[] = [
      { date: "2024-01-15", value: 140 },
      { date: "2024-06-15", value: 150 },
      { date: "2024-12-15", value: 160 },
      { date: "2025-01-15", value: 155 },
    ];
    const out = aggregateToAnnual(points);
    // 2024: (140 + 150 + 160) / 3 = 150
    expect(out.get(2024)).toBe(150);
    expect(out.get(2025)).toBe(155);
  });

  it("rounds annual averages to 1 decimal", () => {
    const points: FredPoint[] = [
      { date: "2024-01-01", value: 100 },
      { date: "2024-02-01", value: 100.5 },
      { date: "2024-03-01", value: 100 },
    ];
    const out = aggregateToAnnual(points);
    // (100 + 100.5 + 100) / 3 = 100.166... → 100.2
    expect(out.get(2024)).toBe(100.2);
  });

  it("returns an empty Map for empty input", () => {
    expect(aggregateToAnnual([])).toEqual(new Map());
  });

  it("skips points with invalid date prefixes", () => {
    const points: FredPoint[] = [
      { date: "2024-05-01", value: 100 },
      { date: "abcd-12-01", value: 200 },
    ];
    const out = aggregateToAnnual(points);
    expect(out.get(2024)).toBe(100);
    expect(out.size).toBe(1);
  });
});
