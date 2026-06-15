import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { articleOpenGraph, articleSeoTitle } from "@/lib/article-metadata";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd, generateFaqPageJsonLd } from "@/lib/jsonld";

const SLUG = "generation-economic-comparison";

export const metadata: Metadata = {
  alternates: { canonical: "/articles/generation-economic-comparison" },
  title: articleSeoTitle(SLUG),
  description:
    "1973年生・1993年生・2003年生の3世代が就職時に直面した経済環境を、賃金・株価・住宅価格・社会保険料・出生数で比較。世代論を感情ではなくデータで論じる。",
  openGraph: articleOpenGraph("generation-economic-comparison"),
};

export default function GenerationEconomicComparisonPage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "氷河期世代 vs Z世代 ─ 経済指標で見る「生まれた時代の不公平」",
    description: "1973年生・1993年生・2003年生の3世代が就職時に直面した経済環境を比較。",
    slug: SLUG,
    readingTime: 8,
    tags: ["世代格差", "氷河期世代", "Z世代"],
  });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(SLUG);
  const organizationJsonLd = generateOrganizationJsonLd();
  const faqJsonLd = generateFaqPageJsonLd([
    {
      question: "氷河期世代の実質賃金水準はZ世代より高かったのですか？",
      answer: "はい。1995年就職の氷河期世代の就職時実質賃金は1990年=100で109.0と高水準でした。一方、2015年就職のミレニアル世代は96.6、2025年就職のZ世代は推定99です。「就職が苦しかった」のは事実ですが、就職できた人の賃金水準は氷河期世代の方が高かったのです。",
    },
    {
      question: "住宅を最も買いやすかった世代はどれですか？",
      answer: "ミレニアル世代（2015年就職）です。住宅価格指数は1995年88.8、2015年63.7、2025年69+で、ミレニアル世代は底値圏の住宅価格と超低金利の住宅ローンを組めました。Z世代は住宅価格が上昇局面に転じ、日銀利上げも重なり最も家を買いにくい世代になりつつあります。",
    },
    {
      question: "社会保険料負担は世代でどれくらい違いますか？",
      answer: "就職時の社会保険料負担率は1995年12.5%、2015年16.8%、2025年18.6%と、世代を追うごとに重くなります。氷河期世代の入社時に比べてZ世代の負担率は約1.5倍。同じ月給30万円でも、Z世代の手取りは氷河期世代より2万円以上少ない計算です。",
    },
    {
      question: "どの世代が経済的に一番不遇ですか？",
      answer: "単純な答えはありません。データで見るとどの世代にも明確に有利な点と不利な点があります。氷河期世代は就職と人口プレッシャーで苦しんだが賃金水準と保険料負担は軽く、Z世代は就職と投資環境では恵まれているが住宅価格と社会保険料の重さに直面しています。",
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
        title="氷河期世代 vs Z世代 ─ 経済指標で見る「生まれた時代の不公平」"
        description="1973年生・1993年生・2003年生の3世代が就職時に直面した経済環境を、賃金・株価・住宅価格・社会保険料・出生数で比較。世代論を感情ではなくデータで論じる。"
        readingTime={8}
        tags={["世代格差", "氷河期世代", "Z世代"]}
      >
        <Section heading="世代論はデータで論じる">
          <p>
            「氷河期世代は本当に不遇だったのか？」「Z世代は恵まれているのか？」
            こうした世代論は SNS で頻繁に交わされるが、感情論に流れやすい。
          </p>
          <p>
            この記事では3つの典型的な世代について、就職時（22歳時点）に直面した経済環境を KeizaiMap のデータで比較する。
            扱う世代は以下のとおり：
          </p>
          <div className="rounded-xl border p-4 space-y-2 my-4" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            {[
              { gen: "氷河期世代", birth: "1973年生", grad: "1995年就職", desc: "バブル崩壊直後、就職氷河期の真っ只中" },
              { gen: "ミレニアル", birth: "1993年生", grad: "2015年就職", desc: "アベノミクスで雇用は回復していたが…" },
              { gen: "Z世代",     birth: "2003年生", grad: "2025年就職", desc: "コロナ後・円安・賃上げの波の中で就職" },
            ].map(({ gen, birth, grad, desc }) => (
              <div key={gen}>
                <div className="text-sm font-bold" style={{ color: "var(--text)" }}>{gen}（{birth} / {grad}）</div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>{desc}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section heading="就職時の実質賃金（1990=100）">
          <DataBox
            items={[
              { label: "氷河期世代 (1995)", value: "109.0", note: "高い水準", color: "#4F8EF7" },
              { label: "ミレニアル (2015)", value: "96.6",  note: "▲11%",     color: "#ef4444" },
              { label: "Z世代 (2025推定)",  value: "≒99",   note: "やや回復",  color: "#D97706" },
            ]}
          />
          <p>
            就職時の<strong>実質賃金水準</strong>は、皮肉なことに<strong>氷河期世代の方が高かった</strong>。
            「就職が苦しかった」のは事実だが、就職できた人にとっての賃金水準は他の世代より高かったのだ。
          </p>
          <p>
            一方ミレニアル世代以降は、賃金が回復傾向に向かう局面で就職しているが、
            <strong>1990年水準には及ばない</strong>。Z世代は2024年の賃上げの波の中で就職するが、それでもまだ氷河期世代の水準には届かない。
          </p>
        </Section>

        <Section heading="就職時の日経平均（株価で見る投資環境）">
          <DataBox
            items={[
              { label: "1995年 日経平均",    value: "19,868円", note: "1990=100で102.5", color: "#8B5CF6" },
              { label: "2015年 日経平均",    value: "19,033円", note: "1990=100で80.0",  color: "#8B5CF6" },
              { label: "2025年初 日経平均",  value: "≒39,000円", note: "1990=100で155+", color: "#22c55e" },
            ]}
          />
          <p>
            <strong>就職時に投資を始められた条件</strong>を比較すると、Z世代が圧倒的に有利だ。
            2025年に新NISAを活用して投資を始める Z世代は、過去30年で最も恵まれた投資環境にいる。
          </p>
          <p>
            一方、氷河期世代が22歳の1995年から積立投資を始めていれば、その後の長期株高で大きな資産を築けた可能性はある。
            だが当時はネット証券もNISAもなく、株式投資は一般的ではなかった。
          </p>
        </Section>

        <Section heading="就職時の住宅価格（1990=100）">
          <DataBox
            items={[
              { label: "1995年 住宅価格", value: "88.8", note: "バブル崩壊で下落中", color: "#EC4899" },
              { label: "2015年 住宅価格", value: "63.7", note: "底値圏",            color: "#EC4899" },
              { label: "2025年 住宅価格", value: "≒69+", note: "上昇傾向",         color: "#ef4444" },
            ]}
          />
          <p>
            住宅購入の観点では<strong>ミレニアル世代が最も有利</strong>だった。
            底値圏の住宅価格 + 超低金利の住宅ローンで、最も「家を買いやすかった」世代といえる。
          </p>
          <p>
            Z世代は住宅価格が上昇局面に転じ、2024年の日銀利上げで金利も上昇傾向。
            首都圏の中古マンション価格は2025年時点でバブル期超えの水準に達しており、
            <strong>家を買うのが最も難しい世代</strong>になりつつある。
          </p>
        </Section>

        <Section heading="就職時の社会保険料負担率（%）">
          <DataBox
            items={[
              { label: "1995年", value: "12.5%", note: "比較的軽い", color: "#10B981" },
              { label: "2015年", value: "16.8%", note: "+4.3pt",     color: "#D97706" },
              { label: "2025年", value: "≒18.6%", note: "+1.8pt",    color: "#ef4444" },
            ]}
          />
          <p>
            社会保険料負担は世代を追うごとに重くなる。
            <strong>氷河期世代の入社時に比べ、Z世代の入社時の負担率は約1.5倍</strong>。
            同じ「月給30万円」でも、Z世代の手取りは氷河期世代よりも2万円以上少ない計算になる。
          </p>
        </Section>

        <Section heading="出生数で見る『世代の人口圧力』">
          <DataBox
            items={[
              { label: "1973年 出生数", value: "≒209万人", note: "団塊ジュニア",   color: "#F59E0B" },
              { label: "1993年 出生数", value: "118.9万人", note: "氷河期世代の半数", color: "#F59E0B" },
              { label: "2003年 出生数", value: "112.4万人", note: "ミレニアルとほぼ同数", color: "#F59E0B" },
            ]}
          />
          <p>
            氷河期世代（1973年生）は団塊ジュニアの最後の方の世代で、同世代人口が約209万人と多い。
            ミレニアル・Z世代になると同世代人口は半数近くまで減少しており、
            <strong>受験・就職の競争率は氷河期世代の方が圧倒的に高かった</strong>。
          </p>
          <p>
            一方、現役世代として高齢者を支える人数比で見ると、Z世代の負担は氷河期世代より重い。
            人数が少ない世代が、人数が多い高齢世代の社会保障を支える構図になっている。
          </p>
        </Section>

        <Section heading="3世代の総合比較">
          <div className="rounded-xl border overflow-hidden overflow-x-auto my-4" style={{ borderColor: "var(--border)" }}>
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--card)", borderBottom: "1px solid var(--border)" }}>
                  <th className="text-left p-3 font-medium">指標</th>
                  <th className="text-center p-3 font-medium">氷河期</th>
                  <th className="text-center p-3 font-medium">ミレニアル</th>
                  <th className="text-center p-3 font-medium">Z世代</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--muted)" }}>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  <td className="p-3 font-medium" style={{ color: "var(--text)" }}>就職環境</td>
                  <td className="p-3 text-center">🔴 最悪</td>
                  <td className="p-3 text-center">🟡 改善</td>
                  <td className="p-3 text-center">🟢 良好</td>
                </tr>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  <td className="p-3 font-medium" style={{ color: "var(--text)" }}>実質賃金水準</td>
                  <td className="p-3 text-center">🟢 高い</td>
                  <td className="p-3 text-center">🔴 最低水準</td>
                  <td className="p-3 text-center">🟡 やや回復</td>
                </tr>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  <td className="p-3 font-medium" style={{ color: "var(--text)" }}>投資環境</td>
                  <td className="p-3 text-center">🔴 困難</td>
                  <td className="p-3 text-center">🟡 普及途中</td>
                  <td className="p-3 text-center">🟢 NISA最強</td>
                </tr>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  <td className="p-3 font-medium" style={{ color: "var(--text)" }}>住宅取得</td>
                  <td className="p-3 text-center">🟡 下落途中</td>
                  <td className="p-3 text-center">🟢 底値</td>
                  <td className="p-3 text-center">🔴 上昇局面</td>
                </tr>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  <td className="p-3 font-medium" style={{ color: "var(--text)" }}>社会保険料負担</td>
                  <td className="p-3 text-center">🟢 軽い</td>
                  <td className="p-3 text-center">🟡 重い</td>
                  <td className="p-3 text-center">🔴 最重</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium" style={{ color: "var(--text)" }}>同世代競争</td>
                  <td className="p-3 text-center">🔴 激烈</td>
                  <td className="p-3 text-center">🟢 緩い</td>
                  <td className="p-3 text-center">🟢 緩い</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section heading="どの世代が最も不遇か：単純な答えはない">
          <p>
            データで見ると、<strong>どの世代にも「明確に有利な点」と「明確に不利な点」がある</strong>。
            氷河期世代は就職と人口プレッシャーで苦しんだが、賃金水準と社会保険料負担は今より軽かった。
            Z世代は就職と投資環境では恵まれているが、住宅価格と社会保険料の重さに直面する。
          </p>
          <p>
            「自分の世代だけが損している」という議論は、片面しか見ていないことが多い。
            KeizaiMap のデータを世代別に切り取って眺めることで、より公平な世代比較ができる。
          </p>
        </Section>

        <Section heading="まとめ">
          <ul className="list-disc pl-5 space-y-1 my-3 text-sm" style={{ color: "var(--text)" }}>
            <li>氷河期世代：就職は最悪だが賃金水準と保険料負担は軽かった</li>
            <li>ミレニアル世代：賃金は最低だが住宅は底値で取得できた</li>
            <li>Z世代：就職と投資は最も恵まれているが、住宅と保険料は重い</li>
            <li>世代論は「総合スコア」ではなく「指標別」で見るべき</li>
          </ul>
        </Section>
        <Section heading="関連記事">
          <ul className="list-disc pl-5 space-y-1">
            <li><Link href="/articles/housing-price" className="underline" style={{ color: "var(--link)" }}>なぜ若者は家を買えないのか ─ 住宅価格と賃金の34年</Link></li>
            <li><Link href="/articles/social-insurance-burden" className="underline" style={{ color: "var(--link)" }}>手取りが増えない本当の理由 ─ 社会保険料30年の増加</Link></li>
            <li><Link href="/articles/real-wages-trend-1990-2024" className="underline" style={{ color: "var(--link)" }}>日本の実質賃金推移【1990〜2024】データ分析</Link></li>
          </ul>
        </Section>
      </ArticleLayout>
    </>
  );
}
