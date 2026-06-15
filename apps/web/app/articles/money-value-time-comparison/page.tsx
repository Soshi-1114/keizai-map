import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { LiveDataBox } from "@/components/LiveDataBox";
import { articleOpenGraph, articleSeoTitle } from "@/lib/article-metadata";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd, generateFaqPageJsonLd } from "@/lib/jsonld";

const SLUG = "money-value-time-comparison";

export const metadata: Metadata = {
  alternates: { canonical: "/articles/money-value-time-comparison" },
  title: articleSeoTitle(SLUG),
  description:
    "1990年の30万円は2024年の何円相当か。消費者物価指数（CPI）を使って、過去の金額を現在価値に換算する方法を解説。月収・年収・貯金額を年代別に実質換算してみよう。",
  openGraph: articleOpenGraph("money-value-time-comparison"),
};

export default function MoneyValueTimeComparisonPage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "30年前の月収30万円は今いくら？─ 物価で換算する「お金の実質価値」",
    description: "消費者物価指数（CPI）を使って、過去の金額を現在価値に換算する方法を解説。",
    slug: SLUG,
    readingTime: 5,
    tags: ["物価", "インフレ", "実質価値"],
  });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(SLUG);
  const organizationJsonLd = generateOrganizationJsonLd();
  const faqJsonLd = generateFaqPageJsonLd([
    {
      question: "1990年の30万円は2024年でいくら相当ですか？",
      answer: "消費者物価指数（CPI）で換算すると約36万円相当です。1990年のCPIを100、2024年を119.9として計算すると、30万円×1.199≒36万円となります。年収500万円なら約600万円、貯金1000万円なら約1199万円相当です。",
    },
    {
      question: "過去の金額を現在価値に換算する方法は？",
      answer: "「現在価値=過去の金額×（現在のCPI÷過去のCPI）」で計算できます。例えば2024年のCPIは119.9なので、1990年の金額を1.199倍すれば現在価値が得られます。同様に、各年のCPIを使えばどの年代の金額でも現在価値に換算可能です。",
    },
    {
      question: "近年の物価上昇は過去と比べてどれくらい速いですか？",
      answer: "2020年→2024年でCPIが112.4から119.9に急上昇し、たった4年で約7%上昇しました。これは1990〜2020年の30年間で12.4%しか上がらなかったのと比べて、近年の物価上昇速度が異常に高まっていることを示しています。",
    },
    {
      question: "名目値と実質値はなぜ区別が必要なのですか？",
      answer: "「過去最高の税収」「過去最高の日経平均」と報道される数字が名目値であれば、物価上昇による「水ぶくれ」を含んでいるためです。真の比較には物価で割り戻して実質値で見る必要があり、「給料は上がっているのに生活が楽にならない」感覚の正体はこの物価補正の差にあります。",
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
        title="30年前の月収30万円は今いくら？─ 物価で換算する「お金の実質価値」"
        description="1990年の30万円は2024年の何円相当か。消費者物価指数（CPI）を使って、過去の金額を現在価値に換算する方法を解説。月収・年収・貯金額を年代別に実質換算してみよう。"
        readingTime={5}
        tags={["物価", "インフレ", "実質価値"]}
      >
        <Section heading="親の月収を、現在価値に換算してみる">
          <p>
            「父さんが昔もらっていた月収30万円って、今でいうといくらなんだろう？」
            家計や時代を超えた比較をしたいとき、必要なのが<strong>物価による換算</strong>だ。
          </p>
          <p>
            お金の額面は変わらなくても、それで買えるモノやサービスの量は時代とともに変わる。
            この「買える量」を測る指標が<strong>消費者物価指数（CPI）</strong>だ。
          </p>
        </Section>

        <Section heading="計算式：シンプルな比例計算">
          <div
            className="rounded-xl p-4 my-4 text-sm leading-relaxed"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
          >
            <p className="font-semibold mb-2" style={{ color: "var(--text)" }}>
              現在価値 ＝ 過去の金額 × （現在のCPI ÷ 過去のCPI）
            </p>
            <p style={{ color: "var(--muted)" }}>
              KeizaiMap では1990年を100として CPI を表示している。
              2024年のCPIは119.9なので、1990年の金額を1.199倍すれば現在価値が得られる。
            </p>
          </div>

          <LiveDataBox
            items={[
              { year: 1990, key: "cpi", label: "1990年 CPI" },
              { year: 2000, key: "cpi", label: "2000年 CPI" },
              { year: 2014, key: "cpi", label: "2014年 CPI" },
              { year: 2024, key: "cpi", label: "2024年 CPI" },
            ]}
          />
        </Section>

        <Section heading="月収・年収・貯金を年代別に換算">
          <p>
            実際に <strong>1990年の30万円が2024年でいくら相当</strong>になるか、計算してみよう。
            CPI 100 → 119.9 なので、約1.199倍だ。
          </p>

          <DataBox
            items={[
              { label: "月収30万円",  value: "≒ 36万円", note: "30 × 1.199",  color: "#D97706" },
              { label: "月収50万円",  value: "≒ 60万円", note: "50 × 1.199",  color: "#D97706" },
              { label: "年収500万円", value: "≒ 600万円", note: "500 × 1.199", color: "#D97706" },
              { label: "貯金1000万円", value: "≒ 1199万円", note: "1000 × 1.199", color: "#D97706" },
            ]}
          />

          <p>
            つまり、1990年に月収30万円もらっていた人は、今で言えば<strong>月収36万円相当</strong>を稼いでいたことになる。
            「父さんの30万円」は単純に「今の30万円」と比べてはいけない。
          </p>
        </Section>

        <Section heading="代表的な年代の換算表">
          <p>各年から2024年への換算倍率を一覧にした。</p>

          <div className="rounded-xl border overflow-hidden overflow-x-auto my-4" style={{ borderColor: "var(--border)" }}>
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--card)", borderBottom: "1px solid var(--border)" }}>
                  <th className="text-left p-3 font-medium">基準年</th>
                  <th className="text-left p-3 font-medium">CPI</th>
                  <th className="text-left p-3 font-medium">2024年への倍率</th>
                  <th className="text-left p-3 font-medium">月10万円の換算</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--muted)" }}>
                {[
                  { y: 1990, cpi: 100.0, x: "1.20倍", v: "12.0万円" },
                  { y: 1995, cpi: 107.0, x: "1.12倍", v: "11.2万円" },
                  { y: 2000, cpi: 108.6, x: "1.10倍", v: "11.0万円" },
                  { y: 2005, cpi: 106.3, x: "1.13倍", v: "11.3万円" },
                  { y: 2010, cpi: 105.9, x: "1.13倍", v: "11.3万円" },
                  { y: 2015, cpi: 110.4, x: "1.09倍", v: "10.9万円" },
                  { y: 2020, cpi: 112.4, x: "1.07倍", v: "10.7万円" },
                  { y: 2024, cpi: 119.9, x: "1.00倍", v: "10.0万円" },
                ].map((r) => (
                  <tr key={r.y} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                    <td className="p-3 font-medium" style={{ color: "var(--text)" }}>{r.y}年</td>
                    <td className="p-3">{r.cpi}</td>
                    <td className="p-3">{r.x}</td>
                    <td className="p-3 tabular-nums">{r.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            注目すべきは、<strong>2020年→2024年でCPIが112.4から119.9に急上昇</strong>している点だ。
            たった4年で物価が約7%上昇した。1990〜2020年の30年間でも12.4%しか上がらなかったのと比べて、近年の物価上昇速度の異常さがわかる。
          </p>
        </Section>

        <Section heading="名目と実質の感覚をつかむ">
          <p>
            メディアでよく「過去最高の税収」「過去最高の日経平均」と報道される。
            しかしそれが<strong>名目値</strong>であれば、物価上昇による「水ぶくれ」を含んでいる。
            真の比較には常に「物価で割り戻す」発想が必要だ。
          </p>
          <p>
            KeizaiMap のチャートで CPI を表示すれば、賃金や税収との並走関係を視覚的に確認できる。
            「給料は上がっているのに生活が楽にならない」感覚の正体は、この物価補正の差にある。
          </p>
        </Section>

        <Section heading="まとめ">
          <ul className="list-disc pl-5 space-y-1 my-3 text-sm" style={{ color: "var(--text)" }}>
            <li>過去の金額は CPI で現在価値に換算できる</li>
            <li>1990年の30万円 ≒ 2024年の36万円</li>
            <li>2020年→2024年だけで物価は約7%上昇している</li>
            <li>「名目値」だけで時代を比べると、実態を見誤る</li>
          </ul>
        </Section>
        <Section heading="関連記事">
          <ul className="list-disc pl-5 space-y-1">
            <li><Link href="/articles/real-wages-trend-1990-2024" className="underline" style={{ color: "var(--link)" }}>日本の実質賃金推移【1990〜2024】データ分析</Link></li>
            <li><Link href="/articles/yen-purchasing-power-decline" className="underline" style={{ color: "var(--link)" }}>日本の通貨価値はどれだけ下がったか ─ ドル建てで見る30年</Link></li>
            <li><Link href="/articles/real-take-home-pay-30years" className="underline" style={{ color: "var(--link)" }}>年収500万でも30年前の年収300万に負けている？─ 実質手取りで見る30年</Link></li>
          </ul>
        </Section>
      </ArticleLayout>
    </>
  );
}
