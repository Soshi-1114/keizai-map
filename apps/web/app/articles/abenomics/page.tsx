import type { Metadata } from "next";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import Link from "next/link";
import { articleOpenGraph, articleSeoTitle, articleRobots } from "@/lib/article-metadata";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd, generateFaqPageJsonLd } from "@/lib/jsonld";

const SLUG = "abenomics";

export const metadata: Metadata = {
  alternates: { canonical: "/articles/abenomics" },
  title: articleSeoTitle(SLUG),
  description: "2012年末に始まったアベノミクスの「3本の矢」を解説。8年間で税収は43.9兆円から60.8兆円へ増加し、円安も大幅に進んだ。実質賃金への影響はどうだったか。",
  openGraph: articleOpenGraph("abenomics"),
  robots: articleRobots(SLUG),
};

export default function AbenomicsPage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "アベノミクスとは何か ─ 3本の矢と経済指標の変化",
    description: "2012年末に第二次安倍政権が掲げた経済政策「アベノミクス」。8年間の在任期間中に賃金・物価・税収・為替はどう変化したか、データで確認します。",
    slug: SLUG,
    readingTime: 5,
    tags: ["アベノミクス", "金融政策", "税収"],
  });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(SLUG);
  const organizationJsonLd = generateOrganizationJsonLd();
  const faqJsonLd = generateFaqPageJsonLd([
    {
      question: "アベノミクスとは何ですか？",
      answer: "アベノミクスとは、2012年12月に発足した第二次安倍晋三内閣が推進した経済政策の総称です。「3本の矢」と呼ばれる大胆な金融政策・機動的な財政政策・民間投資を喚起する成長戦略の3本柱で構成されていました。",
    },
    {
      question: "アベノミクスの「3本の矢」とは何ですか？",
      answer: "第1の矢は日銀による量的・質的金融緩和（QQE）でインフレ目標2%を設定。第2の矢は公共投資の拡大などの積極的な財政出動。第3の矢は規制緩和・女性活躍推進・農業改革などの構造改革による成長戦略です。",
    },
    {
      question: "アベノミクスで税収や為替はどう変化しましたか？",
      answer: "2012〜2020年の8年間で、税収は43.9兆円から60.8兆円へ約38.5%増加しました。円相場は1ドル=79.8円の歴史的円高から106.8円へと約33.8%円安が進み、輸出企業の収益を押し上げました。",
    },
    {
      question: "アベノミクスで実質賃金は上がりましたか？",
      answer: "アベノミクス8年間で実質賃金は97.4から96.5へ0.9%低下しました。名目賃金は上昇したものの、消費税増税（5→8→10%）と物価上昇（CPI+6.4%）がそれを上回り、実質的な購買力の改善には至りませんでした。",
    },
  ]);
  return (
    <>
      <script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        id="org-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ArticleLayout
        slug={SLUG}
        title="アベノミクスとは何か ─ 3本の矢と経済指標の変化"
        description="2012年末に第二次安倍政権が掲げた経済政策「アベノミクス」。8年間の在任期間中に賃金・物価・税収・為替はどう変化したか、データで確認します。"
        readingTime={5}
        tags={["アベノミクス", "金融政策", "税収"]}
      >
      <Section heading="アベノミクスとは">
        <p>
          アベノミクスとは、2012年12月に発足した第二次安倍晋三内閣が推進した一連の経済政策の総称です。
          「3本の矢」と呼ばれる政策の柱で構成されていました。
        </p>
        <div
          className="rounded-xl border p-4 space-y-2 my-4"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        >
          {[
            { n: "第1の矢", title: "大胆な金融政策", desc: "日本銀行による量的・質的金融緩和（QQE）。インフレ目標2%を設定し、大規模な国債購入を実施。" },
            { n: "第2の矢", title: "機動的な財政政策", desc: "公共投資の拡大など、積極的な財政出動で需要を喚起。" },
            { n: "第3の矢", title: "民間投資を喚起する成長戦略", desc: "規制緩和・女性活躍推進・農業改革など構造改革を推進。" },
          ].map(({ n, title, desc }) => (
            <div key={n} className="flex gap-3">
              <span
                className="shrink-0 text-xs font-bold px-2 py-0.5 rounded"
                style={{ backgroundColor: "var(--indigo-tint)", color: "var(--link)" }}
              >
                {n}
              </span>
              <div>
                <div className="text-sm font-medium">{title}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section heading="8年間の経済指標の変化（2012→2020）">
        <p>
          安倍政権は2020年9月まで継続し、憲政史上最長の在任期間となりました。
          この8年間、KeizaiMapの各指標はどのように変化したでしょうか。
        </p>

        <DataBox
          items={[
            { label: "実質賃金",    value: "▼0.9%",  note: "97.4→96.5",   color: "#ef4444" },
            { label: "物価（CPI）", value: "＋6.4%",  note: "105.6→112.4", color: "#D97706" },
            { label: "税収",        value: "＋38.5%", note: "43.9→60.8兆円", color: "#22c55e" },
            { label: "円/ドル",     value: "＋33.8%", note: "79.8→106.8円（円安）", color: "#4FD9A0" },
          ]}
        />

        <p>
          税収は43.9兆円から60.8兆円へ大幅に回復しました。
          これはアベノミクスによる企業業績の改善・株高・消費税増税（5→8%）の効果が合わさった結果です。
        </p>
        <p>
          円相場は歴史的な円高水準（1ドル=79.8円）から107円台の円安へと転換しました。
          輸出企業の収益を押し上げた一方、エネルギーや食料の輸入コスト増加をもたらしました。
        </p>
        <p>
          実質賃金は、わずかながら下落（97.4→96.5）しています。
          名目賃金はある程度上昇したものの、消費税増税と物価上昇がそれを上回り、
          実質的な購買力の改善には至りませんでした。
        </p>
      </Section>

      <Section heading="マイナス金利と「異次元緩和」の副作用">
        <p>
          2016年2月、日本銀行はマイナス金利政策を導入しました。
          銀行が日銀に預ける当座預金の一部に▲0.1%の金利を適用し、
          融資や投資を促進することを狙った政策です。
        </p>
        <p>
          しかしマイナス金利は銀行の収益を圧迫し、住宅ローン金利の低下で
          住宅投資は一定の刺激を受けた一方、企業の設備投資や賃金への波及は限定的でした。
          インフレ目標2%も達成されないまま、コロナ禍へと突入することになります。
        </p>
      </Section>

      <Section heading="アベノミクスの評価">
        <p>
          アベノミクスに対する評価は現在も分かれています。
          肯定的な見方としては「デフレ脱却の道筋をつけた」「雇用を増やした（失業率の低下）」、
          否定的な見方としては「実質賃金が改善しなかった」「財政赤字の拡大」などが挙げられます。
        </p>
        <p>
          KeizaiMapでは特定の政策への評価を行わず、データをそのまま提示しています。
          政権比較モードで他の政権期間と比較し、ご自身で判断することができます。
        </p>
        <p>
          詳しく分析したい方は以下の記事もご覧ください：
        </p>
        <ul className="list-disc pl-5 space-y-1 my-2">
          <li>
            <Link href="/articles/abenomics-real-wages-analysis" className="underline" style={{ color: "var(--link)" }}>
              アベノミクスで実質賃金は上がったのか？─ 8年間のデータで政策効果を検証
            </Link>
          </li>
          <li>
            <Link href="/articles/yen-depreciation" className="underline" style={{ color: "var(--link)" }}>
              円安が進む仕組みと日本経済への影響
            </Link>
          </li>
          <li>
            <Link href="/articles/nikkei-vs-wages" className="underline" style={{ color: "var(--link)" }}>
              日経平均は最高値なのに、なぜ生活は豊かにならないのか
            </Link>
          </li>
        </ul>
      </Section>
    </ArticleLayout>
    </>
  );
}
