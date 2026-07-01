"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Star, Library, Trash2, Clock } from "lucide-react";
import {
  addBookmark,
  removeBookmark,
  getBookmarks,
  getRecent,
  isBookmarked,
  toQueryString,
  describeStorageError,
  type SavedView,
} from "@/lib/bookmarks";

interface Props {
  indicators: string;
  range: string;
  events: string;
}

export function BookmarkPanel({ indicators, range, events }: Props) {
  const [open, setOpen] = useState(false);
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [bookmarks, setBookmarks] = useState<SavedView[]>([]);
  const [recent, setRecent] = useState<SavedView[]>([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // エラーは 5 秒で自動消去
  useEffect(() => {
    if (!errorMsg) return;
    const t = setTimeout(() => setErrorMsg(null), 5000);
    return () => clearTimeout(t);
  }, [errorMsg]);

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setBookmarks(getBookmarks());
    setRecent(getRecent());
    setBookmarked(isBookmarked(indicators, range, events));
  }, [indicators, range, events, open]);

  // Escape キーでドロワーとダイアログを閉じる
  useEffect(() => {
    if (!open && !nameDialogOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (nameDialogOpen) setNameDialogOpen(false);
        else if (open) setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, nameDialogOpen]);

  // ダイアログ開時に input をオートフォーカス
  useEffect(() => {
    if (nameDialogOpen) {
      const t = setTimeout(() => nameInputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [nameDialogOpen]);

  const handleToggleBookmark = () => {
    if (bookmarked) {
      const id = `${indicators}|${range}|${events}`;
      const result = removeBookmark(id);
      if (!result.ok) {
        setErrorMsg(describeStorageError(result.reason));
        return;
      }
      setBookmarks(getBookmarks());
      setBookmarked(false);
    } else {
      setNameDraft(`${range.replace(",", "〜")}年の表示`);
      setNameDialogOpen(true);
    }
  };

  const confirmBookmark = () => {
    const result = addBookmark({ indicators, range, events, title: nameDraft.trim() || undefined });
    if (!result.ok) {
      setErrorMsg(describeStorageError(result.reason));
      setNameDialogOpen(false);
      return;
    }
    setBookmarks(getBookmarks());
    setBookmarked(true);
    setNameDialogOpen(false);
  };

  const handleRemove = (id: string) => {
    const result = removeBookmark(id);
    if (!result.ok) {
      setErrorMsg(describeStorageError(result.reason));
      return;
    }
    setBookmarks(getBookmarks());
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggleBookmark}
        aria-label={bookmarked ? "ブックマーク解除" : "この表示をブックマーク"}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        style={{
          borderColor: bookmarked ? "var(--link)" : "var(--border)",
          color: bookmarked ? "var(--link)" : "var(--muted)",
          backgroundColor: bookmarked ? "var(--indigo-tint)" : "transparent",
        }}
      >
        <Star
          size={13}
          aria-hidden
          fill={bookmarked ? "currentColor" : "none"}
        />
        {bookmarked ? "保存済み" : "ブックマーク"}
      </button>

      <button
        onClick={() => setOpen(!open)}
        aria-label="保存した表示・履歴を開く"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        style={{ borderColor: "var(--border)", color: "var(--muted)" }}
      >
        <Library size={13} aria-hidden />
        履歴
      </button>

      {/* エラートースト（5秒自動消去） */}
      {errorMsg && (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed left-1/2 -translate-x-1/2 z-[80] px-4 py-3 rounded-lg shadow-lg max-w-md text-sm"
          style={{
            bottom: 20,
            backgroundColor: "#7f1d1d",
            color: "#fff",
            border: "1px solid #b91c1c",
          }}
        >
          ⚠️ {errorMsg}
          <button
            onClick={() => setErrorMsg(null)}
            aria-label="エラーメッセージを閉じる"
            className="ml-3 underline"
            style={{ color: "#fecaca" }}
          >
            閉じる
          </button>
        </div>
      )}

      {/* 名前入力ダイアログ（window.prompt の代替） */}
      {nameDialogOpen && (
        <>
          <div
            className="fixed inset-0 z-[60]"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setNameDialogOpen(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bookmark-name-dialog-title"
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[90%] max-w-sm rounded-xl p-5 shadow-xl"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
          >
            <h2 id="bookmark-name-dialog-title" className="text-base font-semibold mb-3">
              ブックマーク名
            </h2>
            <input
              ref={nameInputRef}
              type="text"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  confirmBookmark();
                }
              }}
              placeholder="例: 1990〜2024年の表示"
              className="w-full rounded-lg border px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)", color: "var(--text)" }}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setNameDialogOpen(false)}
                className="px-4 py-2 rounded-lg text-sm border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                style={{ borderColor: "var(--border)", color: "var(--text)", backgroundColor: "transparent" }}
              >
                キャンセル
              </button>
              <button
                onClick={confirmBookmark}
                className="px-4 py-2 rounded-lg text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                style={{ backgroundColor: "var(--accent-btn)", color: "#fff", border: "none" }}
              >
                保存
              </button>
            </div>
          </div>
        </>
      )}

      {/* 履歴ドロワー */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={() => setOpen(false)} aria-hidden />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bookmark-drawer-title"
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm p-5 overflow-y-auto"
            style={{ backgroundColor: "var(--card)", borderLeft: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 id="bookmark-drawer-title" className="text-base font-semibold">保存した表示</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="閉じる"
                className="text-xl px-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                style={{ color: "var(--muted)" }}
              >
                ×
              </button>
            </div>

            <section className="mb-6">
              <h3
                className="text-xs font-medium mb-2 inline-flex items-center gap-1"
                style={{ color: "var(--muted)" }}
              >
                <Star size={12} aria-hidden fill="currentColor" />
                ブックマーク（{bookmarks.length}）
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
                        aria-label={`「${b.title || b.range + "年の表示"}」を削除`}
                        className="text-xs px-2 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        style={{ color: "var(--muted)" }}
                      >
                        <Trash2 size={14} aria-hidden />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h3
                className="text-xs font-medium mb-2 inline-flex items-center gap-1"
                style={{ color: "var(--muted)" }}
              >
                <Clock size={12} aria-hidden />
                最近見た表示（{recent.length}）
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
