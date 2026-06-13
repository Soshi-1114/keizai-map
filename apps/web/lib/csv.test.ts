import { describe, it, expect } from "vitest";
import { generateCSV } from "./csv";
import type { DataPoint, IndicatorKey } from "./types";

const point = (year: number, overrides: Partial<DataPoint> = {}): DataPoint => ({
  year,
  wage: 100,
  cpi: 100,
  tax: 60,
  fx: 145,
  ...overrides,
});

describe("generateCSV", () => {
  it("emits header in [年度, ...indicators] order matching argument order", () => {
    const csv = generateCSV([point(2020)], ["cpi", "wage"], [2020, 2020]);
    const [header] = csv.split("\n");
    expect(header).toBe("年度,cpi,wage");
  });

  it("filters rows to year range inclusive on both ends", () => {
    const data = [point(1999), point(2000), point(2010), point(2011)];
    const csv = generateCSV(data, ["wage"], [2000, 2010]);
    const lines = csv.split("\n");
    // header + 2000 + 2010 = 3 lines
    expect(lines).toHaveLength(3);
    expect(lines[1].startsWith("2000,")).toBe(true);
    expect(lines[2].startsWith("2010,")).toBe(true);
  });

  it("renders undefined optional indicator as empty cell", () => {
    const data = [point(2024, { nikkei: undefined })];
    const csv = generateCSV(data, ["nikkei", "wage"] as IndicatorKey[], [2024, 2024]);
    const dataRow = csv.split("\n")[1];
    expect(dataRow).toBe("2024,,100");
  });

  it("uses LF as row separator and bare commas between cells", () => {
    const csv = generateCSV([point(2020), point(2021)], ["wage"], [2020, 2021]);
    // 改行は LF のみ（CRLF ではない）
    expect(csv.includes("\r")).toBe(false);
    expect(csv.split("\n")).toHaveLength(3);
  });

  it("returns header-only string when no data falls in range", () => {
    const csv = generateCSV([point(1995)], ["wage"], [2000, 2010]);
    expect(csv).toBe("年度,wage");
  });

  it("works with empty selected indicators (only year column)", () => {
    const csv = generateCSV([point(2020)], [], [2020, 2020]);
    expect(csv).toBe("年度\n2020");
  });

  it("preserves numeric precision via String() (no rounding)", () => {
    const csv = generateCSV([point(2024, { wage: 99.25 })], ["wage"], [2024, 2024]);
    expect(csv.split("\n")[1]).toBe("2024,99.25");
  });
});
