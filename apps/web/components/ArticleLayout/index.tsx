import Link from "next/link";
import { LineChart } from "lucide-react";
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

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${y}年${Number(m)}月${Number(d)}日`;
}

export function ArticleLayout({ title, description, readingTime, tags, slug, children }: Props) {
  const article = slug ? ARTICLES.find((a) => a.slug === slug) : undefined;
  const ctaHref = article?.presetQuery ? `/${article.presetQuery}` : "/";
  const related = slug
    ? ARTICLES.filter(
        (a) => a.slug !== slug && tags?.some((t) => a.tags.includes(t))
      ).slice(0, 3)
    : [];
  const meta = slug ? ARTICLES.find((a) => a.slug === slug) : undefined;
  return (
    <main
      id="main"
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
          <div className="text-xs flex flex-wrap gap-x-3 gap-y-1" style={{ color: "var(--muted)" }}>
            {meta && (
              <>
                <span>
                  公開: <time dateTime={meta.publishedAt}>{formatDate(meta.publishedAt)}</time>
                </span>
                {meta.updatedAt !== meta.publishedAt && (
                  <span>
                    更新: <time dateTime={meta.updatedAt}>{formatDate(meta.updatedAt)}</time>
                  </span>
                )}
              </>
            )}
            <span>読了時間 約 {readingTime} 分</span>
          </div>
        </header>

        {/* 本文 */}
        <div className="space-y-6">{children}</div>

        {/* CTA — 記事のテーマに応じた指標・期間のプリセットで開く */}
        <div
          className="mt-10 rounded-xl border p-5 text-center"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        >
          <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
            {article?.presetQuery
              ? "この記事の指標・期間がそのまま表示される設定で KeizaiMap を開きます"
              : "KeizaiMap でこの指標を実際のデータで確認できます"}
          </p>
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: "var(--accent-btn)", color: "#fff" }}
          >
            <LineChart size={16} aria-hidden />
            この記事の設定で KeizaiMap を開く
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

        {/* データ出典 */}
        <div className="mt-6 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-xs font-semibold mb-3" style={{ color: "var(--muted)" }}>
            データ出典・免責
          </h2>
          <div
            className="rounded-xl p-4 text-xs leading-relaxed space-y-2"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--muted)" }}
          >
            <p>
              本記事の数値は <strong>2024年時点</strong> の公開統計に基づきます。
              最新値は <Link href="/" className="underline hover:opacity-80" style={{ color: "var(--link)" }}>KeizaiMap ダッシュボード</Link> で確認できます（自動指標は毎月1日更新）。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pt-1">
              {[
                { label: "実質賃金・出生数・社会保険料", org: "厚生労働省", href: "https://www.mhlw.go.jp/toukei_hakusho/toukei/" },
                { label: "消費者物価指数（CPI）", org: "総務省統計局", href: "https://www.stat.go.jp/data/cpi/" },
                { label: "税収・国債残高", org: "財務省", href: "https://www.mof.go.jp/tax_policy/summary/condition/a02.htm" },
                { label: "USD/JPY 為替レート", org: "日本銀行", href: "https://www.stat-search.boj.or.jp/" },
                { label: "住宅価格指数", org: "国土交通省", href: "https://www.mlit.go.jp/totikensangyo/totikensangyo_fr4_000043.html" },
                { label: "G7 実質賃金・物価比較", org: "OECD", href: "https://stats.oecd.org/" },
              ].map(({ label, org, href }) => (
                <div key={label} className="flex items-baseline gap-1">
                  <span className="shrink-0" style={{ color: "var(--muted)" }}>・</span>
                  <span>{label}：</span>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80" style={{ color: "var(--link)" }}>
                    {org}
                  </a>
                </div>
              ))}
            </div>
            <p className="pt-1">
              データ集計ロジックは
              <a href="https://github.com/Soshi-1114/keizai-map" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80 mx-1" style={{ color: "var(--link)" }}>
                GitHub
              </a>
              で公開しています。誤りを発見した場合は
              <Link href="/contact" className="underline hover:opacity-80 mx-1" style={{ color: "var(--link)" }}>
                お問い合わせ
              </Link>
              ください。
            </p>
          </div>
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
