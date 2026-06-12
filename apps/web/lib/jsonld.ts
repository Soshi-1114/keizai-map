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
      "@type": "Organization",
      name: "KeizaiMap",
      url: baseUrl,
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
    logo: `${baseUrl}/og`,
    sameAs: ["https://github.com/Soshi-1114/keizai-map"],
  };
}
