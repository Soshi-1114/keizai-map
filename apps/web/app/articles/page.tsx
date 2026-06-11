"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ARTICLES } from "@/lib/articles";

const ALL_TAGS = Array.from(new Set(ARTICLES.flatMap((a) => a.tags))).sort();

export default function ArticlesPage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filtered = selectedTag
    ? ARTICLES.filter((a) => a.tags.includes(selectedTag))
    : ARTICLES;

  return (
    <main
      className="min-h-screen py-8 px-4"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="mx-auto" style={{ maxWidth: 720 }}>
        {/* ナビ */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-sm hover:underline" style={{ color: "#4F8EF7" }}>
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

        {/* タグフィルター */}
        <div className="mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedTag(null)}
              className="px-3 py-1 rounded-full text-xs border font-medium transition-all"
              style={{
                borderColor: selectedTag === null ? "#4F8EF7" : "var(--border)",
                color: selectedTag === null ? "#4F8EF7" : "var(--muted)",
                backgroundColor: selectedTag === null ? "#4F8EF720" : "transparent",
              }}
            >
              すべて（{ARTICLES.length}）
            </button>
            {ALL_TAGS.map((tag) => {
              const count = ARTICLES.filter((a) => a.tags.includes(tag)).length;
              const active = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(active ? null : tag)}
                  className="px-3 py-1 rounded-full text-xs border font-medium transition-all"
                  style={{
                    borderColor: active ? "#4F8EF7" : "var(--border)",
                    color: active ? "#4F8EF7" : "var(--muted)",
                    backgroundColor: active ? "#4F8EF720" : "transparent",
                  }}
                >
                  {tag}（{count}）
                </button>
              );
            })}
          </div>
        </div>

        {/* 記事リスト */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: "var(--muted)" }}>
              該当する記事がありません
            </p>
          ) : (
            filtered.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="block rounded-xl border p-5 transition-colors hover:border-[#4F8EF7]"
                style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
              >
                <div className="flex gap-2 flex-wrap mb-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full border font-medium"
                      style={{
                        borderColor: tag === selectedTag ? "#4F8EF7" : "var(--border)",
                        color: tag === selectedTag ? "#4F8EF7" : "var(--text)",
                        backgroundColor: tag === selectedTag ? "#4F8EF720" : "var(--bg)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-base font-bold mb-2 leading-snug">{article.title}</h2>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--muted)" }}>
                  {article.description}
                </p>
                <div className="text-xs" style={{ color: "#4F8EF7" }}>
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
