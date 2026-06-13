import { describe, it, expect } from "vitest";
import { ARTICLES } from "./articles";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_RE = /^[a-z0-9-]+$/;

describe("ARTICLES — schema invariants", () => {
  it("has at least one article", () => {
    expect(ARTICLES.length).toBeGreaterThan(0);
  });

  it.each(ARTICLES.map(a => [a.slug, a] as const))(
    "slug %s: required fields & types",
    (_slug, a) => {
      expect(typeof a.title).toBe("string");
      expect(a.title.length).toBeGreaterThan(0);
      expect(typeof a.description).toBe("string");
      expect(a.description.length).toBeGreaterThan(0);
      expect(typeof a.readingTime).toBe("number");
      expect(a.readingTime).toBeGreaterThan(0);
      expect(Array.isArray(a.tags)).toBe(true);
      expect(a.tags.length).toBeGreaterThan(0);
    },
  );
});

describe("ARTICLES — slug uniqueness & format", () => {
  it("all slugs are unique", () => {
    const slugs = ARTICLES.map(a => a.slug);
    const unique = new Set(slugs);
    expect(unique.size).toBe(slugs.length);
  });

  it("all slugs are kebab-case lowercase ASCII", () => {
    for (const a of ARTICLES) {
      expect(a.slug).toMatch(SLUG_RE);
    }
  });
});

describe("ARTICLES — date invariants", () => {
  it("publishedAt and updatedAt match YYYY-MM-DD", () => {
    for (const a of ARTICLES) {
      expect(a.publishedAt).toMatch(DATE_RE);
      expect(a.updatedAt).toMatch(DATE_RE);
    }
  });

  it("updatedAt >= publishedAt for every article", () => {
    for (const a of ARTICLES) {
      expect(a.updatedAt >= a.publishedAt).toBe(true);
    }
  });

  it("publishedAt represents an actual valid calendar date", () => {
    for (const a of ARTICLES) {
      const d = new Date(a.publishedAt + "T00:00:00Z");
      expect(Number.isNaN(d.getTime())).toBe(false);
    }
  });
});

describe("ARTICLES — presetQuery format", () => {
  it("presetQuery (if present) starts with '?'", () => {
    for (const a of ARTICLES) {
      if (a.presetQuery !== undefined) {
        expect(a.presetQuery.startsWith("?")).toBe(true);
      }
    }
  });

  it("presetQuery (if present) contains either indicators or range", () => {
    for (const a of ARTICLES) {
      if (a.presetQuery !== undefined) {
        const sp = new URLSearchParams(a.presetQuery.slice(1));
        const hasIndicators = sp.has("indicators");
        const hasRange = sp.has("range");
        expect(hasIndicators || hasRange).toBe(true);
      }
    }
  });

  it("presetQuery range (if present) is two ascending years between 1989-2030", () => {
    for (const a of ARTICLES) {
      if (!a.presetQuery) continue;
      const sp = new URLSearchParams(a.presetQuery.slice(1));
      const range = sp.get("range");
      if (!range) continue;
      const [s, e] = range.split(",").map(Number);
      expect(Number.isFinite(s)).toBe(true);
      expect(Number.isFinite(e)).toBe(true);
      expect(s).toBeLessThan(e);
      expect(s).toBeGreaterThanOrEqual(1989);
      expect(e).toBeLessThanOrEqual(2030);
    }
  });

  it("presetQuery indicators (if present) only contains known indicator keys", () => {
    const KNOWN = new Set([
      "wage", "cpi", "tax", "fx", "nikkei", "housing", "debt", "births", "insurance",
    ]);
    for (const a of ARTICLES) {
      if (!a.presetQuery) continue;
      const sp = new URLSearchParams(a.presetQuery.slice(1));
      const ind = sp.get("indicators");
      if (!ind) continue;
      for (const k of ind.split(",")) {
        expect(KNOWN.has(k)).toBe(true);
      }
    }
  });
});

describe("ARTICLES — reading time sanity", () => {
  it("readingTime is between 1 and 20 minutes (no obvious outliers)", () => {
    for (const a of ARTICLES) {
      expect(a.readingTime).toBeGreaterThanOrEqual(1);
      expect(a.readingTime).toBeLessThanOrEqual(20);
    }
  });
});
