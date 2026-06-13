import { describe, it, expect } from "vitest";
import { parseCSV, rebaseTo100, round1, parseNumberClean } from "../utils";

describe("parseCSV", () => {
  it("parses simple rows separated by LF", () => {
    expect(parseCSV("a,b,c\n1,2,3")).toEqual([
      ["a", "b", "c"],
      ["1", "2", "3"],
    ]);
  });

  it("handles CRLF line endings", () => {
    expect(parseCSV("a,b\r\n1,2\r\n3,4")).toEqual([
      ["a", "b"],
      ["1", "2"],
      ["3", "4"],
    ]);
  });

  it("strips UTF-8 BOM at start of document", () => {
    expect(parseCSV("﻿a,b\n1,2")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });

  it("respects quoted cells containing commas", () => {
    expect(parseCSV(`a,"b,c",d`)).toEqual([["a", "b,c", "d"]]);
  });

  it("unescapes doubled double-quotes inside quoted cells", () => {
    expect(parseCSV(`a,"b""c",d`)).toEqual([["a", `b"c`, "d"]]);
  });

  it("preserves newlines inside quoted cells", () => {
    expect(parseCSV(`"line1\nline2",x`)).toEqual([["line1\nline2", "x"]]);
  });

  it("returns trailing field on final row even without newline", () => {
    expect(parseCSV("a,b,c")).toEqual([["a", "b", "c"]]);
  });

  it("returns empty array for empty input", () => {
    expect(parseCSV("")).toEqual([]);
  });

  it("skips fully-empty intermediate lines", () => {
    expect(parseCSV("a,b\n\n1,2")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });
});

describe("rebaseTo100", () => {
  it("rebases to 100 at baseYear and rounds to 1 decimal", () => {
    const data = new Map<number, number>([
      [1990, 50],
      [2000, 75],
      [2024, 100],
    ]);
    const out = rebaseTo100(data, 1990);
    expect(out.get(1990)).toBe(100);
    expect(out.get(2000)).toBe(150);
    expect(out.get(2024)).toBe(200);
  });

  it("produces 1-decimal precision", () => {
    const data = new Map<number, number>([
      [2000, 3],
      [2024, 4],
    ]);
    const out = rebaseTo100(data, 2000);
    expect(out.get(2024)).toBe(133.3);
  });

  it("throws when baseYear missing from input", () => {
    const data = new Map<number, number>([[2024, 100]]);
    expect(() => rebaseTo100(data, 1990)).toThrowError(/1990年/);
  });

  it("treats baseYear value 0 as missing (throws)", () => {
    // Map#get returns 0 which is falsy → 現実装では throw
    const data = new Map<number, number>([
      [1990, 0],
      [2024, 100],
    ]);
    expect(() => rebaseTo100(data, 1990)).toThrowError(/1990年/);
  });
});

describe("round1", () => {
  it("rounds positive numbers to 1 decimal", () => {
    expect(round1(1.23)).toBe(1.2);
    expect(round1(1.26)).toBe(1.3);
  });

  it("rounds negative numbers to 1 decimal", () => {
    expect(round1(-1.23)).toBe(-1.2);
  });

  it("returns null for null/undefined/NaN", () => {
    expect(round1(null)).toBeNull();
    expect(round1(undefined)).toBeNull();
    expect(round1(NaN)).toBeNull();
  });

  it("passes through integer values unchanged", () => {
    expect(round1(7)).toBe(7);
    expect(round1(0)).toBe(0);
  });
});

describe("parseNumberClean", () => {
  it("parses simple integer string", () => {
    expect(parseNumberClean("123")).toBe(123);
  });

  it("strips commas as thousand separators", () => {
    expect(parseNumberClean("1,234,567")).toBe(1234567);
  });

  it("strips ¥ and 円 symbols", () => {
    expect(parseNumberClean("¥1,200")).toBe(1200);
    expect(parseNumberClean("1200円")).toBe(1200);
  });

  it("strips whitespace", () => {
    expect(parseNumberClean(" 1 200 ")).toBe(1200);
  });

  it("converts fullwidth digits ０-９ to halfwidth", () => {
    expect(parseNumberClean("１２３")).toBe(123);
    // 半角カンマと混在しても OK
    expect(parseNumberClean("１,234")).toBe(1234);
  });

  it("returns null for empty string", () => {
    expect(parseNumberClean("")).toBeNull();
  });

  it("returns null for non-numeric input", () => {
    expect(parseNumberClean("abc")).toBeNull();
  });

  it("handles decimal points", () => {
    expect(parseNumberClean("1.5")).toBe(1.5);
    expect(parseNumberClean("¥1,234.5")).toBe(1234.5);
  });
});
