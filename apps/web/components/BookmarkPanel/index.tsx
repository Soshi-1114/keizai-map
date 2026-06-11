"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  addBookmark,
  removeBookmark,
  getBookmarks,
  getRecent,
  isBookmarked,
  toQueryString,
  type SavedView,
} from "@/lib/bookmarks";

interface Props {
  indicators: string;
  range: string;
  events: string;
}

export function BookmarkPanel({ indicators, range, events }: Props) {
  const [open, setOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<SavedView[]>([]);
  const [recent, setRecent] = useState<SavedView[]>([]);
  const [bookmarked, setBookmarked] = useState(false);

  // クライアントマウント後のみ localStorage を読む
  useEffect(() => {
    setBookmarks(getBookmarks());
    setRecent(getRecent());
    setBookmarked(isBookmarked(indicators, range, events));
  }, [indicators, range, events, open]);

  const handleToggleBookmark = () => {
    if (bookmarked) {
      const id = `${indicators}|${range}|${events}`;
      removeBookmark(id);
    } else {
      const title = window.prompt("ブックマーク名を入力（省略可）:", `${range.replace(",", "〜")}年の表示`);
      if (title === null) return; // キャンセル
      addBookmark({ indicators, range, events, title: title || undefined });
    }
    setBookmarks(getBookmarks());
    setBookmarked(!bookmarked);
  };

  const handleRemove = (id: string) => {
    removeBookmark(id);
    setBookmarks(getBookmarks());
  };

  return (
    <div className="flex items-center gap-2">
      {/* ブックマークトグル */}
      <button
        onClick={handleToggleBookmark}
        aria-label={bookmarked ? "ブックマーク解除" : "この表示をブックマーク"}
        className="px-3 py-1.5 rounded-full text-xs border transition-all font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        style={{
          borderColor: bookmarked ? "var(--link)" : "var(--border)",
          color: bookmarked ? "var(--link)" : "var(--muted)",
          backgroundColor: bookmarked ? "#1d4ed815" : "transparent",
        }}
      >
        {bookmarked ? "★ 保存済み" : "☆ ブックマーク"}
      </button>

      {/* 履歴・お気に入りパネル */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="保存した表示・履歴を開く"
        className="px-3 py-1.5 rounded-full text-xs border transition-all font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        style={{ borderColor: "var(--border)", color: "var(--muted)" }}
      >
        📚 履歴
      </button>

      {/* ドロワー */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={() => setOpen(false)} />
          <div
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm p-5 overflow-y-auto"
            style={{ backgroundColor: "var(--card)", borderLeft: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">保存した表示</h2>
              <button onClick={() => setOpen(false)} aria-label="閉じる" className="text-xl" style={{ color: "var(--muted)" }}>
                ×
              </button>
            </div>

            {/* ブックマーク */}
            <section className="mb-6">
              <h3 className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>
                ★ ブックマーク（{bookmarks.length}）
              </h3>
              {bookmarks.length === 0 ? (
                <p className="text-xs" style={{ color: "var(--muted)" }}>まだブックマークはありません。</p>
              ) : (
                <div className="space-y-2">
                  {bookmarks.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-start gap-2 p-3 rounded-lg border"
                      style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)" }}
                    >
                      <Link
                        href={`/${toQueryString(b)}`}
                        onClick={() => setOpen(false)}
                        className="flex-1 min-w-0 text-sm hover:opacity-80"
                        style={{ color: "var(--text)" }}
                      >
                        <div className="font-medium truncate">{b.title || `${b.range}年の表示`}</div>
                        <div className="text-xs mt-0.5 truncate" style={{ color: "var(--muted)" }}>
                          {b.indicators.split(",").slice(0, 3).join("・")}
                          {b.indicators.split(",").length > 3 ? "..." : ""}
                        </div>
                      </Link>
                      <button
                        onClick={() => handleRemove(b.id)}
                        aria-label="削除"
                        className="text-xs"
                        style={{ color: "var(--muted)" }}
                      >
                        🗑
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 履歴 */}
            <section>
              <h3 className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>
                🕒 最近見た表示（{recent.length}）
              </h3>
              {recent.length === 0 ? (
                <p className="text-xs" style={{ color: "var(--muted)" }}>履歴がありません。</p>
              ) : (
                <div className="space-y-2">
                  {recent.map((r) => (
                    <Link
                      key={r.id}
                      href={`/${toQueryString(r)}`}
                      onClick={() => setOpen(false)}
                      className="block p-3 rounded-lg border hover:opacity-80"
                      style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
                    >
                      <div className="text-sm font-medium truncate">{r.range}年</div>
                      <div className="text-xs mt-0.5 truncate" style={{ color: "var(--muted)" }}>
                        {r.indicators.split(",").slice(0, 3).join("・")}
                        {r.indicators.split(",").length > 3 ? "..." : ""}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
