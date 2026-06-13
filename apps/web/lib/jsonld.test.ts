import { describe, it, expect } from "vitest";

// constants は BASE_URL を import 時に解決するため、テスト全体で値を固定する。
// 環境変数を先にセットしてから lazy import する。
const FIXED_BASE = "https://keizaimap.jp";
process.env.NEXT_PUBLIC_SITE_URL = FIXED_BASE;

import {
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
  generatePageBreadcrumbJsonLd,
  generateFaqPageJsonLd,
  generateOrganizationJsonLd,
  generatePersonJsonLd,
  generateWebSiteJsonLd,
} from "./jsonld";
import { ARTICLES } from "./articles";

describe("generateArticleJsonLd", () => {
  const known = ARTICLES[0];

  it("emits Schema.org Article with required headline/url/image", () => {
    const ld = generateArticleJsonLd({
      title: "テスト記事",
      description: "概要",
      slug: known.slug,
      readingTime: 7,
    });
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("Article");
    expect(ld.headline).toBe("テスト記事");
    expect(ld.url).toBe(`${FIXED_BASE}/articles/${known.slug}`);
    expect(ld.image).toBe(`${FIXED_BASE}/og/article?slug=${known.slug}`);
    expect(ld.timeRequired).toBe("PT7M");
    expect(ld.inLanguage).toBe("ja");
  });

  it("encodes datePublished/dateModified in JST (+09:00) when meta is known", () => {
    const ld = generateArticleJsonLd({
      title: "x", description: "y", slug: known.slug, readingTime: 1,
    });
    expect(ld.datePublished).toBe(`${known.publishedAt}T00:00:00+09:00`);
    expect(ld.dateModified).toBe(`${known.updatedAt}T00:00:00+09:00`);
  });

  it("omits date fields when slug is unknown", () => {
    const ld = generateArticleJsonLd({
      title: "x", description: "y", slug: "non-existent-slug-xyz", readingTime: 1,
    });
    expect("datePublished" in ld).toBe(false);
    expect("dateModified" in ld).toBe(false);
  });

  it("includes keywords (comma-joined) when tags provided", () => {
    const ld = generateArticleJsonLd({
      title: "x", description: "y", slug: known.slug, readingTime: 1,
      tags: ["a", "b", "c"],
    });
    expect(ld.keywords).toBe("a, b, c");
  });

  it("omits keywords when tags missing or empty", () => {
    const noTags = generateArticleJsonLd({
      title: "x", description: "y", slug: known.slug, readingTime: 1,
    });
    const emptyTags = generateArticleJsonLd({
      title: "x", description: "y", slug: known.slug, readingTime: 1, tags: [],
    });
    expect("keywords" in noTags).toBe(false);
    expect("keywords" in emptyTags).toBe(false);
  });

  it("publisher.logo.url points to icon-512", () => {
    const ld = generateArticleJsonLd({
      title: "x", description: "y", slug: known.slug, readingTime: 1,
    });
    expect(ld.publisher.logo.url).toBe(`${FIXED_BASE}/icon-512`);
  });
});

describe("generateBreadcrumbJsonLd", () => {
  it("builds 3-item breadcrumb with resolved article title", () => {
    const known = ARTICLES[0];
    const ld = generateBreadcrumbJsonLd(known.slug);
    expect(ld["@type"]).toBe("BreadcrumbList");
    expect(ld.itemListElement).toHaveLength(3);
    expect(ld.itemListElement[0].position).toBe(1);
    expect(ld.itemListElement[2].name).toBe(known.title);
    expect(ld.itemListElement[2].item).toBe(`${FIXED_BASE}/articles/${known.slug}`);
  });

  it("falls back to slug when article unknown", () => {
    const ld = generateBreadcrumbJsonLd("missing-slug-zzz");
    expect(ld.itemListElement[2].name).toBe("missing-slug-zzz");
  });
});

describe("generatePageBreadcrumbJsonLd", () => {
  it("preserves order and assigns 1-based positions", () => {
    const ld = generatePageBreadcrumbJsonLd([
      { name: "Home", url: "https://example.com/" },
      { name: "Docs", url: "https://example.com/docs" },
    ]);
    expect(ld.itemListElement).toHaveLength(2);
    expect(ld.itemListElement[0].position).toBe(1);
    expect(ld.itemListElement[1].position).toBe(2);
    expect(ld.itemListElement[1].item).toBe("https://example.com/docs");
  });

  it("returns empty itemListElement on empty input", () => {
    const ld = generatePageBreadcrumbJsonLd([]);
    expect(ld.itemListElement).toEqual([]);
  });
});

describe("generateFaqPageJsonLd", () => {
  it("wraps each FAQ into Question/Answer pair", () => {
    const ld = generateFaqPageJsonLd([
      { question: "Q1", answer: "A1" },
      { question: "Q2", answer: "A2" },
    ]);
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.mainEntity).toHaveLength(2);
    expect(ld.mainEntity[0]["@type"]).toBe("Question");
    expect(ld.mainEntity[0].name).toBe("Q1");
    expect(ld.mainEntity[0].acceptedAnswer["@type"]).toBe("Answer");
    expect(ld.mainEntity[0].acceptedAnswer.text).toBe("A1");
  });
});

describe("generateOrganizationJsonLd", () => {
  it("includes name/url/logo with KeizaiMap branding", () => {
    const ld = generateOrganizationJsonLd();
    expect(ld["@type"]).toBe("Organization");
    expect(ld.name).toBe("KeizaiMap");
    expect(ld.url).toBe(FIXED_BASE);
    expect(ld.logo.url).toBe(`${FIXED_BASE}/icon-512`);
    expect(ld.sameAs).toContain("https://github.com/Soshi-1114/keizai-map");
  });
});

describe("generatePersonJsonLd", () => {
  it("includes operator identity with @id anchor", () => {
    const ld = generatePersonJsonLd();
    expect(ld["@type"]).toBe("Person");
    expect(ld["@id"]).toBe(`${FIXED_BASE}/about#operator`);
    expect(ld.worksFor.url).toBe(FIXED_BASE);
  });
});

describe("generateWebSiteJsonLd", () => {
  it("includes WebSite type and KeizaiMap publisher", () => {
    const ld = generateWebSiteJsonLd();
    expect(ld["@type"]).toBe("WebSite");
    expect(ld.inLanguage).toBe("ja");
    expect(ld.publisher.name).toBe("KeizaiMap");
  });
});
