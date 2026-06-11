import type { Metadata } from "next";
import Script from "next/script";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd } from "@/lib/jsonld";

const SLUG = "nikkei-vs-wages";

export const metadata: Metadata = {
  title: "日経平均は最高値なのに、なぜ生活は豊かにならないのか | KeizaiMap",
  description: "2024年、日経平均は1990年比で55%以上上昇している。しかし同じ期間の実質賃金は99.2と横ばいだ。株高の恩恵はなぜ家計に届かないのか。データで構造を読み解く。",
  openGraph: {
    images: [{ url: "/og/article?slug=nikkei-vs-wages" }],
  },
};

export default function NikkeiVsWagesPage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "日経平均は最高値なのに、なぜ生活は豊かにならないのか",
    description: "日経平均が上昇を続ける一方、実質賃金は横ばいのまま。株高の恩恵はなぜ家計に届かないのか。データで構造を読み解く。",
    slug: SLUG,
    readingTime: 5,
    tags: ["日経平均", "株高", "格差"],
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
        title="日経平均は最高値なのに、なぜ生活は豊かにならないのか"
        description="2024年、日経平均は1990年比で55%以上上昇している。しかし同じ期間の実質賃金は99.2と横ばいだ。株高の恩恵はなぜ家計に届かないのか。データで構造を読み解く。"
        readingTime={5}
        tags={["日経平均", "株高", "格差"]}
      >
        <Section heading="株価と賃金の34年間">
          <p>
            2024年2月、日経平均株価は1989年末のバブル最高値（38,915円）を34年ぶりに更新し、
            以降も上昇を続けた。メディアは「株価最高値」と連日報じた。
          </p>
          <p>
            では、その恩恵は家計に届いているのだろうか。
            KeizaiMapのデータで1990年を100として並べると、答えは明確だ。
          </p>

          <DataBox
            items={[
              { label: "日経平均（1990=100）", value: "155.4", note: "55%以上上昇", color: "#8B5CF6" },
              { label: "実質賃金（1990=100）", value: "99.2",  note: "ほぼ横ばい",   color: "#ef4444" },
              { label: "CPI（1990=100）",      value: "119.9", note: "約20%上昇",   color: "#D97706" },
            ]}
          />

          <p>
            株価は55%超上昇した一方、実質賃金はほぼ34年前と同水準だ。
            さらに物価は約2割上がっているため、生活実感としての豊かさは増していない。
          </p>
        </Section>

        <Section heading="なぜ株高が家計に届かないのか">
          <p>
            その主な理由は「株式保有の偏在」だ。
          </p>
          <div
            className="rounded-xl border p-4 space-y-3 my-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            {[
              {
                title: "日本の株式保有率の低さ",
                desc: "日本の個人の株式保有率はアメリカと比べて低い。多くの家計は預貯金中心であり、株高の直接的な恩恵を受けにくい。",
              },
              {
                title: "機関投資家・外国人投資家が主役",
                desc: "日経平均を動かす主体は年金基金（GPIF）、日銀のETF購入、外国人機関投資家だ。個人の資産形成への波及は間接的で限定的になりやすい。",
              },
              {
                title: "企業収益が内部留保に積み上がる",
                desc: "株高の恩恵を受けた企業が利益を設備投資・賃上げに回す「トリクルダウン」が想定通りに機能しなかった。日本企業の内部留保は2020年代に500兆円を超えたとされる。",
              },
            ].map(({ title, desc }) => (
              <div key={title} className="border-l-2 pl-3 py-1" style={{ borderColor: "#8B5CF6" }}>
                <div className="text-sm font-semibold mb-0.5">{title}</div>
                <div className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{desc}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section heading="アベノミクス期（2012〜2020）の典型例">
          <p>
            この構造が最も顕著に現れたのがアベノミクス期だ。
          </p>
          <DataBox
            items={[
              { label: "日経平均変化率", value: "+57.6%", note: "2012→2020", color: "#8B5CF6" },
              { label: "実質賃金変化率", value: "▼0.9%",  note: "97.4→96.5",  color: "#ef4444" },
              { label: "税収変化率",     value: "+38.5%", note: "43.9→60.8兆円", color: "#22c55e" },
            ]}
          />
          <p>
            株価と税収は大幅に上昇したが、実質賃金は下落した。
            企業収益の改善が賃上げや消費拡大につながる「好循環」は、
            少なくとも実質賃金の観点からは確認しにくい結果となった。
          </p>
        </Section>

        <Section heading="NISAと資産形成">
          <p>
            こうした現実を踏まえ、政府は2024年に新NISAを拡充し、個人の資産形成を後押ししている。
            「貯蓄から投資へ」のシフトが進めば、将来的には株高の恩恵が家計に届きやすくなる可能性がある。
          </p>
          <p>
            一方で、投資元本のない低所得層には恩恵が届きにくいという構造的な課題も指摘される。
            KeizaiMapで株価・賃金・物価の推移を並べて確認しながら、
            「数字の上の豊かさ」と「生活実感」のギャップを自分で検証してほしい。
          </p>
        </Section>
      </ArticleLayout>
    </>
  );
}
