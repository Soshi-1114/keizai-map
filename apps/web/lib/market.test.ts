import { describe, it, expect, vi } from "vitest";

// daily / monthly / data モジュールをモック差し替えしてシリーズ選択をテスト。
// 実 JSON に依存させると週次更新ごとにスナップショットが壊れるため。
vi.mock("./daily", () => ({
  FX_DAILY: [
    { date: "2026-04-01", value: 150 },
    { date: "2026-04-02", value: 151 },
    { date: "2026-04-03", value: 152 },
    { date: "2026-04-04", value: 153 },
    { date: "2026-04-07", value: 154 },
    { date: "2026-04-08", value: 155 },
    { date: "2026-04-09", value: 156 },
    { date: "2026-04-10", value: 157 },
    { date: "2026-04-11", value: 158 },
    { date: "2026-04-14", value: 159 },
    { date: "2026-04-15", value: 160 },
  ],
  NIKKEI_DAILY: [
    { date: "2026-04-01", value: 40000 },
    { date: "2026-04-02", value: 40500 },
  ],
  DAILY_GENERATED_AT: "2026-04-15",
}));

vi.mock("./monthly", () => ({
  FX_MONTHLY: [
    { ym: "2025-05", value: 145 },
    { ym: "2025-06", value: 146 },
    { ym: "2025-07", value: 147 },
    { ym: "2025-08", value: 148 },
    { ym: "2025-09", value: 149 },
    { ym: "2025-10", value: 150 },
    { ym: "2025-11", value: 151 },
    { ym: "2025-12", value: 152 },
    { ym: "2026-01", value: 153 },
    { ym: "2026-02", value: 154 },
    { ym: "2026-03", value: 155 },
    { ym: "2026-04", value: 156 },
    { ym: "2026-05", value: 157 },
    { ym: "2026-06", value: 158 },
  ],
  NIKKEI_MONTHLY: [],
  MONTHLY_GENERATED_AT: "2026-06",
  CPI_MONTHLY: [],
}));

vi.mock("./data", () => ({
  RAW_DATA: [
    { year: 2023, fx: 140, nikkei: 137, nikkeiYen: 32500 },
    { year: 2024, fx: 151, nikkei: 155, nikkeiYen: 38500 },
    { year: 2025, fx: 149, nikkei: 196, nikkeiYen: 41800 },
  ],
  INDICATOR_CONFIGS: [],
}));

// vi.mock はホイストされるため通常の static import で OK。
import {
  FX_MARKET_CONFIG,
  NIKKEI_MARKET_CONFIG,
  selectMarketSeries,
  deltaFromLatest,
  pctChangeFromLatest,
  formatMarketValue,
  deltaLabelForRange,
  granularityLabel,
} from "./market";

describe("selectMarketSeries (FX)", () => {
  it("1W returns last 7 daily points (granularity=daily)", () => {
    const s = selectMarketSeries(FX_MARKET_CONFIG, "1W");
    expect(s.granularity).toBe("daily");
    expect(s.points).toHaveLength(7);
    expect(s.points[s.points.length - 1].value).toBe(160);
    expect(s.points[0].value).toBe(154);
  });

  it("1M returns up to 30 daily points (here all 11)", () => {
    const s = selectMarketSeries(FX_MARKET_CONFIG, "1M");
    expect(s.granularity).toBe("daily");
    expect(s.points).toHaveLength(11);
  });

  it("3M returns up to 90 daily points (here all 11)", () => {
    const s = selectMarketSeries(FX_MARKET_CONFIG, "3M");
    expect(s.granularity).toBe("daily");
    expect(s.points).toHaveLength(11);
  });

  it("1Y returns last 12 monthly points (granularity=monthly)", () => {
    const s = selectMarketSeries(FX_MARKET_CONFIG, "1Y");
    expect(s.granularity).toBe("monthly");
    expect(s.points).toHaveLength(12);
    expect(s.points[s.points.length - 1].value).toBe(158);
  });

  it("2Y returns all monthly points (here 14)", () => {
    const s = selectMarketSeries(FX_MARKET_CONFIG, "2Y");
    expect(s.granularity).toBe("monthly");
    expect(s.points).toHaveLength(14);
  });

  it("Max returns annual points from RAW_DATA fx field", () => {
    const s = selectMarketSeries(FX_MARKET_CONFIG, "Max");
    expect(s.granularity).toBe("annual");
    expect(s.points.map(p => p.value)).toEqual([140, 151, 149]);
    expect(s.points[0].label).toBe("2023");
  });
});

describe("selectMarketSeries (Nikkei)", () => {
  it("Max uses RAW_DATA.nikkeiYen (実値・円) — not the 1990=100 rebased field", () => {
    const s = selectMarketSeries(NIKKEI_MARKET_CONFIG, "Max");
    expect(s.points.map(p => p.value)).toEqual([32500, 38500, 41800]);
  });

  it("1Y returns empty when NIKKEI_MONTHLY is empty (batch not run)", () => {
    const s = selectMarketSeries(NIKKEI_MARKET_CONFIG, "1Y");
    expect(s.points).toHaveLength(0);
  });
});

describe("deltaFromLatest / pctChangeFromLatest", () => {
  const points = [
    { label: "x", value: 100, detail: "" },
    { label: "y", value: 101, detail: "" },
    { label: "z", value: 102.5, detail: "" },
  ];

  it("computes signed delta of last two points", () => {
    expect(deltaFromLatest(points)).toBeCloseTo(1.5);
  });

  it("computes pct change of last two points", () => {
    expect(pctChangeFromLatest(points)).toBeCloseTo((1.5 / 101) * 100);
  });

  it("returns null when fewer than 2 points", () => {
    expect(deltaFromLatest(points.slice(0, 1))).toBeNull();
    expect(pctChangeFromLatest([])).toBeNull();
  });

  it("returns null when previous value is 0 (pct undefined)", () => {
    expect(pctChangeFromLatest([
      { label: "x", value: 0, detail: "" },
      { label: "y", value: 5, detail: "" },
    ])).toBeNull();
  });
});

describe("formatMarketValue", () => {
  it("uses ja-JP locale with thousand separator and fixed decimals", () => {
    expect(formatMarketValue(12345.678, 2)).toBe("12,345.68");
    expect(formatMarketValue(12345.678, 0)).toBe("12,346");
  });
});

describe("deltaLabelForRange / granularityLabel", () => {
  it("daily ranges use 前日比", () => {
    expect(deltaLabelForRange("1W")).toBe("前日比");
    expect(deltaLabelForRange("1M")).toBe("前日比");
    expect(deltaLabelForRange("3M")).toBe("前日比");
  });

  it("monthly ranges use 前月比", () => {
    expect(deltaLabelForRange("1Y")).toBe("前月比");
    expect(deltaLabelForRange("2Y")).toBe("前月比");
  });

  it("Max uses 前年比", () => {
    expect(deltaLabelForRange("Max")).toBe("前年比");
  });

  it("granularityLabel maps granularity to Japanese label", () => {
    expect(granularityLabel("daily")).toBe("日次");
    expect(granularityLabel("monthly")).toBe("月平均");
    expect(granularityLabel("annual")).toBe("年平均");
  });
});
