import type { Metadata } from "next";
import { MainView } from "@/components/MainView";
import {
  generateAllDatasetJsonLd,
  generateOrganizationJsonLd,
  generateWebSiteJsonLd,
} from "@/lib/jsonld";

/**
 * 深リンクのクエリ（indicators / range）に応じて OGP 画像 URL を上書きする。
 * クエリが無ければ layout.tsx 既定の固定 OGP（/og）がそのまま使われる。
 * canonical / og:url は layout の値（クエリ無し）を維持（パラメータ違いで
 * canonical を分けると duplicate-content 扱いの温床になるため）。
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Record<string, string | string[]>;
}): Promise<Metadata> {
  const indicators =
    typeof searchParams.indicators === "string" ? searchParams.indicators : "";
  const range = typeof searchParams.range === "string" ? searchParams.range : "";

  if (!indicators && !range) return {};

  const qs = new URLSearchParams();
  if (indicators) qs.set("indicators", indicators);
  if (range) qs.set("range", range);
  // metadataBase（layout.tsx）が設定済みなので相対パスでも絶対 URL に解決される
  const ogPath = `/og?${qs.toString()}`;

  return {
    openGraph: {
      images: [
        {
          url: ogPath,
          width: 1200,
          height: 630,
          alt: "KeizaiMap — 数字で見る、日本の30年",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogPath],
    },
  };
}

export default function Home({ searchParams }: { searchParams: Record<string, string | string[]> }) {
  const params = {
    range: typeof searchParams.range === "string" ? searchParams.range : undefined,
    indicators: typeof searchParams.indicators === "string" ? searchParams.indicators : undefined,
    events: typeof searchParams.events === "string" ? searchParams.events : undefined,
  };
  const organizationJsonLd = generateOrganizationJsonLd();
  const websiteJsonLd = generateWebSiteJsonLd();
  const datasetJsonLds = generateAllDatasetJsonLd();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      {datasetJsonLds.map((jsonLd) => (
        <script
          key={jsonLd.name}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ))}
      <MainView initialParams={params} />
    </>
  );
}
