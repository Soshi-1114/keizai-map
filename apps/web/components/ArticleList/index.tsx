"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ARTICLES, type ArticleMeta } from "@/lib/articles";

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

  // 公開中（検索エンジンに index される）と準備中（noindex）で分離。
  // 新規ドメインの索引予算を強い記事に集中させるため一部を一時的に noindex 化している。
  const liveArticles = filtered.filter((a) => !a.noindex);
  const draftArticles = filtered.filter((a) => a.noindex);

  return (
    <main
      id="main"
      className="min-h-screen py-8 px-4 overflow-x-hidden"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="mx-auto min-w-0" style={{ maxWidth: 720 }}>
        {/* ナビ */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="経済地図 ホーム">
            <span className="seal shrink-0" style={{ width: 30, height: 30, fontSize: 16 }} aria-hidden>
              経
            </span>
            <span className="font-mono text-xs tracking-wider" style={{ color: "var(--muted)" }}>
              ← KEIZAIMAP
            </span>
          </Link>
          <ThemeToggle />
        </div>

        {/* ヘッダー */}
        <header className="mb-8 pb-7 border-b" style={{ borderColor: "var(--border)" }}>
          <p className="eyebrow mb-3">読みもの / READINGS</p>
          <h1 className="font-display mb-2" style={{ fontSize: "clamp(28px, 6vw, 40px)", fontWeight: 700 }}>
            解説記事
          </h1>
          <p className="font-mono text-xs mb-5" style={{ color: "var(--muted)" }}>
            全{ARTICLES.length}本 ／ 公的統計だけで日本経済35年を読む
          </p>
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
            <p>
              KeizaiMap は「なぜ自分たちの生活は30年で楽にならなかったのか」を、感情論ではなく公的統計データだけで読み解くために作りました。日本銀行の為替・国債、厚生労働省の毎月勤労統計、総務省の消費者物価指数、財務省の税収・国債残高、人口動態統計など、35年分の一次データを一画面で重ねて確認できます。
            </p>
            <p>
              「数字は嘘をつかないが、切り取り方で印象は変わる」──という前提に立ち、すべての記事で複数指標を並べ、出典URLと取得方法を明示しています。賃金が上がらない理由も、円安が進む構造も、ひとつの数字ではなく組み合わせで初めて見えてきます。
            </p>
          </div>
          <div
            className="mt-6 rounded-lg border overflow-hidden relative"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <span className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: "var(--vermilion-seal)" }} aria-hidden />
            <div className="p-5 pl-6">
              <p className="eyebrow mb-3">はじめの3本 / START HERE</p>
              <ul className="space-y-2.5">
                {[
                  { href: "/articles/real-wages", label: "実質賃金とは？1990〜2025年の推移をデータで解説" },
                  { href: "/articles/abenomics-real-wages-analysis", label: "アベノミクスで実質賃金は上がったのか？" },
                  { href: "/articles/money-value-time-comparison", label: "30年前の月収30万円は今いくら？物価で換算する実質価値" },
                ].map(({ href, label }, i) => (
                  <li key={href} className="flex items-baseline gap-3">
                    <span className="font-mono text-xs shrink-0" style={{ color: "var(--vermilion)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Link
                      href={href}
                      className="font-display text-[15px] leading-snug hover:text-[var(--link)] transition-colors"
                      style={{ fontWeight: 600 }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
                backgroundColor: selectedTag === null ? "var(--indigo-tint)" : "transparent",
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
                    backgroundColor: active ? "var(--indigo-tint)" : "transparent",
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
        {filtered.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: "var(--muted)" }}>
            該当する記事がありません
          </p>
        ) : (
          <>
            {liveArticles.length > 0 && (
              <section aria-labelledby="live-section-heading" className="mb-8">
                <h2 id="live-section-heading" className="eyebrow mb-4" style={{ color: "var(--muted)" }}>
                  公開中 / {String(liveArticles.length).padStart(2, "0")}
                </h2>
                <div className="space-y-4 min-w-0">
                  {liveArticles.map((article) => (
                    <ArticleCard
                      key={article.slug}
                      article={article}
                      selectedTag={selectedTag}
                    />
                  ))}
                </div>
              </section>
            )}
            {draftArticles.length > 0 && (
              <section aria-labelledby="draft-section-heading">
                <h2 id="draft-section-heading" className="eyebrow mb-2" style={{ color: "var(--muted)" }}>
                  準備中 / {String(draftArticles.length).padStart(2, "0")}
                </h2>
                <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
                  以下の記事は内容を磨いている途中で、現在は検索エンジンに掲載していません。記事の閲覧は通常通り可能です。
                </p>
                <div className="space-y-4 min-w-0">
                  {draftArticles.map((article) => (
                    <ArticleCard
                      key={article.slug}
                      article={article}
                      selectedTag={selectedTag}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function ArticleCard({
  article,
  selectedTag,
}: {
  article: ArticleMeta;
  selectedTag: string | null;
}) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block rounded-xl border p-5 transition-colors hover:border-[var(--link)] min-w-0"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="flex gap-2 flex-wrap mb-2.5 min-w-0">
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-[11px] px-2 py-0.5 rounded border tracking-wide whitespace-nowrap"
            style={{
              borderColor: tag === selectedTag ? "var(--link)" : "var(--border)",
              color: tag === selectedTag ? "var(--link)" : "var(--muted)",
              backgroundColor: tag === selectedTag ? "var(--indigo-tint)" : "var(--bg)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      <h3
        className="font-display text-lg mb-2 leading-snug break-words transition-colors group-hover:text-[var(--link)]"
        style={{ fontWeight: 700, overflowWrap: "break-word" }}
      >
        {article.title}
      </h3>
      <p
        className="text-[13px] leading-relaxed mb-3 break-words"
        style={{ color: "var(--muted)", overflowWrap: "break-word" }}
      >
        {article.description}
      </p>
      <div className="font-mono text-[11px]" style={{ color: "var(--muted)" }}>
        読了 約{article.readingTime}分 <span style={{ color: "var(--link)" }}>→</span>
      </div>
    </Link>
  );
}
