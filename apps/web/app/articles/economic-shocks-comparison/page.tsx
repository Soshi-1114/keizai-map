import type { Metadata } from "next";
import Script from "next/script";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd } from "@/lib/jsonld";

const SLUG = "economic-shocks-comparison";

export const metadata: Metadata = {
  title: "リーマンショックとコロナ禍 ─ 2つの経済危機が日本人の生活に与えた傷跡 | KeizaiMap",
  description: "2008年のリーマンショックと2020年のコロナ禍。2つの危機で実質賃金・株価・為替・物価はどう動いたか。回復の速さ・深さをデータで比較する。",
  openGraph: {
    images: [{ url: "/og/article?slug=economic-shocks-comparison" }],
  },
};

export default function EconomicShocksComparisonPage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "リーマンショックとコロナ禍 ─ 2つの経済危機が日本人の生活に与えた傷跡",
    description: "2008年のリーマンショックと2020年のコロナ禍。2つの危機で経済指標はどう動いたか。回復の速さ・深さをデータで比較する。",
    slug: SLUG,
    readingTime: 6,
    tags: ["リーマンショック", "コロナ禍", "経済危機"],
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
        title="リーマンショックとコロナ禍 ─ 2つの経済危機が日本人の生活に与えた傷跡"
        description="2008年のリーマンショックと2020年のコロナ禍。2つの危機で実質賃金・株価・為替・物価はどう動いたか。回復の速さ・深さをデータで比較する。"
        readingTime={6}
        tags={["リーマンショック", "コロナ禍", "経済危機"]}
      >
        <Section heading="2つの経済危機の概要">
          <p>
            2008年のリーマンショックと2020年のコロナ禍は、どちらも戦後最大級の経済ショックとして記録されている。
            しかしその性質、政策対応、そして回復の軌跡は大きく異なる。
          </p>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4"
          >
            {[
              {
                title: "リーマンショック（2008年）",
                color: "#E05C5C",
                items: ["発端：米国サブプライムローン問題", "性質：金融危機→実体経済悪化", "日本への影響：輸出急減・円高・株暴落", "政府対応：財政出動・雇用維持策"],
              },
              {
                title: "コロナ禍（2020年）",
                color: "#4FD9A0",
                items: ["発端：新型コロナウイルスの世界的感染", "性質：需要急減・サプライチェーン断絶", "日本への影響：飲食・観光・イベント壊滅", "政府対応：給付金・雇用調整助成金・日銀緩和"],
              },
            ].map(({ title, color, items }) => (
              <div key={title} className="rounded-xl border p-4" style={{ backgroundColor: "var(--card)", borderColor: color + "60" }}>
                <div className="text-sm font-bold mb-2" style={{ color }}>{title}</div>
                <ul className="space-y-1">
                  {items.map(item => (
                    <li key={item} className="text-xs" style={{ color: "var(--muted)" }}>・{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section heading="実質賃金への影響比較">
          <p>
            KeizaiMapのデータで、2つのショック前後の実質賃金（1990=100）を比較する。
          </p>

          <DataBox
            items={[
              { label: "リーマン前（2006）", value: "103.4", color: "#4F8EF7" },
              { label: "底（2010）",         value: "98.5",  note: "▲4.7pt", color: "#ef4444" },
              { label: "コロナ前（2018）",   value: "99.1",  color: "#4F8EF7" },
              { label: "底（2020）",         value: "96.5",  note: "▲2.6pt", color: "#ef4444" },
            ]}
          />

          <p>
            リーマンショック後の実質賃金の落ち込みはコロナ禍より大きく、回復にも時間がかかった。
            リーマン後の2年間で約4.7pt低下したのに対し、コロナ禍では約2.6ptの低下に留まった。
            これは政府の大規模給付（雇用調整助成金、給付金）が下支えした結果とみられる。
          </p>
        </Section>

        <Section heading="株価・為替への影響比較">
          <DataBox
            items={[
              { label: "リーマン時 株価下落", value: "▲40%超", note: "2006→2008 Nikkei指数", color: "#ef4444" },
              { label: "コロナ時 株価下落",   value: "▲25%程度", note: "2018→2020 一時的",   color: "#D97706" },
              { label: "リーマン後 円高",     value: "103.4→87.8円", note: "2008→2010",       color: "#4FD9A0" },
              { label: "コロナ後 為替",       value: "110.4→106.8円", note: "限定的変動",     color: "#4FD9A0" },
            ]}
          />
          <p>
            リーマンショックでは、世界的なリスク回避と日本の経常黒字への評価から円高が急進した。
            一方コロナ禍では、日米ともに大規模緩和を実施したため、為替の変動は限定的だった。
          </p>
        </Section>

        <Section heading="2つのショックが残した教訓">
          <p>
            リーマンショックは「金融システムへの信頼崩壊」が実体経済を直撃したショックだ。
            回復には5〜6年を要し、その間に失われた雇用・収入は深刻だった。
          </p>
          <p>
            コロナ禍は「行動制限による需要蒸発」という異質なショックだった。
            前例のない財政出動と金融緩和の組み合わせで、株価は比較的早期に回復したが、
            その後の円安・物価上昇という「副作用」を招いた面もある。
          </p>
          <p>
            KeizaiMapの「ショック比較」モードでは、この2つの危機に加えてバブル崩壊も含めた
            3つのショックを同一グラフで比較できる。それぞれの深さ・回復の形を自分で確認してほしい。
          </p>
        </Section>
      </ArticleLayout>
    </>
  );
}
