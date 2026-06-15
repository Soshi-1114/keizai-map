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

/**
 * 記事の <title> タグ用文字列を返す。seoTitle が設定されていればそれを、
 * 無ければ title をフォールバックとして使う。検索意図語（とは／推移／なぜ／年号）
 * を含む seoTitle で検索結果での視認性を上げる。
 */
export function articleSeoTitle(slug: string): string {
  const meta = ARTICLES.find((a) => a.slug === slug);
  if (!meta) throw new Error(`articleSeoTitle: unknown slug "${slug}"`);
  return meta.seoTitle ?? meta.title;
}
