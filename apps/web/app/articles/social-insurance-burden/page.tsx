import type { Metadata } from "next";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import Link from "next/link";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd } from "@/lib/jsonld";

const SLUG = "social-insurance-burden";

export const metadata: Metadata = {
  alternates: { canonical: "/articles/social-insurance-burden" },
  title: "手取りが増えない本当の理由 ─ 社会保険料30年の増加をデータで見る | KeizaiMap",
  description: "給与が上がっても手取りが増えない。その原因のひとつが社会保険料の上昇だ。1990年の10.8%から2024年の18.5%へ、34年で約8ポイント増加した社会保険料負担率をデータで読む。",
  openGraph: {
    images: [{ url: "/og/article?slug=social-insurance-burden" }],
  },
};

export default function SocialInsuranceBurdenPage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "手取りが増えない本当の理由 ─ 社会保険料30年の増加をデータで見る",
    description: "給与が上がっても手取りが増えない。その原因のひとつが社会保険料の上昇だ。1990年の10.8%から2024年の18.5%へ増加した社会保険料負担率の実態をデータで読む。",
    slug: SLUG,
    readingTime: 5,
    tags: ["社会保険料", "手取り", "可処分所得"],
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
        title="手取りが増えない本当の理由 ─ 社会保険料30年の増加をデータで見る"
        description="給与が上がっても手取りが増えない。その原因のひとつが社会保険料の上昇だ。1990年の10.8%から2024年の18.5%へ増加した社会保険料負担率の実態をデータで読む。"
        readingTime={5}
        tags={["社会保険料", "手取り", "可処分所得"]}
      >
        <Section heading="なぜ手取りは増えないのか">
          <p>
            給与明細を見ると、健康保険・厚生年金・介護保険・雇用保険といった控除項目が並んでいる。
            これらをまとめて「社会保険料」と呼ぶ。
          </p>
          <p>
            名目の給与が多少上がっても、この社会保険料の増加分が手取りの伸びを相殺し続けてきた。
            それが「給与が上がった気がしないのに、手取りはあまり変わっていない」という感覚の正体のひとつだ。
          </p>
        </Section>

        <Section heading="34年間で約8ポイント上昇した社会保険料負担率">
          <p>
            KeizaiMapのデータによると、社会保険料負担率（社会保障負担率）は次のように推移している。
          </p>

          <DataBox
            items={[
              { label: "1990年", value: "10.8%", color: "#10B981" },
              { label: "2000年", value: "13.8%", color: "#10B981" },
              { label: "2010年", value: "15.8%", color: "#F59E0B" },
              { label: "2024年", value: "18.5%", color: "#ef4444" },
            ]}
          />

          <p>
            1990年から2024年の34年間で、社会保険料負担率は約7.7ポイント増加した。
            この数字は、かつて「給与の約1割強」だった社会保険料が「約2割弱」へと増えたことを意味する。
          </p>
          <p>
            仮に月給30万円の会社員を想定すると、1990年基準では社会保険料は月約3.2万円だったが、
            2024年基準では約5.6万円となる計算だ。この差額2.4万円が、34年間の「見えない手取り減少」の一端を表している。
          </p>
        </Section>

        <Section heading="社会保険料はどこに行くのか">
          <p>
            社会保険料の主な使途は以下の通りだ。
          </p>
          <div
            className="rounded-xl border p-4 space-y-2 my-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            {[
              { label: "厚生年金保険料", desc: "老齢・障害・遺族年金の財源。労使折半で負担。" },
              { label: "健康保険料", desc: "病気・けがの医療費。高齢者医療への拠出も含む。" },
              { label: "介護保険料", desc: "40歳以上が負担。増加する介護サービス費用を支える。" },
              { label: "雇用保険料", desc: "失業給付・育児休業給付などの財源。" },
            ].map(({ label, desc }) => (
              <div key={label} className="flex gap-3">
                <span className="shrink-0 text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: "#10B98120", color: "#10B981" }}>
                  {label}
                </span>
                <span className="text-xs" style={{ color: "var(--muted)" }}>{desc}</span>
              </div>
            ))}
          </div>
          <p>
            いずれも少子高齢化が進むほど費用が膨らむ構造を持つ。
            支える側（現役世代）が減り、受け取る側（高齢者・要介護者）が増えるほど、
            一人当たりの負担は増え続ける。
          </p>
        </Section>

        <Section heading="実質賃金との二重苦">
          <p>
            社会保険料の増加は、実質賃金の停滞と重なり合って家計を圧迫している。
          </p>
          <DataBox
            items={[
              { label: "実質賃金（1990=100）", value: "99.2", note: "34年でほぼ横ばい", color: "#4F8EF7" },
              { label: "社会保険料負担率", value: "+7.7pt", note: "10.8%→18.5%", color: "#ef4444" },
              { label: "消費者物価（1990=100）", value: "119.9", note: "約20%上昇", color: "#D97706" },
            ]}
          />
          <p>
            賃金は実質で横ばい、物価は2割上昇、さらに社会保険料負担が増加。
            この3つが同時に起きたことが、多くの人が「生活が苦しくなった」と感じる数字上の根拠となっている。
          </p>
        </Section>

        <Section heading="今後の見通し">
          <p>
            少子高齢化がさらに進む今後、社会保険料負担率は上昇圧力が続くとみられる。
            一方で、給付水準の見直しや就労延長・移民政策など、様々な対応策が議論されている。
          </p>
          <p>
            KeizaiMapでは社会保険料負担率の推移を実質賃金・税収とともに確認できる。
            手取りを取り巻く構造を、データで継続的に観察してほしい。
          </p>
          <p>
            手取りに関連する記事：
          </p>
          <ul className="list-disc pl-5 space-y-1 my-2">
            <li>
              <Link href="/articles/real-take-home-pay-30years" className="underline" style={{ color: "var(--link)" }}>
                年収500万でも30年前の年収300万に負けている？─ 実質手取りで見る30年
              </Link>
            </li>
            <li>
              <Link href="/articles/declining-birthrate-economy" className="underline" style={{ color: "var(--link)" }}>
                少子化と経済の悪循環 ─ 出生数激減が社会保障に与える影響
              </Link>
            </li>
            <li>
              <Link href="/articles/real-wages" className="underline" style={{ color: "var(--link)" }}>
                実質賃金とは？なぜ日本人の生活は豊かになった実感がないのか
              </Link>
            </li>
          </ul>
        </Section>
      </ArticleLayout>
    </>
  );
}
