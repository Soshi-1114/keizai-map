import { BASE_URL } from "@/lib/constants";
import { ARTICLES } from "@/lib/articles";
import { INDICATOR_CONFIGS, INDICATOR_LAST_YEAR } from "@/lib/data";
import type { IndicatorKey } from "@/lib/types";

/**
 * "YYYY-MM-DD" を JST (+09:00) のISO 8601日時に変換する。
 * Google構造化データで `datePublished`/`dateModified` のタイムゾーン警告を解消する。
 */
function toJstDateTime(date: string): string {
  return `${date}T00:00:00+09:00`;
}

/**
 * JSON-LD 内の文字列値に含まれる `<` を `<` へエスケープして
 * `<script type="application/ld+json">…</script>` 埋め込み時の終了タグ偽装を防ぐ。
 * 現状は静的データのみだが、将来 CMS / 外部入力を受け入れた際の XSS 保険。
 */
function safe(value: string): string {
  return value.replace(/</g, "\\u003c");
}

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
    headline: safe(title),
    description: safe(description),
    url: articleUrl,
    image: `${baseUrl}/og/article?slug=${slug}`,
    ...(meta && {
      datePublished: toJstDateTime(meta.publishedAt),
      dateModified: toJstDateTime(meta.updatedAt),
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
    ...(tags && tags.length > 0 && { keywords: safe(tags.join(", ")) }),
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

// 政府標準利用規約 2.0（CC-BY 4.0 互換）。日本の公的統計の多くがこの規約下で
// 二次利用可能。Dataset.license に指定すると Google Dataset Search で
// 「無償利用可能」のフィルタに引っかかる。
const GOV_LICENSE_URL = "https://www.digital.go.jp/resources/data_terms_of_use";

const INDICATOR_DATASET_SOURCES: Record<
  IndicatorKey,
  { sourceName: string; sourceUrl: string; license?: string }
> = {
  wage:      { sourceName: "厚生労働省 毎月勤労統計調査",          sourceUrl: "https://www.mhlw.go.jp/toukei/itiran/roudou/monthly/index.html",     license: GOV_LICENSE_URL },
  cpi:       { sourceName: "総務省統計局 消費者物価指数",          sourceUrl: "https://www.stat.go.jp/data/cpi/",                                  license: GOV_LICENSE_URL },
  tax:       { sourceName: "財務省 一般会計税収決算",              sourceUrl: "https://www.mof.go.jp/tax_policy/summary/condition/a02.htm",         license: GOV_LICENSE_URL },
  fx:        { sourceName: "日本銀行 時系列統計データ",            sourceUrl: "https://www.stat-search.boj.or.jp/",                                license: GOV_LICENSE_URL },
  nikkei:    { sourceName: "日本経済新聞社 日経平均株価",          sourceUrl: "https://indexes.nikkei.co.jp/nkave/index?type=download" }, // 商用：licenseは設定しない
  housing:   { sourceName: "国土交通省 不動産価格指数",            sourceUrl: "https://www.mlit.go.jp/totikensangyo/totikensangyo_fr4_000043.html", license: GOV_LICENSE_URL },
  debt:      { sourceName: "財務省 国債統計年報",                  sourceUrl: "https://www.mof.go.jp/jgbs/reference/appendix/index.htm",            license: GOV_LICENSE_URL },
  births:    { sourceName: "厚生労働省 人口動態調査",              sourceUrl: "https://www.mhlw.go.jp/toukei/list/81-1a.html",                      license: GOV_LICENSE_URL },
  insurance: { sourceName: "厚生労働省・財務省 国民負担率推移",    sourceUrl: "https://www.mof.go.jp/tax_policy/summary/condition/a04.htm",         license: GOV_LICENSE_URL },
};

/**
 * 指標ごとの Dataset JSON-LD を生成。Google Dataset Search への掲載・
 * 検索結果での Dataset リッチリザルト表示を狙う。
 * 必須プロパティ: name, description（50字以上）。temporalCoverage は
 * ISO 8601 の `YYYY/YYYY` 形式で開始〜終了年を示す。
 */
export function generateDatasetJsonLd(key: IndicatorKey) {
  const cfg = INDICATOR_CONFIGS.find((c) => c.key === key);
  if (!cfg) throw new Error(`generateDatasetJsonLd: unknown key "${key}"`);
  const source = INDICATOR_DATASET_SOURCES[key];
  const startYear = 1990;
  const lastYear = INDICATOR_LAST_YEAR[key];
  const baseUrl = BASE_URL;
  const datasetUrl = `${baseUrl}/?indicators=${key}`;

  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${cfg.label}の推移${cfg.unit}（${startYear}〜${lastYear}）`,
    description: safe(
      `日本の${cfg.label}${cfg.unit}の${startYear}年から${lastYear}年までの年次時系列データ。出典: ${source.sourceName}。KeizaiMap が公的統計から取得・集計し、1990年=100の指数または原系列で可視化したオープンデータセット。政権帯・主要経済イベントとの対比表示にも対応。`,
    ),
    url: datasetUrl,
    sameAs: source.sourceUrl,
    keywords: [cfg.label, "日本経済", "時系列データ", "推移", `${startYear}〜${lastYear}`],
    variableMeasured: cfg.label,
    temporalCoverage: `${startYear}/${lastYear}`,
    spatialCoverage: {
      "@type": "Place",
      name: "日本",
    },
    inLanguage: "ja",
    isAccessibleForFree: true,
    ...(source.license && { license: source.license }),
    creator: {
      "@type": "Organization",
      name: "KeizaiMap",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "KeizaiMap",
      url: baseUrl,
    },
  };
}

/** 全指標の Dataset JSON-LD をまとめて返すユーティリティ。 */
export function generateAllDatasetJsonLd() {
  return INDICATOR_CONFIGS.map((c) => generateDatasetJsonLd(c.key));
}
