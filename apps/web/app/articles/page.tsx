import type { Metadata } from "next";
import { ArticleList } from "@/components/ArticleList";
import { ARTICLES } from "@/lib/articles";
import { BASE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "日本経済の解説記事一覧 — 実質賃金・消費税・円安をデータで読む | KeizaiMap",
  description: `実質賃金・消費税・円安・社会保険料・少子化など、日本経済30年の論点を公的統計データで解説する全${ARTICLES.length}本の記事一覧。グラフと数字で「なぜ生活が苦しくなったのか」を読み解きます。`,
  alternates: { canonical: "/articles" },
  openGraph: {
    title: "日本経済の解説記事一覧 | KeizaiMap",
    description: `実質賃金・消費税・円安・社会保険料など、日本経済30年の論点をデータで解説する全${ARTICLES.length}本の記事一覧。`,
    url: `${BASE_URL}/articles`,
    images: [{ url: "/og", width: 1200, height: 630 }],
  },
};

export default function ArticlesPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "KeizaiMap", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "解説記事", item: `${BASE_URL}/articles` },
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "KeizaiMap 解説記事一覧",
    numberOfItems: ARTICLES.length,
    itemListElement: ARTICLES.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: a.title,
      url: `${BASE_URL}/articles/${a.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <ArticleList />
    </>
  );
}
