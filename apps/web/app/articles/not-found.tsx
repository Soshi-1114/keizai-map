import Link from "next/link";
import { Newspaper } from "lucide-react";

export default function ArticleNotFound() {
  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="max-w-md w-full rounded-xl border p-6 text-center space-y-4"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex justify-center" aria-hidden>
          <Newspaper size={32} style={{ color: "var(--muted)" }} />
        </div>
        <h1 className="text-lg font-bold">記事が見つかりません</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          指定された解説記事は存在しないか、削除された可能性があります。
        </p>
        <div className="flex gap-2 justify-center pt-2">
          <Link
            href="/articles"
            className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            style={{ backgroundColor: "var(--accent-btn)", color: "#fff" }}
          >
            記事一覧へ
          </Link>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg text-sm font-medium border transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            ダッシュボードへ
          </Link>
        </div>
      </div>
    </main>
  );
}
