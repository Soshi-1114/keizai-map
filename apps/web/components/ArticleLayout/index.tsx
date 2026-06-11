import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ARTICLES } from "@/lib/articles";

interface Props {
  title: string;
  description: string;
  readingTime: number;
  tags?: string[];
  slug?: string;
  children: React.ReactNode;
}

export function ArticleLayout({ title, description, readingTime, tags, slug, children }: Props) {
  const related = slug
    ? ARTICLES.filter(
        (a) => a.slug !== slug && tags?.some((t) => a.tags.includes(t))
      ).slice(0, 3)
    : [];
  return (
    <main
      className="min-h-screen py-8 px-4 w-full min-w-0 overflow-x-hidden"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="mx-auto min-w-0" style={{ maxWidth: 720 }}>
        {/* ナビ */}
        <div className="flex items-center justify-between mb-6">
          <nav className="flex items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
            <Link href="/" className="hover:underline" style={{ color: "var(--link)" }}>
              KeizaiMap
            </Link>
            <span>/</span>
            <Link href="/articles" className="hover:underline" style={{ color: "var(--link)" }}>
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
          <h1
            className="text-2xl font-bold leading-snug mb-3 break-words min-w-0"
            style={{ overflowWrap: "break-word", wordBreak: "break-word" }}
          >
            {title}
          </h1>
          <p className="text-sm leading-relaxed mb-4 break-words min-w-0" style={{ color: "var(--muted)", overflowWrap: "anywhere" }}>
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
            style={{ backgroundColor: "var(--accent-btn)", color: "#fff" }}
          >
            📊 KeizaiMap でグラフを見る
          </Link>
        </div>

        {/* 関連記事 */}
        {related.length > 0 && (
          <div className="mt-8 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
            <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--muted)" }}>
              関連記事
            </h2>
            <div className="space-y-2">
              {related.map((a) => (
                <Link
                  key={a.slug}
                  href={`/articles/${a.slug}`}
                  className="flex items-start gap-3 p-3 rounded-lg border transition-colors hover:border-[var(--link)]"
                  style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug line-clamp-2">{a.title}</p>
                    <p className="text-xs mt-1" style={{ color: "var(--link)" }}>
                      読了時間 約 {a.readingTime} 分 →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 他の記事 */}
        <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
          <Link href="/articles" className="text-sm hover:underline" style={{ color: "var(--link)" }}>
            ← 解説記事一覧に戻る
          </Link>
        </div>

        {/* フッター */}
        <div className="mt-6 pt-4 border-t text-xs space-y-1 text-center" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
          <p>数値はすべて公開統計に基づきます。投資判断への利用は自己責任でお願いします。</p>
          <p>
            <Link href="/about" className="hover:underline" style={{ color: "var(--muted)" }}>データソース</Link>
            &nbsp;|&nbsp;
            <Link href="/privacy" className="hover:underline" style={{ color: "var(--muted)" }}>プライバシーポリシー</Link>
            &nbsp;|&nbsp;
            <Link href="/contact" className="hover:underline" style={{ color: "var(--muted)" }}>お問い合わせ</Link>
          </p>
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
      <div className="text-sm leading-relaxed space-y-3 min-w-0 break-words" style={{ color: "var(--text)", overflowWrap: "anywhere" }}>
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
