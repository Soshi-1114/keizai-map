import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { articleOpenGraph } from "@/lib/article-metadata";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd, generateFaqPageJsonLd } from "@/lib/jsonld";

const SLUG = "university-cost-inflation";

export const metadata: Metadata = {
  alternates: { canonical: "/articles/university-cost-inflation" },
  title: "大学費用30年前と今 ─ 親世代と子世代の教育費インフレ実態",
  description:
    "1990年の国立大学授業料は年34万円、2024年は53.6万円。私立大学はさらに上昇率が高い。CPI補正・賃金との対比で「教育費は本当に重くなったのか」をデータで検証する。",
  openGraph: articleOpenGraph("university-cost-inflation"),
};

export default function UniversityCostInflationPage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "大学費用30年前と今 ─ 親世代と子世代の教育費インフレ実態",
    description: "国立・私立の授業料推移をCPI補正・賃金対比で分析。",
    slug: SLUG,
    readingTime: 6,
    tags: ["教育費", "大学", "家計"],
  });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(SLUG);
  const organizationJsonLd = generateOrganizationJsonLd();
  const faqJsonLd = generateFaqPageJsonLd([
    {
      question: "国立大学の授業料は30年でどれくらい上がりましたか？",
      answer: "1990年の33.9万円から2024年の53.6万円へ、約1.58倍に上昇しました。1990年から2005年まで毎年のように引き上げられた後、53.6万円に到達した時点から20年近く据え置かれています。",
    },
    {
      question: "私立大学の授業料はどれくらい上がりましたか？",
      answer: "私立大学（文系平均）は1990年の61.5万円から2024年の約94万円へ、約53%上昇しました。理系・医療系はさらに上昇率が高く、医歯学系では年間500万円超に達するケースもあります。",
    },
    {
      question: "物価補正後の実質的な大学費用の負担増は？",
      answer: "CPI（消費者物価指数）が同期間に約20%上昇したことを差し引いても、国立大の実質負担は+31%、私立大も+28%増加しています。一方で実質賃金は横ばいのため、世帯の購買力に対する大学費用の重さは30年で約30%増加しました。",
    },
    {
      question: "大学費用が上がる構造的な理由は？",
      answer: "①大学進学率が1990年の約24%から2024年は60%超へ上昇し需要拡大、②国立大学運営費交付金が2004年の独立法人化以降年1%ずつ削減、③ICT環境・実験設備など教育水準維持のためのコスト増、④少子化による大学間競争激化での広告・施設投資増、の4つです。",
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
        title="大学費用30年前と今 ─ 親世代と子世代の教育費インフレ実態"
        description="1990年の国立大学授業料は年34万円、2024年は53.6万円。私立大学はさらに上昇率が高い。CPI補正・賃金との対比で「教育費は本当に重くなったのか」をデータで検証する。"
        readingTime={6}
        tags={["教育費", "大学", "家計"]}
      >
        <Section heading="「親の時代より大学に行きにくい」のは本当か">
          <p>
            「自分の親世代は気軽に大学に行っていたのに、今は教育費が高くて家計が苦しい」
            ── 多くの保護者がこう感じている。果たして実態はどうなのか。
          </p>
          <p>
            この記事では、KeizaiMap の CPI・実質賃金データと組み合わせて、
            大学費用の30年推移を国立・私立別に検証する。
          </p>
        </Section>

        <Section heading="国立大学授業料の30年推移">
          <DataBox
            items={[
              { label: "1990年", value: "33.9万円", color: "#4F8EF7" },
              { label: "2000年", value: "47.8万円", note: "+41%",      color: "#D97706" },
              { label: "2010年", value: "53.6万円", note: "+58%",      color: "#ef4444" },
              { label: "2024年", value: "53.6万円", note: "+58%（据置）", color: "#ef4444" },
            ]}
          />
          <p>
            国立大学の標準授業料は<strong>1990年から2005年まで毎年のように引き上げられ</strong>、
            53.6万円に到達した後は20年近く据え置かれている。
            「親世代の33.9万円」から「子世代の53.6万円」へ、約1.58倍に増えたことになる。
          </p>
        </Section>

        <Section heading="私立大学授業料の30年推移（文系平均）">
          <DataBox
            items={[
              { label: "1990年", value: "61.5万円", color: "#4F8EF7" },
              { label: "2000年", value: "78.9万円", note: "+28%",      color: "#D97706" },
              { label: "2010年", value: "85.8万円", note: "+39%",      color: "#ef4444" },
              { label: "2024年", value: "≒94万円",  note: "+53%",      color: "#ef4444" },
            ]}
          />
          <p>
            私立大学（文系平均）も<strong>30年で約53%上昇</strong>。
            理系・医療系はさらに上昇率が高く、医歯学系では年間500万円超に達する。
          </p>
        </Section>

        <Section heading="CPI補正で見ると「実質負担」はどう変わったか">
          <p>
            授業料の名目額だけを見ると「30年で1.5倍」だが、
            CPI（消費者物価指数）も同期間に約20%上昇している。
            <strong>物価補正後（実質）</strong>の値を見るとどうか。
          </p>
          <DataBox
            items={[
              { label: "国立大 実質負担増", value: "+31%", note: "1990年=100の物価で換算", color: "#D97706" },
              { label: "私立大 実質負担増", value: "+28%", note: "同上",                  color: "#D97706" },
              { label: "実質賃金推移",      value: "▲0.8%", note: "ほぼ横ばい",            color: "#ef4444" },
            ]}
          />
          <p>
            物価で割っても授業料は30%増えている。一方で実質賃金は横ばい。
            つまり<strong>世帯の購買力に対する大学費用の重さは、30年で約30%増加</strong>している。
          </p>
        </Section>

        <Section heading="4年間の総額で見る親の負担">
          <p>
            授業料以外に、入学金・施設費・教材費・生活費（一人暮らし）も含めると、
            実態はさらに重い。
          </p>
          <div className="rounded-xl border overflow-hidden overflow-x-auto my-4" style={{ borderColor: "var(--border)" }}>
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--card)", borderBottom: "1px solid var(--border)" }}>
                  <th className="text-left p-3 font-medium">区分</th>
                  <th className="text-right p-3 font-medium">1990年</th>
                  <th className="text-right p-3 font-medium">2024年</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--muted)" }}>
                {[
                  { c: "国立大 自宅通学（4年）",  v90: "≒180万", v24: "≒260万" },
                  { c: "国立大 一人暮らし（4年）", v90: "≒480万", v24: "≒720万" },
                  { c: "私立文系 自宅通学（4年）", v90: "≒320万", v24: "≒460万" },
                  { c: "私立文系 一人暮らし（4年）", v90: "≒620万", v24: "≒920万" },
                  { c: "私立理系 一人暮らし（4年）", v90: "≒710万", v24: "≒1060万" },
                ].map((r) => (
                  <tr key={r.c} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                    <td className="p-3 font-medium" style={{ color: "var(--text)" }}>{r.c}</td>
                    <td className="p-3 text-right tabular-nums">{r.v90}</td>
                    <td className="p-3 text-right tabular-nums">{r.v24}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            私立理系で一人暮らしさせれば、4年間で<strong>1,000万円超</strong>。
            これに大学院（2年）まで含めれば1,500万円。子ども2人いれば、教育費だけで「老後2,000万円問題」を超える。
          </p>
        </Section>

        <Section heading="教育費が上がる構造的理由">
          <div
            className="rounded-xl border p-4 space-y-3 my-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            {[
              { num: "①", title: "大学進学率の上昇（24% → 60%超）", desc: "1990年の進学率約24%から2024年は60%超。需要拡大が価格上昇要因に。" },
              { num: "②", title: "国の運営費交付金の削減", desc: "国立大学運営費交付金は2004年の独立法人化以降、年1%ずつ削減。授業料引き上げ圧力となった。" },
              { num: "③", title: "施設・設備投資の高度化", desc: "ICT環境・実験設備など、現代の教育水準を維持するためのコスト増。" },
              { num: "④", title: "競争激化による広告・施設整備", desc: "少子化で大学間競争が激化。広告・施設投資が授業料に転嫁される構造。" },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex gap-3">
                <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#1d4ed820", color: "#1d4ed8" }}>
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

        <Section heading="2024年からの修学支援新制度">
          <p>
            2020年から始まった修学支援新制度（給付奨学金 + 授業料減免）は、
            2024年4月から多子世帯・理工農系世帯への対象拡大が実施された。
            年収目安380万円以下の世帯では、国立大学はほぼ無償化される仕組みも整いつつある。
          </p>
          <p>
            一方で、<strong>中所得層（年収600〜900万円）の支援は限定的</strong>であり、
            「奨学金の壁」の問題は依然として残る。
          </p>
        </Section>

        <Section heading="まとめ：子世代の進学を支えるには">
          <ul className="list-disc pl-5 space-y-1 my-3 text-sm" style={{ color: "var(--text)" }}>
            <li>国立大授業料は30年で1.58倍、私立は1.53倍に上昇</li>
            <li>実質負担は30%増、対して実質賃金は横ばい</li>
            <li>4年間の総額は私立理系一人暮らしで1,000万円超</li>
            <li>給付奨学金・授業料減免の活用と、早期からの積立が重要</li>
          </ul>
          <p>
            KeizaiMap で CPI と実質賃金を重ねて表示すれば、
            「親世代と子世代の生活コスト感」の違いが見えてくる。
          </p>
        </Section>
        <Section heading="関連記事">
          <ul className="list-disc pl-5 space-y-1">
            <li><Link href="/articles/real-take-home-pay-30years" className="underline" style={{ color: "var(--link)" }}>年収500万でも30年前の年収300万に負けている？─ 実質手取りで見る30年</Link></li>
            <li><Link href="/articles/declining-birthrate-economy" className="underline" style={{ color: "var(--link)" }}>少子化と経済の悪循環 ─ 出生数激減が家計と社会保障に与える影響</Link></li>
            <li><Link href="/articles/money-value-time-comparison" className="underline" style={{ color: "var(--link)" }}>30年前の月収30万円は今いくら？─ お金の実質価値</Link></li>
          </ul>
        </Section>
      </ArticleLayout>
    </>
  );
}
