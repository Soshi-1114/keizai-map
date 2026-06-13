import { describe, expect, it } from "vitest";
import { RAW_DATA } from "./data";
import {
  dataYearRangeLabel,
  derive,
  formatIndex,
  formatPct,
  formatRatio,
  latestYear,
  trendLabel,
} from "./derived";

describe("derive", () => {
  it("実質賃金の派生統計（1990→最新年）", () => {
    const stat = derive("wage");
    expect(stat).not.toBeNull();
    expect(stat!.startYear).toBe(1990);
    expect(stat!.startValue).toBe(100);
    // 最新値は data.generated.json から取得（スナップショット感覚で）
    expect(stat!.endYear).toBe(latestYear());
  });

  it("税収は 60.1兆円 を基準に 1990年→最新年 の倍率を返す", () => {
    const stat = derive("tax");
    expect(stat).not.toBeNull();
    expect(stat!.startValue).toBe(60.1);
    // 2026-06 時点の data では税収は +20% を超える（誤記「+125%」「2.3倍」を許さない）
    expect(stat!.pctChange).toBeGreaterThan(20);
    expect(stat!.pctChange).toBeLessThan(80);
    expect(stat!.ratio).toBeGreaterThan(1.2);
    expect(stat!.ratio).toBeLessThan(1.8);
  });

  it("社会保険料は 10.8% を基準に 1990年→最新年 の倍率を返す", () => {
    const stat = derive("insurance");
    expect(stat).not.toBeNull();
    expect(stat!.startValue).toBe(10.8);
    expect(stat!.ratio).toBeGreaterThan(1.5);
    expect(stat!.ratio).toBeLessThan(2.0);
  });

  it("単一年データには null を返す", () => {
    const single = [{ year: 2024, wage: 99.2, cpi: 119.9, tax: 72.1, fx: 151.8 }];
    expect(derive("wage", single)).toBeNull();
  });
});

describe("formatPct", () => {
  it.each([
    [34.3, "+34.3%"],
    [-2.1, "-2.1%"],
    [0, "0%"],
    [0.04, "0%"],
    [19.9, "+19.9%"],
  ])("formatPct(%s) → %s", (input, expected) => {
    expect(formatPct(input)).toBe(expected);
  });

  it("整数のみで返したい場合は precision=0", () => {
    expect(formatPct(34.3, 0)).toBe("+34%");
    expect(formatPct(-2.1, 0)).toBe("-2%");
  });
});

describe("formatRatio", () => {
  it.each([
    [1.34, "1.3倍"],
    [1.71, "1.7倍"],
    [2.0, "2.0倍"],
  ])("formatRatio(%s) → %s", (input, expected) => {
    expect(formatRatio(input)).toBe(expected);
  });
});

describe("formatIndex", () => {
  it("99.2 → '99.2'", () => {
    expect(formatIndex(99.2)).toBe("99.2");
  });
});

describe("trendLabel", () => {
  it("0.95〜1.05 は『ほぼ横ばい』", () => {
    expect(trendLabel(0.95)).toBe("ほぼ横ばい");
    expect(trendLabel(1.0)).toBe("ほぼ横ばい");
    expect(trendLabel(1.05)).toBe("ほぼ横ばい");
  });

  it("1.5倍以上は倍率表記", () => {
    expect(trendLabel(1.7)).toBe("1.7倍");
    expect(trendLabel(2.0)).toBe("2.0倍");
  });

  it("1.05〜1.5 は +X% 表記", () => {
    expect(trendLabel(1.34)).toBe("+34.0%");
    expect(trendLabel(1.20)).toBe("+20.0%");
  });

  it("0.95未満は -X% 表記", () => {
    expect(trendLabel(0.92)).toBe("-8.0%");
  });
});

describe("latestYear / dataYearRangeLabel", () => {
  it("RAW_DATA の最終年と一致", () => {
    const last = Math.max(...RAW_DATA.map(d => d.year));
    expect(latestYear()).toBe(last);
  });

  it("dataYearRangeLabel は '1990〜{最新年}'", () => {
    expect(dataYearRangeLabel()).toBe(`1990〜${latestYear()}`);
  });
});
