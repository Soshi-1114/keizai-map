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

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://keizai-map.vercel.app";
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "KeizaiMap", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "解説記事", item: `${BASE_URL}/articles` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
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

        {/* タグフィルター */}
        <div className="mb-6 min-w-0">
          <div className="flex gap-2 flex-wrap min-w-0">
            <button
              onClick={() => setSelectedTag(null)}
              className="px-3 py-1 rounded-full text-xs border font-medium transition-all"
              style={{
                borderColor: selectedTag === null ? "var(--link)" : "var(--border)",
                color: selectedTag === null ? "var(--link)" : "var(--muted)",
                backgroundColor: selectedTag === null ? "#1d4ed815" : "transparent",
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
                    borderColor: active ? "var(--link)" : "var(--border)",
                    color: active ? "var(--link)" : "var(--muted)",
                    backgroundColor: active ? "#1d4ed815" : "transparent",
                  }}
                >
                  {tag}（{count}）
                </button>
              );
            })}
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
    </>
  );
}
