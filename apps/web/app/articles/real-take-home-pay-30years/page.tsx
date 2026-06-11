import type { Metadata } from "next";
import Script from "next/script";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd } from "@/lib/jsonld";

const SLUG = "real-take-home-pay-30years";

export const metadata: Metadata = {
  title: "年収500万でも、30年前の年収300万に負けている？─ 実質手取りで見る30年 | KeizaiMap",
  description:
    "名目の年収が増えても、社会保険料・消費税・物価上昇で実質手取りは目減りしている。年収300万・500万・800万の3パターンで「実質手取り」を1990年と2024年で比較する。",
  openGraph: {
    title: "年収500万でも、30年前の年収300万に負けている？─ 実質手取りで見る30年",
    images: [{ url: `/og/article?slug=${SLUG}` }],
  },
};

export default function RealTakeHomePay30YearsPage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "年収500万でも、30年前の年収300万に負けている？─ 実質手取りで見る30年",
    description: "社会保険料・消費税・物価で実質手取りは目減り。3パターンで1990年と2024年を比較。",
    slug: SLUG,
    readingTime: 7,
    tags: ["年収", "実質手取り", "社会保険料"],
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
        title="年収500万でも、30年前の年収300万に負けている？─ 実質手取りで見る30年"
        description="名目の年収が増えても、社会保険料・消費税・物価上昇で実質手取りは目減りしている。年収300万・500万・800万の3パターンで「実質手取り」を1990年と2024年で比較する。"
        readingTime={7}
        tags={["年収", "実質手取り", "社会保険料"]}
      >
        <Section heading="名目年収は同じでも、生活は同じではない">
          <p>
            「年収500万円」と聞くと、なんとなく「中流の安定した暮らし」を想像する。
            しかしこの500万円が<strong>1990年の500万円</strong>なのか<strong>2024年の500万円</strong>なのかで、実際の生活水準は大きく異なる。
          </p>
          <p>
            その差を生むのが、社会保険料・消費税・物価上昇の3つだ。
            この記事では、KeizaiMap のデータをもとに、年収300万・500万・800万のそれぞれで「実質手取り」を試算する。
          </p>
        </Section>

        <Section heading="実質手取りの計算式">
          <div
            className="rounded-xl p-4 my-4 text-sm leading-relaxed"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
          >
            <p className="font-semibold mb-2" style={{ color: "var(--text)" }}>
              実質手取り ＝（年収 − 税金 − 社会保険料）÷ 物価指数
            </p>
            <p style={{ color: "var(--muted)" }}>
              ・税金：所得税＋住民税（簡略化のため概算）<br />
              ・社会保険料：KeizaiMap の「社会保険料負担率」を年収に乗算<br />
              ・物価指数：KeizaiMap の CPI（1990=100）で割って実質化
            </p>
          </div>
          <p>
            1990年と2024年の前提条件は次のとおり。
          </p>
          <DataBox
            items={[
              { label: "1990年 社会保険料率", value: "10.8%", color: "#10B981" },
              { label: "2024年 社会保険料率", value: "18.5%", note: "+7.7pt", color: "#ef4444" },
              { label: "1990年 CPI",         value: "100.0",  color: "#D97706" },
              { label: "2024年 CPI",         value: "119.9",  note: "+19.9%", color: "#D97706" },
            ]}
          />
        </Section>

        <Section heading="ケース1：年収300万円の30年">
          <p>
            年収300万円のサラリーマンの手取りを比較する。
            所得税・住民税は概算で年収の約7%、社会保険料率は KeizaiMap の数値を使う。
          </p>

          <div className="rounded-xl border overflow-hidden overflow-x-auto my-4" style={{ borderColor: "var(--border)" }}>
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--card)", borderBottom: "1px solid var(--border)" }}>
                  <th className="text-left p-3 font-medium">年</th>
                  <th className="text-right p-3 font-medium">年収</th>
                  <th className="text-right p-3 font-medium">税金</th>
                  <th className="text-right p-3 font-medium">社保</th>
                  <th className="text-right p-3 font-medium">名目手取り</th>
                  <th className="text-right p-3 font-medium">実質手取り</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--muted)" }}>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  <td className="p-3 font-medium" style={{ color: "var(--text)" }}>1990年</td>
                  <td className="p-3 text-right tabular-nums">300万</td>
                  <td className="p-3 text-right tabular-nums">21万</td>
                  <td className="p-3 text-right tabular-nums">32.4万</td>
                  <td className="p-3 text-right tabular-nums">246.6万</td>
                  <td className="p-3 text-right tabular-nums font-bold" style={{ color: "var(--text)" }}>246.6万</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium" style={{ color: "var(--text)" }}>2024年</td>
                  <td className="p-3 text-right tabular-nums">300万</td>
                  <td className="p-3 text-right tabular-nums">21万</td>
                  <td className="p-3 text-right tabular-nums">55.5万</td>
                  <td className="p-3 text-right tabular-nums">223.5万</td>
                  <td className="p-3 text-right tabular-nums font-bold" style={{ color: "#ef4444" }}>186.4万</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            名目の年収が同じ300万円でも、実質手取りは<strong>246.6万円 → 186.4万円</strong>へと約25%減少している。
            つまり「30年前の年収300万円の人と同じ生活水準」を維持するには、2024年では年収約400万円が必要になる計算だ。
          </p>
        </Section>

        <Section heading="ケース2：年収500万円の30年">
          <p>
            次は年収500万円。所得税・住民税は累進課税のため約10%とする。
          </p>
          <div className="rounded-xl border overflow-hidden overflow-x-auto my-4" style={{ borderColor: "var(--border)" }}>
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--card)", borderBottom: "1px solid var(--border)" }}>
                  <th className="text-left p-3 font-medium">年</th>
                  <th className="text-right p-3 font-medium">年収</th>
                  <th className="text-right p-3 font-medium">税金</th>
                  <th className="text-right p-3 font-medium">社保</th>
                  <th className="text-right p-3 font-medium">名目手取り</th>
                  <th className="text-right p-3 font-medium">実質手取り</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--muted)" }}>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  <td className="p-3 font-medium" style={{ color: "var(--text)" }}>1990年</td>
                  <td className="p-3 text-right tabular-nums">500万</td>
                  <td className="p-3 text-right tabular-nums">50万</td>
                  <td className="p-3 text-right tabular-nums">54万</td>
                  <td className="p-3 text-right tabular-nums">396万</td>
                  <td className="p-3 text-right tabular-nums font-bold" style={{ color: "var(--text)" }}>396万</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium" style={{ color: "var(--text)" }}>2024年</td>
                  <td className="p-3 text-right tabular-nums">500万</td>
                  <td className="p-3 text-right tabular-nums">50万</td>
                  <td className="p-3 text-right tabular-nums">92.5万</td>
                  <td className="p-3 text-right tabular-nums">357.5万</td>
                  <td className="p-3 text-right tabular-nums font-bold" style={{ color: "#ef4444" }}>298.2万</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            年収500万円の実質手取りは<strong>396万円 → 298.2万円</strong>へと約25%減少。
            これは<strong>1990年の年収約376万円相当</strong>でしかない。
          </p>
          <p>
            つまり「2024年に年収500万円の暮らし」は、「1990年の年収376万円の暮らし」と同等という計算になる。
            「年収500万円なのに余裕がない」と感じる原因がここにある。
          </p>
        </Section>

        <Section heading="ケース3：年収800万円の30年">
          <p>所得税・住民税は約15%とする。</p>
          <div className="rounded-xl border overflow-hidden overflow-x-auto my-4" style={{ borderColor: "var(--border)" }}>
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--card)", borderBottom: "1px solid var(--border)" }}>
                  <th className="text-left p-3 font-medium">年</th>
                  <th className="text-right p-3 font-medium">年収</th>
                  <th className="text-right p-3 font-medium">税金</th>
                  <th className="text-right p-3 font-medium">社保</th>
                  <th className="text-right p-3 font-medium">名目手取り</th>
                  <th className="text-right p-3 font-medium">実質手取り</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--muted)" }}>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  <td className="p-3 font-medium" style={{ color: "var(--text)" }}>1990年</td>
                  <td className="p-3 text-right tabular-nums">800万</td>
                  <td className="p-3 text-right tabular-nums">120万</td>
                  <td className="p-3 text-right tabular-nums">86.4万</td>
                  <td className="p-3 text-right tabular-nums">593.6万</td>
                  <td className="p-3 text-right tabular-nums font-bold" style={{ color: "var(--text)" }}>593.6万</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium" style={{ color: "var(--text)" }}>2024年</td>
                  <td className="p-3 text-right tabular-nums">800万</td>
                  <td className="p-3 text-right tabular-nums">120万</td>
                  <td className="p-3 text-right tabular-nums">148万</td>
                  <td className="p-3 text-right tabular-nums">532万</td>
                  <td className="p-3 text-right tabular-nums font-bold" style={{ color: "#ef4444" }}>443.7万</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            年収800万円でも実質手取りは<strong>593.6万円 → 443.7万円</strong>へと約25%減少。
            高年収帯でも、約150万円分の購買力を失っていることになる。
          </p>
        </Section>

        <Section heading="3パターンに共通する3つの圧迫要因">
          <div
            className="rounded-xl border p-4 space-y-3 my-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            {[
              { num: "①", title: "社会保険料の上昇（+7.7pt）", desc: "1990年10.8% → 2024年18.5%。少子高齢化に伴い、現役世代の負担は今後も上昇圧力が続く。" },
              { num: "②", title: "消費税の創設・引き上げ（0%→10%）", desc: "1989年に3%導入、2019年に10%へ。所得から税金が引かれた後の支出にも追加で10%が課される。" },
              { num: "③", title: "物価上昇（+19.9%）", desc: "1990→2024で CPI は約20%上昇。2020年以降だけで7%上昇しており、近年の物価上昇速度が高まっている。" },
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

        <Section heading="まとめ：「同じ年収」では同じ暮らしは買えない">
          <ul className="list-disc pl-5 space-y-1 my-3 text-sm" style={{ color: "var(--text)" }}>
            <li>名目年収が同じでも、実質手取りは1990年比で約25%減少</li>
            <li>年収500万円の暮らしは、1990年の年収約376万円相当</li>
            <li>社会保険料 +7.7pt / 消費税 +10pt / 物価 +20% の三重苦</li>
            <li>「年収を上げる」だけでは追いつかない構造になっている</li>
          </ul>
          <p>
            KeizaiMap で社会保険料・物価・賃金の推移を重ねて表示すると、この圧迫構造を一目で確認できる。
          </p>
        </Section>
      </ArticleLayout>
    </>
  );
}
