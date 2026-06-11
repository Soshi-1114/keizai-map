import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Props {
  title: string;
  description: string;
  readingTime: number;
  tags?: string[];
  children: React.ReactNode;
}

export function ArticleLayout({ title, description, readingTime, tags, children }: Props) {
  return (
    <main
      className="min-h-screen py-8 px-4 w-full min-w-0"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="mx-auto" style={{ maxWidth: 720 }}>
        {/* ナビ */}
        <div className="flex items-center justify-between mb-6">
          <nav className="flex items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
            <Link href="/" className="hover:underline" style={{ color: "#4F8EF7" }}>
              KeizaiMap
            </Link>
            <span>/</span>
            <Link href="/articles" className="hover:underline" style={{ color: "#4F8EF7" }}>
              解説記事
            </Link>
          </nav>
          <ThemeToggle />
        </div>

        {/* ヘッダー */}
        <header className="mb-8 pb-6 border-b" style={{ borderColor: "var(--border)" }}>
          {tags && (
            <div className="flex gap-2 flex-wrap mb-3">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full border"
                  style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-2xl font-bold leading-snug mb-3 break-words overflow-wrap-anywhere" style={{ overflowWrap: "break-word" }}>{title}</h1>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--muted)" }}>
            {description}
          </p>
          <div className="text-xs" style={{ color: "var(--muted)" }}>
            読了時間 約 {readingTime} 分
          </div>
        </header>

        {/* 本文 */}
        <div className="space-y-6">{children}</div>

        {/* CTA */}
        <div
          className="mt-10 rounded-xl border p-5 text-center"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        >
          <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
            KeizaiMap でこの指標を実際のデータで確認できます
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#4F8EF7", color: "#fff" }}
          >
            📊 KeizaiMap でグラフを見る
          </Link>
        </div>

        {/* 他の記事 */}
        <div className="mt-8 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
          <Link
            href="/articles"
            className="text-sm hover:underline"
            style={{ color: "#4F8EF7" }}
          >
            ← 解説記事一覧に戻る
          </Link>
        </div>
      </div>
    </main>
  );
}

// 本文セクション用ヘルパー
export function Section({ heading, children }: { heading?: string; children: React.ReactNode }) {
  return (
    <section>
      {heading && (
        <h2
          className="text-lg font-bold mb-3 pb-2 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          {heading}
        </h2>
      )}
      <div className="text-sm leading-relaxed space-y-3" style={{ color: "var(--text)" }}>
        {children}
      </div>
    </section>
  );
}

// データ引用ボックス
export function DataBox({
  items,
}: {
  items: { label: string; value: string; note?: string; color?: string }[];
}) {
  return (
    <div
      className="rounded-xl border p-4 grid grid-cols-2 md:grid-cols-4 gap-4 my-4"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      {items.map(({ label, value, note, color }) => (
        <div key={label}>
          <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>
            {label}
          </div>
          <div
            className="text-xl font-bold tabular-nums"
            style={{ color: color ?? "var(--text)" }}
          >
            {value}
          </div>
          {note && (
            <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              {note}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
