"use client";

/**
 * ブックマーク・履歴管理（localStorage）
 *
 * - recent: 最近見たグラフ設定（直近5件、自動保存）
 * - bookmarks: ユーザーが手動保存したお気に入り（最大20件）
 */

const RECENT_KEY = "keizai-map:recent";
const BOOKMARK_KEY = "keizai-map:bookmarks";
const MAX_RECENT = 5;
const MAX_BOOKMARKS = 20;

export interface SavedView {
  id: string;          // 重複検出用ハッシュ（indicators+range+events）
  title?: string;      // ブックマーク時のラベル
  indicators: string;  // クエリ文字列形式
  range: string;       // "1990,2024" 形式
  events: string;      // "税制,経済" 形式
  savedAt: number;     // UNIX timestamp (ms)
}

function buildId(indicators: string, range: string, events: string): string {
  return `${indicators}|${range}|${events}`;
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // QuotaExceeded など、サイレントに無視
  }
}

/** 直近の閲覧を保存（重複は最新で上書き、最大MAX_RECENT件） */
export function addRecent(indicators: string, range: string, events: string): void {
  const id = buildId(indicators, range, events);
  const list = read<SavedView[]>(RECENT_KEY, []);
  const filtered = list.filter((v) => v.id !== id);
  const next: SavedView = { id, indicators, range, events, savedAt: Date.now() };
  const updated = [next, ...filtered].slice(0, MAX_RECENT);
  write(RECENT_KEY, updated);
}

export function getRecent(): SavedView[] {
  return read<SavedView[]>(RECENT_KEY, []);
}

export function clearRecent(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(RECENT_KEY);
}

/** ブックマーク手動保存 */
export function addBookmark(view: Omit<SavedView, "id" | "savedAt"> & { title?: string }): void {
  const id = buildId(view.indicators, view.range, view.events);
  const list = read<SavedView[]>(BOOKMARK_KEY, []);
  const filtered = list.filter((v) => v.id !== id);
  const next: SavedView = { ...view, id, savedAt: Date.now() };
  const updated = [next, ...filtered].slice(0, MAX_BOOKMARKS);
  write(BOOKMARK_KEY, updated);
}

export function removeBookmark(id: string): void {
  const list = read<SavedView[]>(BOOKMARK_KEY, []);
  write(BOOKMARK_KEY, list.filter((v) => v.id !== id));
}

export function getBookmarks(): SavedView[] {
  return read<SavedView[]>(BOOKMARK_KEY, []);
}

export function isBookmarked(indicators: string, range: string, events: string): boolean {
  const id = buildId(indicators, range, events);
  return getBookmarks().some((v) => v.id === id);
}

/** SavedView を URL クエリ文字列に変換 */
export function toQueryString(view: SavedView): string {
  const params = new URLSearchParams({
    indicators: view.indicators,
    range: view.range,
    events: view.events,
  });
  return `?${params.toString()}`;
}
