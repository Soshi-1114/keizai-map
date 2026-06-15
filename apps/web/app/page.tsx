import { MainView } from "@/components/MainView";
import {
  generateAllDatasetJsonLd,
  generateOrganizationJsonLd,
  generateWebSiteJsonLd,
} from "@/lib/jsonld";

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
