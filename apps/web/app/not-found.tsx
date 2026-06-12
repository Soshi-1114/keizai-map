import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="max-w-md w-full rounded-xl border p-6 text-center space-y-4"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
        <p className="text-3xl" aria-hidden>🗺️</p>
        <h1 className="text-lg font-bold">ページが見つかりません</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          指定されたページは存在しないか、移動した可能性があります。
        </p>
        <div className="flex gap-2 justify-center pt-2">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            style={{ backgroundColor: "var(--accent-btn)", color: "#fff" }}
          >
            ダッシュボードへ
          </Link>
          <Link
            href="/articles"
            className="px-4 py-2 rounded-lg text-sm font-medium border transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            解説記事を見る
          </Link>
        </div>
      </div>
    </main>
  );
}
