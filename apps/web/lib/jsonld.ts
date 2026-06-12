import { BASE_URL } from "@/lib/constants";
import { ARTICLES } from "@/lib/articles";

export function generateArticleJsonLd({
  title,
  description,
  slug,
  readingTime,
  tags,
}: {
  title: string;
  description: string;
  slug: string;
  readingTime: number;
  tags?: string[];
}) {
  const baseUrl = BASE_URL;
  const articleUrl = `${baseUrl}/articles/${slug}`;
  const meta = ARTICLES.find((a) => a.slug === slug);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    url: articleUrl,
    image: `${baseUrl}/og/article?slug=${slug}`,
    ...(meta && {
      datePublished: meta.publishedAt,
      dateModified: meta.updatedAt,
    }),
    timeRequired: `PT${readingTime}M`,
    inLanguage: "ja",
    author: {
      "@type": "Person",
      "@id": `${baseUrl}/about#operator`,
      name: "Soshi",
      url: "https://github.com/Soshi-1114",
    },
    publisher: {
      "@type": "Organization",
      name: "KeizaiMap",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/icon-512`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    ...(tags && tags.length > 0 && { keywords: tags.join(", ") }),
  };
}

export function generateBreadcrumbJsonLd(slug: string) {
  const baseUrl = BASE_URL;
  const articleTitle = ARTICLES.find((a) => a.slug === slug)?.title ?? slug;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "KeizaiMap",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "解説記事",
        item: `${baseUrl}/articles`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: articleTitle,
        item: `${baseUrl}/articles/${slug}`,
      },
    ],
  };
}

export function generatePageBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFaqPageJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateOrganizationJsonLd() {
  const baseUrl = BASE_URL;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KeizaiMap",
    description: "数字で見る、日本の30年。賃金・物価・税収・為替の推移を政権帯とともに可視化。",
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/icon-512`,
      width: 512,
      height: 512,
    },
    foundingDate: "2026-06",
    sameAs: [
      "https://github.com/Soshi-1114/keizai-map",
      "https://github.com/Soshi-1114",
    ],
  };
}

export function generatePersonJsonLd() {
  const baseUrl = BASE_URL;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}/about#operator`,
    name: "Soshi",
    alternateName: "@Soshi-1114",
    url: "https://github.com/Soshi-1114",
    sameAs: ["https://github.com/Soshi-1114"],
    jobTitle: "ソフトウェアエンジニア",
    knowsAbout: ["日本経済", "公的統計", "データ可視化", "ソフトウェア開発"],
    worksFor: {
      "@type": "Organization",
      name: "KeizaiMap",
      url: baseUrl,
    },
  };
}

export function generateWebSiteJsonLd() {
  const baseUrl = BASE_URL;

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "KeizaiMap",
    url: baseUrl,
    inLanguage: "ja",
    description: "数字で見る、日本の30年。賃金・物価・税収・為替の推移を政権帯とともに可視化する経済データダッシュボード。",
    publisher: {
      "@type": "Organization",
      name: "KeizaiMap",
      url: baseUrl,
    },
  };
}
