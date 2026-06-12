import type { Metadata } from "next";
import { ARTICLES } from "@/lib/articles";

/**
 * 記事ページの openGraph 設定を生成する。
 * type/publishedTime/modifiedTime をARTICLESから引いて補完する。
 */
export function articleOpenGraph(slug: string): NonNullable<Metadata["openGraph"]> {
  const meta = ARTICLES.find((a) => a.slug === slug);
  if (!meta) throw new Error(`articleOpenGraph: unknown slug "${slug}"`);
  return {
    type: "article",
    publishedTime: `${meta.publishedAt}T00:00:00+09:00`,
    modifiedTime: `${meta.updatedAt}T00:00:00+09:00`,
    authors: ["KeizaiMap"],
    tags: meta.tags,
    images: [{ url: `/og/article?slug=${slug}` }],
  };
}
