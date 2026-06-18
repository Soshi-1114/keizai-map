import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { articleOpenGraph, articleSeoTitle, articleRobots } from "@/lib/article-metadata";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd, generateFaqPageJsonLd } from "@/lib/jsonld";

const SLUG = "national-debt-1000trillion";

export const metadata: Metadata = {
  alternates: { canonical: "/articles/national-debt-1000trillion" },
  title: articleSeoTitle(SLUG),
  description: "1990年に180兆円だった国債残高は2025年度末で1,128兆円。税収80.7兆円の約14倍に膨らんだ借金の実態と、その背景にある財政構造を数字で確認する。",
  openGraph: articleOpenGraph("national-debt-1000trillion"),
  robots: articleRobots(SLUG),
};

export default function NationalDebt1000TrillionPage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "国債残高1,100兆円超 ─ 日本の財政赤字をデータで理解する",
    description: "1990年に180兆円だった国債残高は2025年度末で1,128兆円。税収80.7兆円の約14倍に膨らんだ借金の実態と財政構造を数字で確認する。",
    slug: SLUG,
    readingTime: 5,
    tags: ["国債", "財政赤字", "財政問題"],
  });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(SLUG);
  const organizationJsonLd = generateOrganizationJsonLd();
  const faqJsonLd = generateFaqPageJsonLd([
    {
      question: "日本の国債残高はどれくらいですか？",
      answer: "2025年度末の普通国債残高は1,128兆円（財務省「債務管理リポート2025」）です。1990年の180兆円から35年間で約6.3倍に増加しました。同期間の税収は60.1兆円から80.7兆円（約34%増）まで回復したものの、支出が収入を大きく上回り続けてきた結果として残高は膨張しています。",
    },
    {
      question: "なぜ国債残高はここまで膨らんだのですか？",
      answer: "1990年代はバブル崩壊後の景気対策で公共投資を拡大、2000年代はデフレ・低成長で税収が低水準のまま社会保障費が増大、2010年代は税収回復後も高齢化に伴う社会保障費の増加が続き、2020年代はコロナ禍の大規模給付・物価対策補助金で財政赤字が急拡大しました。",
    },
    {
      question: "国債残高は税収の何倍ですか？",
      answer: "2025年度末の国債残高1,128兆円は、同年の税収80.7兆円（過去最高）の約14年分に相当します。税収をすべて返済に充てても14年かかる規模で、GDP比では約220〜250%と先進国の中で最も高い水準にあります。",
    },
    {
      question: "国債残高が増えると何が問題なのですか？",
      answer: "「将来世代への負担の先送り」と表現されることが多く、現在の社会保障・公共サービスを維持するコストを国債という形で将来に転嫁しているとの見方があります。一方で、日本国債の大半は国内で保有されており対外債務とは性質が異なるという見方もあります。",
    },
  ]);

  return (
    <>
      <script id="article-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script id="breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script id="org-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script id="faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ArticleLayout
        slug={SLUG}
        title="国債残高1,100兆円超 ─ 日本の財政赤字をデータで理解する"
        description="1990年に180兆円だった国債残高は2025年度末で1,128兆円。税収80.7兆円の約14倍に膨らんだ借金の実態と、その背景にある財政構造を数字で確認する。"
        readingTime={5}
        tags={["国債", "財政赤字", "財政問題"]}
      >
        <Section heading="35年で6.3倍に膨らんだ国債残高">
          <p>
            国債とは、政府が歳出を賄うために発行する借金だ。
            税収だけでは支出が賄えない「財政赤字」が続くと、国債残高は年々積み上がっていく。
          </p>

          <DataBox
            items={[
              { label: "1990年", value: "180兆円", color: "#06B6D4" },
              { label: "2000年", value: "636兆円", color: "#06B6D4" },
              { label: "2010年", value: "955兆円", color: "#D97706" },
              { label: "2024年", value: "1,170兆円", color: "#ef4444" },
              { label: "2025年度末", value: "1,128兆円", note: "債務管理リポート2025", color: "#ef4444" },
            ]}
          />

          <p>
            1990年に180兆円だった普通国債残高は、2025年度末には1,128兆円に達した（財務省「債務管理リポート2025」）。
            35年間で約6.3倍という増加だ。
            同期間の税収が60.1兆円から80.7兆円（約34%増）まで回復したものの、
            いかに支出が収入を上回り続けてきたかがわかる。
          </p>
        </Section>

        <Section heading="国債残高が膨らんだ主な理由">
          <div
            className="rounded-xl border p-4 space-y-3 my-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            {[
              {
                period: "1990年代",
                desc: "バブル崩壊後の景気対策として公共投資を拡大。税収は減少し、財政赤字が本格化した。",
              },
              {
                period: "2000年代",
                desc: "デフレ・低成長が続き、税収は低水準のまま。社会保障費の増大が財政を圧迫した。",
              },
              {
                period: "2010年代",
                desc: "アベノミクスで税収は回復したが、高齢化に伴う社会保障費の増加が続き、プライマリーバランスの黒字化は先送りされた。",
              },
              {
                period: "2020年代",
                desc: "コロナ禍の大規模給付・補助金で単年度の財政赤字が急拡大。残高の増加ペースが再び加速した。",
              },
            ].map(({ period, desc }) => (
              <div key={period} className="flex gap-3">
                <span className="shrink-0 text-xs font-bold px-2 py-0.5 rounded whitespace-nowrap" style={{ backgroundColor: "#06B6D420", color: "#06B6D4" }}>
                  {period}
                </span>
                <span className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{desc}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section heading="税収との比較で見える「借金の重さ」">
          <p>
            国債残高の規模を直感的に理解するには、税収との比較が有効だ。
          </p>
          <DataBox
            items={[
              { label: "2025年 税収", value: "80.7兆円", note: "過去最高", color: "#22c55e" },
              { label: "2025年度末 国債残高", value: "1,128兆円", color: "#ef4444" },
              { label: "国債残高 ÷ 税収", value: "約14年分", note: "税収をすべて返済に充てても14年かかる", color: "#ef4444" },
            ]}
          />
          <p>
            GDPとの比率で見ると、日本の政府債務残高はGDP比で約250%程度とされ、
            先進国の中でも最も高い水準にある。
          </p>
        </Section>

        <Section heading="財政問題の先にあるもの">
          <p>
            国債残高の増大は「将来世代への負担の先送り」と表現されることが多い。
            現在の社会保障・公共サービスを維持するコストを、国債という形で将来に転嫁しているという見方だ。
          </p>
          <p>
            一方で、「日本国債の大半は国内で保有されており、対外的な債務とは性質が異なる」
            「日本銀行が国債を保有していることで金利上昇リスクは抑制されている」
            という見方もある。
          </p>
          <p>
            KeizaiMapでは国債残高と税収を並べてグラフで確認できる。
            財政の実態をデータで確認した上で、財政破綻論の是非を考えてほしい。
            （詳しくは「財政破綻は本当に起きるのか」の記事も参照）
          </p>
        </Section>
        <Section heading="関連記事">
          <ul className="list-disc pl-5 space-y-1">
            <li><Link href="/articles/fiscal-collapse-truth" className="underline" style={{ color: "var(--link)" }}>財政破綻は本当に起きるのか ─ 国債・対外純資産からデータで考える</Link></li>
            <li><Link href="/articles/national-debt-per-citizen" className="underline" style={{ color: "var(--link)" }}>「国民一人当たり1,000万円の借金」は本当か？</Link></li>
            <li><Link href="/articles/declining-birthrate-economy" className="underline" style={{ color: "var(--link)" }}>少子化と経済の悪循環 ─ 出生数激減が家計と社会保障に与える影響</Link></li>
          </ul>
        </Section>
      </ArticleLayout>
    </>
  );
}
