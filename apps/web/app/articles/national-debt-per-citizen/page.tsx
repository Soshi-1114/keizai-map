import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { articleOpenGraph } from "@/lib/article-metadata";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd, generateFaqPageJsonLd } from "@/lib/jsonld";

const SLUG = "national-debt-per-citizen";

export const metadata: Metadata = {
  alternates: { canonical: "/articles/national-debt-per-citizen" },
  title: "「国民一人当たり1,000万円の借金」は本当か？─ 国債残高の正しい読み方",
  description:
    "「日本は国民一人当たり約1,000万円の借金を抱えている」というメディア報道は本当か。単純割り算の誤解、対GDP比・対金融資産比など、国債残高を正しく読み解く視点をデータで解説する。",
  openGraph: articleOpenGraph("national-debt-per-citizen"),
};

export default function NationalDebtPerCitizenPage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "「国民一人当たり1,000万円の借金」は本当か？─ 国債残高の正しい読み方",
    description: "単純な割り算の誤解と、対GDP比・対金融資産比など複数の視点を解説。",
    slug: SLUG,
    readingTime: 6,
    tags: ["国債", "財政赤字", "金融資産"],
  });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(SLUG);
  const organizationJsonLd = generateOrganizationJsonLd();
  const faqJsonLd = generateFaqPageJsonLd([
  {
    "question": "「国民一人当たり約1,000万円の借金」は本当ですか？",
    "answer": "この表現は誤解を招きます。国債（1,170兆円）を人口（約1.25億人）で単純に割った数字ですが、国債は政府の負債であり国民が個人として返済する義務はありません。また、国債の約90%は国内投資家が保有しており、対外債務とは性質が異なります。"
  },
  {
    "question": "日本の国債は誰が保有していますか？",
    "answer": "日本国債の保有者の約50%以上は日本銀行、残りの多くは国内の銀行・保険会社・年金基金です。海外投資家の保有比率は約10〜15%程度と低く、ギリシャなどの財政危機とは構造が異なります。"
  },
  {
    "question": "国債残高1,170兆円の正しい見方は？",
    "answer": "絶対額よりもGDP比・税収比・金利動向・プライマリーバランスの4つで見ることが重要です。日本の政府債務のGDP比は約250%で先進国最高水準ですが、対外純資産が488兆円（世界1位）あり、海外への純借金ではありません。"
  }
]);

  return (
    <>
      <script id="article-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script id="breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script id="org-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script id="faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ArticleLayout
        slug={SLUG}
        title="「国民一人当たり1,000万円の借金」は本当か？─ 国債残高の正しい読み方"
        description="「日本は国民一人当たり約1,000万円の借金を抱えている」というメディア報道は本当か。単純割り算の誤解、対GDP比・対金融資産比など、国債残高を正しく読み解く視点をデータで解説する。"
        readingTime={6}
        tags={["国債", "財政赤字", "金融資産"]}
      >
        <Section heading="「国民一人当たりの借金」という決まり文句">
          <p>
            財務省や新聞各社が定期的に発表する「国民一人当たり○○万円の借金」というニュース。
            2024年時点では「<strong>約935万円</strong>」と報道されている。
          </p>
          <p>
            国債残高1,170兆円 ÷ 人口1.25億人 ≒ 936万円。確かに計算は合っている。
            だが、これは<strong>正しい読み方</strong>なのだろうか。
          </p>
        </Section>

        <Section heading="3つの大きな誤解">
          <div
            className="rounded-xl border p-4 space-y-3 my-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            {[
              {
                num: "①",
                title: "国民の借金ではなく、政府の借金である",
                desc: "国債は政府が発行した借金で、国民が個人として返済する義務はない。あくまで政府の負債であり、その返済原資は将来の税収。「国民が借金している」という表現自体が誤解を招く。",
              },
              {
                num: "②",
                title: "国債の保有者の約9割は日本国内（うち半数は日銀）",
                desc: "日本国債の保有者を見ると、日銀が約53%、銀行・生保・年金が約35%、海外投資家は約12%。つまり「政府が国民（の貯蓄）から借りている」構造であり、国内での資金循環の一部だ。",
              },
              {
                num: "③",
                title: "個人金融資産2,200兆円との比較が抜けている",
                desc: "「借金が1,170兆円」と聞くと巨額に感じるが、日本の個人金融資産は約2,200兆円ある。家計が政府に貸している側面もあり、国全体としては純資産国（対外純資産488兆円）。",
              },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex gap-3">
                <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#ef444420", color: "#ef4444" }}>
                  {num}
                </span>
                <div>
                  <div className="text-sm font-semibold mb-0.5">{title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section heading="複数の視点から見る国債残高">
          <DataBox
            items={[
              { label: "国債残高（絶対額）",    value: "1,170兆円", note: "2024年",          color: "#ef4444" },
              { label: "国民一人当たり",        value: "≒935万円",  note: "÷人口1.25億",     color: "#D97706" },
              { label: "対GDP比",              value: "≒250%",     note: "先進国最悪水準",  color: "#ef4444" },
              { label: "個人金融資産との比",    value: "≒53%",      note: "÷2,200兆円",      color: "#4F8EF7" },
              { label: "対外純資産との比",      value: "238%",      note: "対外資産488兆円",  color: "#22c55e" },
              { label: "税収に対する比",        value: "16.2倍",    note: "÷72兆円",         color: "#ef4444" },
            ]}
          />
          <p>
            このように、<strong>どの数字を分母に取るか</strong>で、国債残高の「印象」は大きく変わる。
          </p>
        </Section>

        <Section heading="家計に喩えると分かりにくい理由">
          <p>
            メディアでは「日本の財政は家計に例えると年収400万円で…」のような比喩がよく使われる。
            だが、この比喩には2つの致命的な問題がある。
          </p>
          <ul className="list-disc pl-5 space-y-1 my-3 text-sm" style={{ color: "var(--text)" }}>
            <li><strong>家計と違って政府は通貨を発行できる</strong>。円建ての国債である限り、デフォルト（債務不履行）は技術的に起こりにくい</li>
            <li><strong>家計と違って政府は永続的な存在</strong>。家計の借金は返済期限があるが、政府は借り換えを永続できる</li>
          </ul>
          <p>
            一方で、「政府の借金は国民の資産」という主張も極論である。
            金利上昇による利払い費の急増、社会保障費の自然増、円安進行による輸入インフレなど、
            <strong>財政膨張が将来世代に与える影響</strong>は無視できない。
          </p>
        </Section>

        <Section heading="では正しい読み方は何か">
          <p>
            国債残高を理解する上で重要なのは、<strong>「絶対額の大きさ」ではなく「動学的な持続可能性」</strong>だ。
            次の3つを定期的にチェックすると、財政の健全性が見えてくる。
          </p>
          <div
            className="rounded-xl border p-4 space-y-3 my-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            {[
              { title: "プライマリーバランス（PB）", desc: "歳入と歳出（利払い費を除く）の差。PB黒字化すれば、債務残高の対GDP比は安定する。" },
              { title: "金利の動向",                 desc: "国債金利が経済成長率を上回ると、利払い費の負担が雪だるま式に増える。日銀利上げ後はこのリスクが高まる。" },
              { title: "社会保障費の自然増",         desc: "高齢化に伴い毎年1兆円超の支出増が続く。これを賄う財源（増税 or 給付削減）の道筋が見えるか。" },
            ].map(({ title, desc }) => (
              <div key={title} className="border-l-2 pl-3 py-1" style={{ borderColor: "var(--link)" }}>
                <div className="text-sm font-semibold mb-0.5">{title}</div>
                <div className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{desc}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section heading="まとめ：単純な割り算で財政を語らない">
          <ul className="list-disc pl-5 space-y-1 my-3 text-sm" style={{ color: "var(--text)" }}>
            <li>「国民一人当たり935万円」は単純な割り算で、誤解を招く</li>
            <li>日本国債の90%は国内で保有されている</li>
            <li>個人金融資産2,200兆円の53%が国債残高に相当</li>
            <li>対外純資産は488兆円（世界1位）</li>
            <li>絶対額より、PB・金利・社会保障費の動向を見ることが重要</li>
          </ul>
        </Section>
        <Section heading="関連記事">
          <ul className="list-disc pl-5 space-y-1">
            <li><Link href="/articles/national-debt-1000trillion" className="underline" style={{ color: "var(--link)" }}>国債残高1,000兆円超 ─ 日本の財政赤字をデータで理解する</Link></li>
            <li><Link href="/articles/fiscal-collapse-truth" className="underline" style={{ color: "var(--link)" }}>財政破綻は本当に起きるのか ─ 国債・対外純資産からデータで考える</Link></li>
            <li><Link href="/articles/next-decade-forecast" className="underline" style={{ color: "var(--link)" }}>「失われた40年」になる前に ─ 2025〜2035年の日本経済展望</Link></li>
          </ul>
        </Section>
      </ArticleLayout>
    </>
  );
}
