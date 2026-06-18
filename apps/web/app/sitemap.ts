import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/articles";
import { BASE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  // 記事の最新更新日を / と /articles の lastModified に使う
  const latestUpdate = ARTICLES.reduce(
    (max, a) => (a.updatedAt > max ? a.updatedAt : max),
    ARTICLES[0].updatedAt
  );

  const mainRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(latestUpdate),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/articles`,
      lastModified: new Date(latestUpdate),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // noindex 記事は sitemap からも除外し、Google にクロール優先度シグナルを与えない
  const articleRoutes: MetadataRoute.Sitemap = ARTICLES.filter((a) => !a.noindex).map(
    (article) => ({
      url: `${BASE_URL}/articles/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  return [...mainRoutes, ...articleRoutes];
}
