import { describe, it, expect, beforeEach, vi } from "vitest";

// localStorage モック
class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  get length(): number { return this.map.size; }
  clear(): void { this.map.clear(); }
  getItem(key: string): string | null { return this.map.get(key) ?? null; }
  key(index: number): string | null { return Array.from(this.map.keys())[index] ?? null; }
  removeItem(key: string): void { this.map.delete(key); }
  setItem(key: string, value: string): void { this.map.set(key, value); }
}

beforeEach(() => {
  vi.stubGlobal("window", { localStorage: new MemoryStorage() });
  vi.stubGlobal("localStorage", new MemoryStorage());
});

describe("bookmarks", () => {
  it("addBookmark + getBookmarks roundtrip", async () => {
    const { addBookmark, getBookmarks } = await import("./bookmarks");
    const res = addBookmark({ indicators: "wage,cpi", range: "1990,2024", events: "税制" });
    expect(res.ok).toBe(true);
    expect(getBookmarks()).toHaveLength(1);
    expect(getBookmarks()[0].indicators).toBe("wage,cpi");
  });

  it("addRecent caps to MAX_RECENT=5 entries", async () => {
    const { addRecent, getRecent } = await import("./bookmarks");
    for (let i = 0; i < 8; i++) {
      addRecent(`wage${i}`, "1990,2024", "");
    }
    expect(getRecent()).toHaveLength(5);
  });

  it("isBookmarked detects existing entry", async () => {
    const { addBookmark, isBookmarked } = await import("./bookmarks");
    addBookmark({ indicators: "wage", range: "1990,2024", events: "" });
    expect(isBookmarked("wage", "1990,2024", "")).toBe(true);
    expect(isBookmarked("cpi", "1990,2024", "")).toBe(false);
  });

  it("returns quota_exceeded result when storage throws", async () => {
    const failingStorage: Storage = {
      length: 0,
      clear: () => {},
      getItem: () => null,
      key: () => null,
      removeItem: () => {},
      setItem: () => {
        const err = new DOMException("quota", "QuotaExceededError");
        throw err;
      },
    };
    vi.stubGlobal("window", { localStorage: failingStorage });
    vi.stubGlobal("localStorage", failingStorage);
    vi.resetModules();
    const { addBookmark } = await import("./bookmarks");
    const res = addBookmark({ indicators: "wage", range: "1990,2024", events: "" });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.reason).toBe("quota_exceeded");
    }
  });
});
