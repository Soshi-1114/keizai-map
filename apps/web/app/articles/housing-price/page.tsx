import type { Metadata } from "next";
import Script from "next/script";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { LiveDataBox } from "@/components/LiveDataBox";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd } from "@/lib/jsonld";

const SLUG = "housing-price";

export const metadata: Metadata = {
  title: "なぜ若者は家を買えないのか ─ 住宅価格と賃金の34年をデータで見る | KeizaiMap",
  description: "バブル崩壊で一度は下落した住宅価格は、アベノミクス以降に再上昇。一方で実質賃金は横ばいのまま。住宅価格指数と賃金・金利の動きを重ねてデータで読み解く。",
  openGraph: {
    title: "なぜ若者は家を買えないのか ─ 住宅価格と賃金の34年をデータで見る",
    images: [{ url: "/og/article?slug=housing-price" }],
  },
};

export default function HousingPricePage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "なぜ若者は家を買えないのか ─ 住宅価格と賃金の34年をデータで見る",
    description: "バブル崩壊で一度は下落した住宅価格は、アベノミクス以降に再上昇。実質賃金は横ばいのまま。住宅価格指数と賃金の動きをデータで読み解く。",
    slug: SLUG,
    readingTime: 5,
    tags: ["住宅価格", "不動産", "賃金"],
  });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(SLUG);
  const organizationJsonLd = generateOrganizationJsonLd();

  return (
    <>
      <Script id="article-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <Script id="breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Script id="org-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <ArticleLayout
        slug={SLUG}
        title="なぜ若者は家を買えないのか ─ 住宅価格と賃金の34年をデータで見る"
        description="バブル崩壊で一度は下落した住宅価格は、アベノミクス以降に再上昇。一方で実質賃金は横ばいのまま。住宅価格指数と賃金・金利の動きを重ねてデータで読み解く。"
        readingTime={5}
        tags={["住宅価格", "不動産", "賃金"]}
      >
        <Section heading="住宅価格指数の34年間">
          <p>
            KeizaiMapでは国土交通省「不動産価格指数」をもとに、1990年を100とした住宅価格指数を確認できる。
            バブル崩壊後の急落から、アベノミクス期以降の回復まで、
            日本の住宅市場の変遷がデータで見えてくる。
          </p>

          <LiveDataBox
            items={[
              { year: 1990, key: "housing", label: "1990年（バブル）" },
              { year: 2000, key: "housing", label: "2000年" },
              { year: 2012, key: "housing", label: "2012年（底値圏）" },
              { year: 2024, key: "housing", label: "2024年" },
            ]}
          />

          <p>
            バブル崩壊（1991年）から2012年頃にかけて、住宅価格は1990年比で約26%下落した。
            その後、アベノミクスによる低金利・都市再開発・外国人投資家の流入などを背景に、
            特に都市部（東京・大阪）を中心に価格が回復傾向に転じた。
          </p>
        </Section>

        <Section heading="住宅価格が上がるのに、賃金は上がらない">
          <p>
            問題は、住宅価格の回復と実質賃金の推移が乖離していることだ。
          </p>

          <LiveDataBox
            items={[
              { year: 1990, key: "wage", label: "賃金 1990年" },
              { year: 2024, key: "wage", label: "賃金 2024年" },
              { year: 1990, key: "housing", label: "住宅 1990年" },
              { year: 2024, key: "housing", label: "住宅 2024年" },
            ]}
          />

          <p>
            実質賃金はほぼ横ばいのまま、住宅価格だけが（都市部では特に大幅に）上昇している。
            「賃金に対する住宅価格」という意味での「買いやすさ（affordability）」は、
            バブル期よりむしろ厳しくなっているエリアも多い。
          </p>
        </Section>

        <Section heading="住宅を買いにくくなった3つの構造的要因">
          <div
            className="rounded-xl border p-4 space-y-3 my-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            {[
              {
                title: "①都市集中と地方格差",
                desc: "人口が東京・大阪・名古屋などの大都市圏に集中するほど、需要が集まり都市部の住宅価格を押し上げる。地方では空き家が増える一方、若者が働く都市では手が届かない価格になっている。",
                color: "#EC4899",
              },
              {
                title: "②超低金利が価格を押し上げた副作用",
                desc: "アベノミクス以降の超低金利は、月々の返済額を下げた。これが「買える価格」の上限を引き上げ、不動産価格の上昇を招いた。2024年の日銀利上げにより、この構図が変わりつつある。",
                color: "#EC4899",
              },
              {
                title: "③投資・投機需要の流入",
                desc: "低金利環境で資産運用先を求める国内機関投資家や、円安を背景に日本不動産を割安と見た外国人投資家の購入が、実需以上に価格を押し上げた側面がある。",
                color: "#EC4899",
              },
            ].map(({ title, desc, color }) => (
              <div key={title} className="border-l-2 pl-3 py-1" style={{ borderColor: color }}>
                <div className="text-sm font-semibold mb-0.5">{title}</div>
                <div className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{desc}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section heading="2024年以降の利上げと住宅市場">
          <p>
            2024年3月、日本銀行はマイナス金利を解除し、事実上の利上げを開始した。
            住宅ローン金利は上昇傾向に転じており、今後の住宅市場に影響が出るとみられる。
          </p>
          <DataBox
            items={[
              { label: "変動金利型ローン", value: "上昇傾向", note: "2024年以降", color: "#D97706" },
              { label: "実質賃金への影響", value: "要注視", note: "賃上げとの競争", color: "#4F8EF7" },
            ]}
          />
          <p>
            住宅購入の「買いやすさ」が改善するかどうかは、
            金利上昇が住宅価格を引き下げる効果と、賃金上昇のどちらが先行するかにかかっている。
            KeizaiMapで実質賃金・住宅価格指数の推移を並べて、変化を継続的に観察してほしい。
          </p>
        </Section>
      </ArticleLayout>
    </>
  );
}
