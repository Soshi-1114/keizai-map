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
        <div className="flex items-center justify-between mb-8">
          <nav className="flex items-center gap-2.5 min-w-0" aria-label="パンくず">
            <Link href="/" aria-label="経済地図 ホーム">
              <span className="seal shrink-0" style={{ width: 30, height: 30, fontSize: 16 }} aria-hidden>
                経
              </span>
            </Link>
            <span className="font-mono text-xs tracking-wider truncate" style={{ color: "var(--muted)" }}>
              <Link href="/" className="hover:text-[var(--link)]">KEIZAIMAP</Link>
              <span className="px-1.5" style={{ color: "var(--border)" }}>/</span>
              <Link href="/articles" className="hover:text-[var(--link)]">解説記事</Link>
            </span>
          </nav>
          <ThemeToggle />
        </div>

        {/* ヘッダー */}
        <header className="mb-9">
          <p className="eyebrow mb-4">解説 / READING</p>
          {tags && (
            <div className="flex gap-2 flex-wrap mb-4">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="font-mono text-[11px] px-2 py-0.5 rounded border tracking-wide"
                  style={{ borderColor: "var(--border)", color: "var(--muted)", backgroundColor: "var(--card)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1
            className="font-display leading-[1.32] mb-4 break-words min-w-0"
            style={{ fontSize: "clamp(24px, 4.6vw, 36px)", fontWeight: 700, overflowWrap: "break-word", wordBreak: "break-word" }}
          >
            {title}
          </h1>
          <p className="text-[15px] leading-relaxed mb-5 break-words min-w-0" style={{ color: "var(--muted)", overflowWrap: "anywhere" }}>
            {description}
          </p>
          <div className="font-mono text-[11px] flex flex-wrap items-center gap-x-3 gap-y-1 pt-4 border-t" style={{ color: "var(--muted)", borderColor: "var(--border)" }}>
            {meta && (
              <>
                <span>
                  公開 <time dateTime={meta.publishedAt}>{formatDate(meta.publishedAt)}</time>
                </span>
                {meta.updatedAt !== meta.publishedAt && (
                  <span>
                    更新 <time dateTime={meta.updatedAt}>{formatDate(meta.updatedAt)}</time>
                  </span>
                )}
              </>
            )}
            <span style={{ color: "var(--vermilion)" }}>読了 約{readingTime}分</span>
          </div>
        </header>

        {/* 本文 */}
        <div className="space-y-6">{children}</div>

        {/* CTA — 記事のテーマに応じた指標・期間のプリセットで開く */}
        <div
          className="mt-12 rounded-xl border overflow-hidden relative"
          style={{ backgroundColor: "var(--indigo-tint)", borderColor: "var(--border)" }}
        >
          <span className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: "var(--indigo)" }} aria-hidden />
          <div className="p-6 pl-7">
            <p className="eyebrow mb-2">DASHBOARD</p>
            <p className="text-[15px] mb-4 leading-relaxed" style={{ color: "var(--text)" }}>
              {article?.presetQuery
                ? "この記事の指標・期間をそのまま開き、自分の手でグラフを動かせます。"
                : "この指標を、政権の帯とともに実データで確認できます。"}
            </p>
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--accent-btn)", color: "#fff" }}
            >
              ダッシュボードで開く
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        {/* 関連記事 */}
        {related.length > 0 && (
          <div className="mt-10 pt-7 border-t" style={{ borderColor: "var(--border)" }}>
            <p className="eyebrow mb-4">関連する帳 / RELATED</p>
            <div className="space-y-2.5">
              {related.map((a) => (
                <Link
                  key={a.slug}
                  href={`/articles/${a.slug}`}
                  className="group flex items-start gap-3 p-4 rounded-lg border transition-colors hover:border-[var(--link)]"
                  style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-[15px] leading-snug line-clamp-2 transition-colors group-hover:text-[var(--link)]" style={{ fontWeight: 600 }}>
                      {a.title}
                    </p>
                    <p className="font-mono text-[11px] mt-1.5" style={{ color: "var(--muted)" }}>
                      読了 約{a.readingTime}分 <span style={{ color: "var(--link)" }}>→</span>
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
          <p className="eyebrow mb-3">出典・免責 / SOURCES</p>
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
        <h2 className="font-display text-xl md:text-[22px] mb-4 flex items-baseline gap-2.5" style={{ fontWeight: 700 }}>
          <span style={{ color: "var(--vermilion)", fontWeight: 800 }} aria-hidden>
            §
          </span>
          <span className="min-w-0 break-words" style={{ overflowWrap: "anywhere" }}>
            {heading}
          </span>
        </h2>
      )}
      <div
        className="text-[15px] leading-[1.85] space-y-4 min-w-0 break-words"
        style={{ color: "var(--text)", overflowWrap: "anywhere" }}
      >
        {children}
      </div>
    </section>
  );
}

// データ引用ボックス — 等幅の数表として
export function DataBox({
  items,
}: {
  items: { label: string; value: string; note?: string; color?: string }[];
}) {
  return (
    <div
      className="rounded-xl border grid grid-cols-2 md:grid-cols-4 my-5 overflow-hidden"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      {items.map(({ label, value, note, color }) => (
        <div
          key={label}
          className="p-4 border-b md:border-b-0 md:border-r last:border-r-0"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="font-mono text-[10px] tracking-wider uppercase mb-1.5" style={{ color: "var(--muted)" }}>
            {label}
          </div>
          <div
            className="font-mono text-[22px] leading-none tnum"
            style={{ color: color ?? "var(--text)", fontWeight: 600 }}
          >
            {value}
          </div>
          {note && (
            <div className="text-xs mt-1.5" style={{ color: "var(--muted)" }}>
              {note}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
