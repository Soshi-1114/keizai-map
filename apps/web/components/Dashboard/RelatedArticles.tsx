"use client";

import { memo } from "react";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import type { IndicatorKey } from "@/lib/types";
import { ARTICLES } from "@/lib/articles";

interface Props {
  activeIndicators: IndicatorKey[];
  yearRange: [number, number];
}

/** 指標 → 関連タグ（記事の tags との照合用）。
 *  記事側のタグ語彙に合わせている。 */
const INDICATOR_TAGS: Record<IndicatorKey, string[]> = {
  wage:      ["実質賃金", "賃金", "生活水準", "手取り", "可処分所得"],
  cpi:       ["物価", "インフレ", "物価高", "実質価値"],
  tax:       ["税収", "消費税", "財政"],
  fx:        ["円安", "為替", "購買力", "ドル建て"],
  nikkei:    ["日経平均", "株高", "投資", "NISA"],
  housing:   ["住宅価格", "不動産", "住宅ローン"],
  debt:      ["国債", "財政赤字", "財政問題", "対外純資産", "金融資産"],
  births:    ["出生数", "少子化", "社会保障"],
  insurance: ["社会保険料", "手取り", "可処分所得", "老後資金"],
};

function RelatedArticlesImpl({ activeIndicators, yearRange }: Props) {
  if (activeIndicators.length === 0) return null;

  // 各記事のスコア = アクティブ指標タグとの一致数 + 期間オーバーラップ補正
  const relevantTags = new Set(activeIndicators.flatMap(k => INDICATOR_TAGS[k] ?? []));

  const scored = ARTICLES.map(article => {
    const matches = article.tags.filter(t => relevantTags.has(t)).length;
    return { article, score: matches };
  })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (scored.length === 0) return null;

  return (
    <section
      aria-labelledby="related-articles-heading"
      className="rounded-xl border p-4 md:p-5"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-baseline justify-between mb-3 gap-2 flex-wrap">
        <h2
          id="related-articles-heading"
          className="inline-flex items-center gap-1.5 text-sm font-semibold"
          style={{ color: "var(--text)" }}
        >
          <Newspaper size={14} aria-hidden />
          この指標をもっと深く知る
        </h2>
        <Link
          href="/articles"
          className="text-xs hover:underline"
          style={{ color: "var(--link)" }}
        >
          解説記事一覧へ →
        </Link>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {scored.map(({ article }) => (
          <li key={article.slug}>
            <Link
              href={`/articles/${article.slug}`}
              className="block h-full rounded-lg border p-3 transition-colors hover:border-[var(--link)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)" }}
            >
              <p
                className="text-sm font-medium leading-snug line-clamp-2"
                style={{ color: "var(--text)" }}
              >
                {article.title}
              </p>
              <p
                className="text-xs mt-2"
                style={{ color: "var(--link)" }}
              >
                読了 約 {article.readingTime} 分 →
              </p>
            </Link>
          </li>
        ))}
      </ul>
      <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>
        現在表示中（{yearRange[0]}〜{yearRange[1]}年）の指標と関連性の高い記事を表示しています。
      </p>
    </section>
  );
}

export const RelatedArticles = memo(RelatedArticlesImpl);

