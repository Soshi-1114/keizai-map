import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd } from "@/lib/jsonld";

const SLUG = "income-inequality-japan";

export const metadata: Metadata = {
  alternates: { canonical: "/articles/income-inequality-japan" },
  title: "格差は本当に広がっているのか？─ ジニ係数と所得分布で見る30年 | KeizaiMap",
  description:
    "「日本は格差社会化している」とよく言われる。本当か。ジニ係数（当初/再分配）・相対的貧困率・所得分布の変化を30年スパンで検証し、格差の実態と政策効果をデータで解説する。",
  openGraph: {
    title: "格差は本当に広がっているのか？─ ジニ係数と所得分布で見る30年",
    images: [{ url: `/og/article?slug=${SLUG}` }],
  },
};

export default function IncomeInequalityPage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "格差は本当に広がっているのか？─ ジニ係数と所得分布で見る30年",
    description: "ジニ係数・相対的貧困率・所得分布の変化を30年スパンで検証。",
    slug: SLUG,
    readingTime: 7,
    tags: ["格差", "ジニ係数", "貧困"],
  });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(SLUG);
  const organizationJsonLd = generateOrganizationJsonLd();

  return (
    <>
      <script id="article-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script id="breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script id="org-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <ArticleLayout
        slug={SLUG}
        title="格差は本当に広がっているのか？─ ジニ係数と所得分布で見る30年"
        description="「日本は格差社会化している」とよく言われる。本当か。ジニ係数（当初/再分配）・相対的貧困率・所得分布の変化を30年スパンで検証し、格差の実態と政策効果をデータで解説する。"
        readingTime={7}
        tags={["格差", "ジニ係数", "貧困"]}
      >
        <Section heading="「格差社会」のイメージを、データで検証する">
          <p>
            「日本は格差が広がっている」という主張は SNS でも書籍でも頻繁に見かける。
            一方で「日本はまだ世界的に見れば平等な国」とも言われる。
          </p>
          <p>
            実際のところ、データで見ると<strong>格差は広がっているのか、それとも縮まっているのか</strong>。
            ジニ係数・相対的貧困率・所得分布の3つの観点で検証する。
          </p>
        </Section>

        <Section heading="ジニ係数とは：格差を測る代表指標">
          <p>
            ジニ係数は0〜1の間の数字で、<strong>0が完全平等・1が完全不平等</strong>を意味する。
            日本では厚生労働省「所得再分配調査」が2種類のジニ係数を発表している。
          </p>
          <div
            className="rounded-xl border p-4 space-y-3 my-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <div>
              <div className="font-semibold mb-1" style={{ color: "var(--text)" }}>当初所得ジニ係数</div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                政府の介入前（税金・社会保険料控除前、給付金等加算前）の所得分布で計算。経済そのものの格差を示す。
              </p>
            </div>
            <div>
              <div className="font-semibold mb-1" style={{ color: "var(--text)" }}>再分配所得ジニ係数</div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                政府の介入後（税金控除・社会保障給付後）の所得分布。実際に手元に残る格差を示す。
              </p>
            </div>
          </div>
        </Section>

        <Section heading="日本のジニ係数30年推移">
          <DataBox
            items={[
              { label: "1990年 当初所得",   value: "0.434", color: "#4F8EF7" },
              { label: "2024年 当初所得",   value: "≒0.580", note: "+34%", color: "#ef4444" },
              { label: "1990年 再分配",     value: "0.364", color: "#4F8EF7" },
              { label: "2024年 再分配",     value: "≒0.380", note: "+4%",   color: "#D97706" },
            ]}
          />
          <p>
            ここに重要な発見がある。
            <strong>当初所得のジニ係数は34年で34%も上昇</strong>（=格差拡大）したが、
            再分配後では<strong>わずか4%の上昇</strong>に抑えられている。
          </p>
          <p>
            つまり、<strong>経済そのものの格差は大幅に拡大しているが、政府の所得再分配機能が格差を半分以上吸収している</strong>。
            これは無視できない事実だ。
          </p>
        </Section>

        <Section heading="なぜ当初所得の格差が拡大したのか">
          <div
            className="rounded-xl border p-4 space-y-3 my-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            {[
              { title: "高齢化の影響", desc: "退職した高齢者の当初所得（給与）はほぼゼロ。高齢者が増えると、人口全体の当初所得格差は機械的に大きく見える。" },
              { title: "非正規雇用の増加", desc: "1990年の非正規率約20%が2024年には約37%へ。給与差が固定化されると当初所得の格差は広がる。" },
              { title: "夫婦共働きの増加", desc: "ダブルインカム世帯が増えたことで、世帯間の所得差が広がっている。" },
              { title: "資産所得（株式・不動産）の偏在", desc: "アベノミクス以降の株高で、株式保有者と非保有者の差が拡大した。" },
            ].map(({ title, desc }) => (
              <div key={title} className="border-l-2 pl-3 py-1" style={{ borderColor: "#ef4444" }}>
                <div className="text-sm font-semibold mb-0.5">{title}</div>
                <div className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{desc}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section heading="相対的貧困率の推移">
          <p>
            ジニ係数とは別に、所得が低い層に焦点を当てた指標が<strong>相対的貧困率</strong>だ。
            「等価可処分所得の中央値の半分（貧困線）未満で生活している人の割合」。
          </p>
          <DataBox
            items={[
              { label: "1990年", value: "13.5%", color: "#D97706" },
              { label: "2000年", value: "15.3%", color: "#D97706" },
              { label: "2012年", value: "16.1%", note: "ピーク", color: "#ef4444" },
              { label: "2022年", value: "15.4%", note: "やや改善", color: "#D97706" },
            ]}
          />
          <p>
            日本の相対的貧困率は<strong>OECD平均（11.4%）を大きく上回る</strong>。
            G7では米国（15.3%）と並んで高い水準だ。
            「6〜7人に1人が貧困線以下で生活している」のが日本の現実だ。
          </p>
        </Section>

        <Section heading="子どもの貧困率は深刻">
          <DataBox
            items={[
              { label: "全体の貧困率", value: "15.4%", color: "#D97706" },
              { label: "子どもの貧困率（17歳以下）", value: "11.5%", note: "改善傾向", color: "#22c55e" },
              { label: "ひとり親世帯の貧困率", value: "44.5%", note: "依然深刻", color: "#ef4444" },
            ]}
          />
          <p>
            最も深刻なのは<strong>ひとり親世帯の貧困率44.5%</strong>。
            約半数が貧困線以下で生活している。OECD諸国の中でも最悪水準だ。
          </p>
        </Section>

        <Section heading="国際比較：日本は『平等』か『不平等』か">
          <div className="rounded-xl border overflow-hidden overflow-x-auto my-4" style={{ borderColor: "var(--border)" }}>
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--card)", borderBottom: "1px solid var(--border)" }}>
                  <th className="text-left p-3 font-medium">国</th>
                  <th className="text-right p-3 font-medium">再分配ジニ係数</th>
                  <th className="text-right p-3 font-medium">貧困率</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--muted)" }}>
                {[
                  { c: "スウェーデン", g: "0.28", p: "8.9%" },
                  { c: "ドイツ",     g: "0.30", p: "10.4%" },
                  { c: "フランス",   g: "0.30", p: "8.4%" },
                  { c: "OECD平均",   g: "0.32", p: "11.4%" },
                  { c: "日本",      g: "0.38", p: "15.4%" },
                  { c: "米国",      g: "0.39", p: "15.3%" },
                ].map((r) => (
                  <tr key={r.c} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                    <td className="p-3 font-medium" style={{ color: "var(--text)" }}>{r.c}</td>
                    <td className="p-3 text-right tabular-nums">{r.g}</td>
                    <td className="p-3 text-right tabular-nums">{r.p}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            日本は<strong>米国に次ぐ高水準の格差・貧困率</strong>。
            「日本は平等な国」というイメージは、もはや事実と乖離している。
          </p>
        </Section>

        <Section heading="まとめ：『広がってはいるが、政府が抑えている』">
          <ul className="list-disc pl-5 space-y-1 my-3 text-sm" style={{ color: "var(--text)" }}>
            <li>当初所得ジニ係数は30年で+34%（=格差大幅拡大）</li>
            <li>再分配後は+4%に圧縮されている（=政府の再分配機能が働いている）</li>
            <li>相対的貧困率は15.4%、OECD平均を大きく上回る</li>
            <li>ひとり親世帯の貧困率44.5%は深刻</li>
            <li>日本は欧州諸国より格差が大きく、米国に近い水準</li>
          </ul>
        </Section>
        <Section heading="関連記事">
          <ul className="list-disc pl-5 space-y-1">
            <li><Link href="/articles/average-income-trap" className="underline" style={{ color: "var(--link)" }}>「平均年収」の罠 ─ メディアが報じない統計の落とし穴</Link></li>
            <li><Link href="/articles/generation-economic-comparison" className="underline" style={{ color: "var(--link)" }}>氷河期世代 vs Z世代 ─ 経済指標で見る「生まれた時代の不公平」</Link></li>
            <li><Link href="/articles/social-insurance-burden" className="underline" style={{ color: "var(--link)" }}>手取りが増えない本当の理由 ─ 社会保険料30年の増加</Link></li>
          </ul>
        </Section>
      </ArticleLayout>
    </>
  );
}
