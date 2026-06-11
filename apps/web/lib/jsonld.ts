export function generateArticleJsonLd({
  title,
  description,
  slug,
  readingTime,
  tags,
  publishedDate = new Date().toISOString(),
}: {
  title: string;
  description: string;
  slug: string;
  readingTime: number;
  tags?: string[];
  publishedDate?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://keizai-map.vercel.app";
  const articleUrl = `${baseUrl}/articles/${slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    url: articleUrl,
    image: `${baseUrl}/og/article?slug=${slug}`,
    datePublished: publishedDate,
    dateModified: publishedDate,
    timeRequired: `PT${readingTime}M`,
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
        url: `${baseUrl}/og`,
      },
    },
    mainEntity: {
      "@type": "Article",
      headline: title,
      description: description,
    },
    ...(tags && tags.length > 0 && { keywords: tags.join(", ") }),
  };
}

export function generateBreadcrumbJsonLd(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://keizai-map.vercel.app";

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
        name: slug,
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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://keizai-map.vercel.app";

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
