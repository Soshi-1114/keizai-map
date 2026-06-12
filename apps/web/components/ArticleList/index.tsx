"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ARTICLES } from "@/lib/articles";

// 記事数の多い順にタグをソート
const TAGS_BY_COUNT = (() => {
  const counts = new Map<string, number>();
  for (const a of ARTICLES) {
    for (const t of a.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag, count]) => ({ tag, count }));
})();

/** 初期表示するタグ数（SP では FV を確保するため絞り込む） */
const PRIMARY_TAG_COUNT = 6;

export function ArticleList() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showAllTags, setShowAllTags] = useState(false);

  // 選択中タグが「もっと見る」配下にある場合は自動展開
  const isSelectedHidden = useMemo(() => {
    if (!selectedTag) return false;
    const idx = TAGS_BY_COUNT.findIndex(t => t.tag === selectedTag);
    return idx >= PRIMARY_TAG_COUNT;
  }, [selectedTag]);

  const tagsToShow = showAllTags || isSelectedHidden
    ? TAGS_BY_COUNT
    : TAGS_BY_COUNT.slice(0, PRIMARY_TAG_COUNT);
  const hiddenCount = TAGS_BY_COUNT.length - PRIMARY_TAG_COUNT;

  const filtered = selectedTag
    ? ARTICLES.filter((a) => a.tags.includes(selectedTag))
    : ARTICLES;

  return (
    <main
      id="main"
      className="min-h-screen py-8 px-4 overflow-x-hidden"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="mx-auto min-w-0" style={{ maxWidth: 720 }}>
        {/* ナビ */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-sm hover:underline" style={{ color: "var(--link)" }}>
            ← KeizaiMap に戻る
          </Link>
          <ThemeToggle />
        </div>

        {/* ヘッダー */}
        <header className="mb-6 pb-6 border-b" style={{ borderColor: "var(--border)" }}>
          <h1 className="text-2xl font-bold mb-2">解説記事</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            日本経済のキーワードをデータとともに解説します。
          </p>
        </header>

        {/* タグフィルター — SP では FV 確保のため主要タグだけ表示 */}
        <div className="mb-6 min-w-0" aria-label="タグで記事を絞り込み">
          <div className="flex gap-2 flex-wrap min-w-0">
            <button
              onClick={() => setSelectedTag(null)}
              aria-pressed={selectedTag === null}
              className="px-3 py-1 rounded-full text-xs border font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              style={{
                borderColor: selectedTag === null ? "var(--link)" : "var(--border)",
                color: selectedTag === null ? "var(--link)" : "var(--muted)",
                backgroundColor: selectedTag === null ? "#1d4ed815" : "transparent",
              }}
            >
              すべて（{ARTICLES.length}）
            </button>
            {tagsToShow.map(({ tag, count }) => {
              const active = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(active ? null : tag)}
                  aria-pressed={active}
                  className="px-3 py-1 rounded-full text-xs border font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  style={{
                    borderColor: active ? "var(--link)" : "var(--border)",
                    color: active ? "var(--link)" : "var(--muted)",
                    backgroundColor: active ? "#1d4ed815" : "transparent",
                  }}
                >
                  {tag}（{count}）
                </button>
              );
            })}
            {!showAllTags && !isSelectedHidden && hiddenCount > 0 && (
              <button
                onClick={() => setShowAllTags(true)}
                aria-expanded={false}
                className="px-3 py-1 rounded-full text-xs border font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--link)",
                  backgroundColor: "transparent",
                }}
              >
                ＋ もっと見る（{hiddenCount}）
              </button>
            )}
            {showAllTags && (
              <button
                onClick={() => setShowAllTags(false)}
                aria-expanded={true}
                className="px-3 py-1 rounded-full text-xs border font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--muted)",
                  backgroundColor: "transparent",
                }}
              >
                － 閉じる
              </button>
            )}
          </div>
        </div>

        {/* 記事リスト */}
        <div className="space-y-4 min-w-0">
          {filtered.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: "var(--muted)" }}>
              該当する記事がありません
            </p>
          ) : (
            filtered.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="block rounded-xl border p-5 transition-colors hover:border-[var(--link)] min-w-0"
                style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
              >
                <div className="flex gap-2 flex-wrap mb-2 min-w-0">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full border font-medium whitespace-nowrap"
                      style={{
                        borderColor: tag === selectedTag ? "var(--link)" : "var(--border)",
                        color: tag === selectedTag ? "var(--link)" : "var(--text)",
                        backgroundColor: tag === selectedTag ? "#1d4ed815" : "var(--bg)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-base font-bold mb-2 leading-snug break-words" style={{ overflowWrap: "break-word" }}>{article.title}</h2>
                <p className="text-xs leading-relaxed mb-3 break-words" style={{ color: "var(--muted)", overflowWrap: "break-word" }}>
                  {article.description}
                </p>
                <div className="text-xs" style={{ color: "var(--link)" }}>
                  読了時間 約 {article.readingTime} 分 →
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
