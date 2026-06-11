import { MainView } from "@/components/MainView";

export default function Home({ searchParams }: { searchParams: Record<string, string | string[]> }) {
  const params = {
    range: typeof searchParams.range === "string" ? searchParams.range : undefined,
    indicators: typeof searchParams.indicators === "string" ? searchParams.indicators : undefined,
    events: typeof searchParams.events === "string" ? searchParams.events : undefined,
  };

  return <MainView initialParams={params} />;
}
