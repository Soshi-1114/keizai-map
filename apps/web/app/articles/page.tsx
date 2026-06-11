import Link from "next/link";
import type { Metadata } from "next";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ARTICLES } from "@/lib/articles";

export const metadata: Metadata = {
  title: "解説記事 — KeizaiMap",
  description: "実質賃金・消費税・アベノミクス・円安・失われた30年など、日本経済のキーワードをデータとともに解説する記事一覧。",
};

export default function ArticlesPage() {
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
        <header className="mb-8 pb-6 border-b" style={{ borderColor: "var(--border)" }}>
          <h1 className="text-2xl font-bold mb-2">解説記事</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            日本経済のキーワードをデータとともに解説します。
          </p>
        </header>

        {/* 記事リスト */}
        <div className="space-y-4">
          {ARTICLES.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="block rounded-xl border p-5 transition-colors hover:border-[#4F8EF7]"
              style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            >
              <div className="flex gap-2 flex-wrap mb-2">
                {article.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full border font-medium"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--text)",
                      backgroundColor: "var(--bg)",
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
          ))}
        </div>
      </div>
    </main>
  );
}
