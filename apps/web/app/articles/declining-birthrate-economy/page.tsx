import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { articleOpenGraph, articleSeoTitle } from "@/lib/article-metadata";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd, generateFaqPageJsonLd } from "@/lib/jsonld";

const SLUG = "declining-birthrate-economy";

export const metadata: Metadata = {
  alternates: { canonical: "/articles/declining-birthrate-economy" },
  title: articleSeoTitle(SLUG),
  description: "1990年に121万人いた出生数は2024年に73万人台へ激減。人口減少は労働力不足を招き、社会保険料の上昇と国債残高の膨張を加速させる。少子化が経済に与える連鎖をデータで追う。",
  openGraph: articleOpenGraph("declining-birthrate-economy"),
};

export default function DecliningBirthrateEconomyPage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "少子化と経済の悪循環 ─ 出生数激減が家計と社会保障に与える影響",
    description: "1990年に121万人いた出生数は2024年に73万人台へ激減。少子化が経済に与える連鎖をデータで追う。",
    slug: SLUG,
    readingTime: 6,
    tags: ["少子化", "出生数", "社会保障"],
  });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(SLUG);
  const organizationJsonLd = generateOrganizationJsonLd();
  const faqJsonLd = generateFaqPageJsonLd([
    {
      question: "日本の出生数は34年でどれくらい減りましたか？",
      answer: "1990年に約121万人だった出生数は、2024年には73万人台にまで落ち込み、34年間でおよそ40%減少しました。2016年に初めて100万人を割り込み、その後も減少が加速しており、過去最少記録が更新され続けています。",
    },
    {
      question: "少子化は経済にどんな影響を与えますか？",
      answer: "①労働力不足で経済全体のアウトプットが縮小、②支える側（現役世代）が減って社会保険料負担が増加（1990年10.8%→2024年18.5%）、③社会保障費を国債発行で補填するため国債残高が膨張（1990年180兆円→2024年1,170兆円超）、という3つの連鎖が起きます。",
    },
    {
      question: "少子化の原因は何ですか？",
      answer: "未婚率・晩婚化の進行（若年層の経済的余裕の低下）、子育て費用・教育費の高騰、長時間労働文化と仕事と育児の両立困難、住宅価格の高止まり（特に都市部）などが主な要因として挙げられます。",
    },
    {
      question: "少子化と社会保障・財政の関係はどうなっていますか？",
      answer: "出生数▼40%、社会保険料負担率+7.7pt、国債残高+550%という3つの数字は独立した問題ではなく、少子化を共通の根とする現象です。財政悪化が社会保険料引き上げを招き、子育てコストが上がってさらに少子化が進む悪循環が形成されている可能性があります。",
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
        title="少子化と経済の悪循環 ─ 出生数激減が家計と社会保障に与える影響"
        description="1990年に121万人いた出生数は2024年に73万人台へ激減。人口減少は労働力不足を招き、社会保険料の上昇と国債残高の膨張を加速させる。少子化が経済に与える連鎖をデータで追う。"
        readingTime={6}
        tags={["少子化", "出生数", "社会保障"]}
      >
        <Section heading="出生数の激減：34年で4割減">
          <p>
            1990年、日本で生まれた子どもは約121万人だった。
            それが2024年には73万人台にまで落ち込み、34年間でおよそ40%減少した。
          </p>

          <DataBox
            items={[
              { label: "1990年", value: "121万人", color: "#F59E0B" },
              { label: "2000年", value: "119万人", color: "#F59E0B" },
              { label: "2010年", value: "107万人", color: "#D97706" },
              { label: "2024年", value: "73万人台", color: "#ef4444" },
            ]}
          />

          <p>
            2016年には初めて100万人を割り込み、その後も減少が加速している。
            2022年の出生数は77.1万人、2024年には73万人台へ落ち込み、過去最少記録が更新され続けている。
          </p>
        </Section>

        <Section heading="少子化が経済に与える3つの連鎖">
          <p>
            少子化は単なる「子どもが減る」問題ではない。経済・財政・家計に以下のような連鎖反応をもたらす。
          </p>
          <div
            className="rounded-xl border p-4 space-y-3 my-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            {[
              {
                num: "①",
                title: "労働力不足 → 生産性・成長率への圧力",
                desc: "働き手が減ると経済全体のアウトプットが縮小する。企業は人手不足に陥り、賃金上昇圧力が生じる一方、サービス業の供給力低下を招く。",
              },
              {
                num: "②",
                title: "社会保険料の上昇 → 手取りの減少",
                desc: "支える側（現役世代）が減り、受け取る側（高齢者）が増えると、一人当たりの社会保険料負担が増加する。1990年の10.8%→2024年の18.5%はその結果だ。",
              },
              {
                num: "③",
                title: "国債残高の膨張 → 将来世代への負担",
                desc: "社会保障費の増大を税収だけで賄えない場合、国債発行で補填することになる。国債残高は1990年の180兆円から2024年には1,170兆円を超えた。",
              },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex gap-3">
                <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#F59E0B20", color: "#F59E0B" }}>
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

        <Section heading="出生数と社会保険料・国債残高の相関">
          <p>
            KeizaiMapのデータで出生数・社会保険料・国債残高を重ねると、少子化の深刻化と財政悪化が並行して進んでいることがわかる。
          </p>
          <DataBox
            items={[
              { label: "出生数減少率", value: "▼40%", note: "121→73万人（1990→2024）", color: "#ef4444" },
              { label: "社会保険料増加", value: "+7.7pt", note: "10.8→18.5%", color: "#ef4444" },
              { label: "国債残高増加", value: "+550%", note: "180→1,170兆円", color: "#ef4444" },
            ]}
          />
          <p>
            この3つはそれぞれ独立した問題ではなく、少子化という共通の根を持つ現象だ。
            子どもが生まれないことで労働力が減り、社会保障コストが増え、財政赤字が拡大する。
            そして財政悪化が社会保険料の引き上げを招き、子育てコストが上がってさらに少子化が進む
            ─ という悪循環が形成されている可能性がある。
          </p>
        </Section>

        <Section heading="少子化の背景">
          <p>
            出生数減少の要因として、以下がよく挙げられる。
          </p>
          <ul className="list-disc pl-5 space-y-1 my-3 text-sm" style={{ color: "var(--text)" }}>
            <li>未婚率・晩婚化の進行（若年層の経済的余裕の低下）</li>
            <li>子育て費用・教育費の高騰</li>
            <li>長時間労働文化と仕事と育児の両立困難</li>
            <li>住宅価格の高止まり（特に都市部）</li>
          </ul>
          <p>
            KeizaiMapでは住宅価格指数も確認でき、都市集中と住宅コストの関係を数字で追うことができる。
          </p>
        </Section>

        <Section heading="データで継続的に見る">
          <p>
            少子化対策として近年、育児支援・児童手当拡充・保育所整備などの施策が強化されている。
            KeizaiMapでは出生数の年次推移をリアルタイムで確認できる。
            政策の効果が数字に現れるかどうかを、継続的に観察することが重要だ。
          </p>
        </Section>
        <Section heading="関連記事">
          <ul className="list-disc pl-5 space-y-1">
            <li><Link href="/articles/social-insurance-burden" className="underline" style={{ color: "var(--link)" }}>手取りが増えない本当の理由 ─ 社会保険料30年の増加</Link></li>
            <li><Link href="/articles/national-debt-1000trillion" className="underline" style={{ color: "var(--link)" }}>国債残高1,000兆円超 ─ 日本の財政赤字をデータで理解する</Link></li>
            <li><Link href="/articles/generation-economic-comparison" className="underline" style={{ color: "var(--link)" }}>氷河期世代 vs Z世代 ─ 経済指標で見る「生まれた時代の不公平」</Link></li>
          </ul>
        </Section>
      </ArticleLayout>
    </>
  );
}
