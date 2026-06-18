import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { articleOpenGraph, articleSeoTitle, articleRobots } from "@/lib/article-metadata";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd, generateFaqPageJsonLd } from "@/lib/jsonld";

const SLUG = "average-income-trap";

export const metadata: Metadata = {
  alternates: { canonical: "/articles/average-income-trap" },
  title: articleSeoTitle(SLUG),
  description:
    "「日本の平均年収は458万円」と言われるが、それを実際に稼いでいる人は意外と少ない。平均値・中央値・最頻値の違いをデータで解説し、本当の日本の所得分布を明らかにする。",
  openGraph: articleOpenGraph("average-income-trap"),
  robots: articleRobots(SLUG),
};

export default function AverageIncomeTrapPage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "「平均年収」の罠 ─ メディアが報じない統計の落とし穴",
    description: "平均値・中央値・最頻値の違いをデータで解説。",
    slug: SLUG,
    readingTime: 6,
    tags: ["平均年収", "所得分布", "統計"],
  });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(SLUG);
  const organizationJsonLd = generateOrganizationJsonLd();
  const faqJsonLd = generateFaqPageJsonLd([
    {
      question: "日本の平均年収・中央値・最頻値の違いは？",
      answer: "国税庁の民間給与実態統計調査では、平均年収は458万円、中央値は約400万円、最頻値は300〜400万円帯です。平均値は一部の高所得者が引き上げるため実感とズレやすく、中央値（半分の人がそれより下）の方が生活感に近い指標です。",
    },
    {
      question: "日本の給与所得者の半数以上は平均年収より低いのですか？",
      answer: "はい。年収400万円以下が累計で51.4%を占めており、給与所得者の半数以上は平均年収（458万円）よりも低い水準です。一方、年収1,000万円超のいわゆる高所得者は全体の約6.8%です。",
    },
    {
      question: "日本の平均年収はピークからどれくらい下がっていますか？",
      answer: "平均年収は2000年の約461万円がピークで、25年経ってもその水準を超えていません。2010年のリーマン後には約412万円まで下落し、2024年は約460万円と賃上げを受けて回復し、ピーク並みまで戻ってきました。ただし物価で実質化すると依然1990年水準を下回ります。",
    },
    {
      question: "なぜメディアは中央値ではなく平均値を報道するのですか？",
      answer: "①歴史的に「平均」が最もポピュラーな統計指標として定着している、②中央値の計算には個票データが必要で開示が遅い、③「日本の平均年収は400万円」よりも「458万円」の方がポジティブに聞こえる、の3つの理由が挙げられます。",
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
        title="「平均年収」の罠 ─ メディアが報じない統計の落とし穴"
        description="「日本の平均年収は458万円」と言われるが、それを実際に稼いでいる人は意外と少ない。平均値・中央値・最頻値の違いをデータで解説し、本当の日本の所得分布を明らかにする。"
        readingTime={6}
        tags={["平均年収", "所得分布", "統計"]}
      >
        <Section heading="「平均年収」って、本当にあなたの年収？">
          <p>
            「日本の平均年収は約458万円」というニュースを見て、「自分はそれより低い…」と感じたことはないだろうか。
            実はその感覚は、統計の見方として正しい。
            <strong>平均年収とは、ほとんどの人にとって参考にならない数字</strong>なのだ。
          </p>
          <p>
            この記事では、平均値・中央値・最頻値という3つの統計量を使って、日本の所得分布の実態を明らかにする。
          </p>
        </Section>

        <Section heading="3つの統計量の違い">
          <div
            className="rounded-xl border p-4 space-y-3 my-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            {[
              { name: "平均値（Mean）",      val: "全体の合計 ÷ 人数",       note: "高所得者の影響を強く受ける。最も報道されるが、実感とズレやすい。" },
              { name: "中央値（Median）",    val: "ちょうど真ん中の人の年収", note: "「半分の人がこれより上、半分が下」を意味する実感に近い指標。" },
              { name: "最頻値（Mode）",      val: "最も人数が多い年収帯",     note: "「世の中で一番多いゾーン」。生活感に最も近い。" },
            ].map(({ name, val, note }) => (
              <div key={name} className="border-l-2 pl-3 py-1" style={{ borderColor: "var(--link)" }}>
                <div className="text-sm font-semibold mb-0.5">{name}</div>
                <div className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{val} — {note}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section heading="日本の所得分布（2024年）">
          <p>
            国税庁「民間給与実態統計調査」のデータをもとに、3つの統計量を比較する。
          </p>
          <DataBox
            items={[
              { label: "平均年収", value: "458万円", note: "報道される数字",      color: "#D97706" },
              { label: "中央値",   value: "≒400万円", note: "半分はこれより低い",  color: "#4F8EF7" },
              { label: "最頻値",   value: "300〜400万円", note: "最も多い年収帯", color: "#22c55e" },
            ]}
          />
          <p>
            <strong>平均値 458万円 vs 中央値 約400万円</strong>。この58万円の差は、一部の高所得者が平均を引き上げている証拠だ。
            最頻値はさらに低く、300〜400万円のゾーンに最も人数が集中している。
          </p>
        </Section>

        <Section heading="所得分布の形：右に長い尾を引く">
          <p>
            日本の所得分布をグラフにすると、低所得側に山があり、右側（高所得側）に長い尾を引く形になる。
          </p>
          <div className="rounded-xl border overflow-hidden overflow-x-auto my-4" style={{ borderColor: "var(--border)" }}>
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--card)", borderBottom: "1px solid var(--border)" }}>
                  <th className="text-left p-3 font-medium">年収帯</th>
                  <th className="text-right p-3 font-medium">割合</th>
                  <th className="text-right p-3 font-medium">累計</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--muted)" }}>
                {[
                  { range: "100万円以下",   ratio: "8.4%",  cum: "8.4%" },
                  { range: "100〜200万円", ratio: "12.7%", cum: "21.1%" },
                  { range: "200〜300万円", ratio: "14.0%", cum: "35.1%" },
                  { range: "300〜400万円", ratio: "16.3%", cum: "51.4%" },
                  { range: "400〜500万円", ratio: "14.5%", cum: "65.9%" },
                  { range: "500〜600万円", ratio: "10.5%", cum: "76.4%" },
                  { range: "600〜700万円", ratio: "7.0%",  cum: "83.4%" },
                  { range: "700〜800万円", ratio: "4.8%",  cum: "88.2%" },
                  { range: "800〜900万円", ratio: "3.0%",  cum: "91.2%" },
                  { range: "900〜1000万円", ratio: "2.0%", cum: "93.2%" },
                  { range: "1000万円超",   ratio: "6.8%",  cum: "100.0%" },
                ].map((r) => (
                  <tr key={r.range} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                    <td className="p-3 font-medium" style={{ color: "var(--text)" }}>{r.range}</td>
                    <td className="p-3 text-right tabular-nums">{r.ratio}</td>
                    <td className="p-3 text-right tabular-nums">{r.cum}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            注目すべきは、<strong>400万円以下が累計で51%以上</strong>を占めること。
            つまり日本の<strong>給与所得者の半数以上は、平均年収（458万円）よりも低い</strong>。
            一方、年収1,000万円超のいわゆる「高所得者」は全体の約6.8%。
          </p>
        </Section>

        <Section heading="平均年収の30年推移">
          <p>
            KeizaiMap の実質賃金データと並べると、平均年収の推移も見えてくる。
          </p>
          <DataBox
            items={[
              { label: "1990年 平均年収", value: "≒425万円", color: "#4F8EF7" },
              { label: "2000年 平均年収", value: "≒461万円", note: "ピーク",   color: "#4F8EF7" },
              { label: "2010年 平均年収", value: "≒412万円", note: "リーマン後", color: "#ef4444" },
              { label: "2024年 平均年収", value: "≒460万円", note: "ピーク水準まで戻る", color: "#D97706" },
            ]}
          />
          <p>
            名目の<strong>平均年収は2024年に2000年のピーク水準まで回復</strong>した。
            しかしCPIが100→123.7まで上昇しているため、実質では1990年水準を依然下回る。
            これが「給料は名目で増えたが、生活が楽にならない」と感じる根拠だ。
          </p>
        </Section>

        <Section heading="なぜ「平均」が報道されるのか">
          <p>
            「平均値は誤解を招く」と分かっていても、メディアは平均を使い続ける。理由は次の3つだ：
          </p>
          <ul className="list-disc pl-5 space-y-1 my-3 text-sm" style={{ color: "var(--text)" }}>
            <li>歴史的に「平均」が最もポピュラーな統計指標として定着している</li>
            <li>中央値の計算には個票データが必要で、開示が遅い</li>
            <li>「日本の平均年収は400万円」よりも「458万円」の方がポジティブに聞こえる</li>
          </ul>
        </Section>

        <Section heading="まとめ：3つの数字を見比べよう">
          <ul className="list-disc pl-5 space-y-1 my-3 text-sm" style={{ color: "var(--text)" }}>
            <li>平均値は高所得者が引き上げるため実感とズレる</li>
            <li>中央値（約400万円）は実感に近い「半分の人がそれより下」の数字</li>
            <li>最頻値（300〜400万円）が世の中で最も多い年収帯</li>
            <li>給与所得者の半数以上は平均年収を下回っている</li>
          </ul>
          <p>
            次に「平均年収」のニュースを目にしたら、ぜひ中央値も探してみてほしい。
            日本の真の所得分布が見えてくる。
          </p>
        </Section>
        <Section heading="関連記事">
          <ul className="list-disc pl-5 space-y-1">
            <li><Link href="/articles/income-inequality-japan" className="underline" style={{ color: "var(--link)" }}>格差は本当に広がっているのか？─ ジニ係数と所得分布で見る35年</Link></li>
            <li><Link href="/articles/real-take-home-pay-30years" className="underline" style={{ color: "var(--link)" }}>年収500万でも30年前の年収300万に負けている？─ 実質手取りで見る35年</Link></li>
            <li><Link href="/articles/generation-economic-comparison" className="underline" style={{ color: "var(--link)" }}>氷河期世代 vs Z世代 ─ 経済指標で見る「生まれた時代の不公平」</Link></li>
          </ul>
        </Section>
      </ArticleLayout>
    </>
  );
}
