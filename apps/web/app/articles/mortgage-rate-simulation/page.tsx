import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { articleOpenGraph, articleSeoTitle } from "@/lib/article-metadata";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd, generateFaqPageJsonLd } from "@/lib/jsonld";

const SLUG = "mortgage-rate-simulation";

export const metadata: Metadata = {
  alternates: { canonical: "/articles/mortgage-rate-simulation" },
  title: articleSeoTitle(SLUG),
  description:
    "2024年3月、日銀はマイナス金利を解除。1990年代初頭の8%台から2022年の0.4%まで下がった住宅ローン金利は、ここから上昇に転じる可能性が高い。借入額別の月返済額シミュレーションを提示する。",
  openGraph: articleOpenGraph("mortgage-rate-simulation"),
};

export default function MortgageRateSimulationPage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "日銀利上げで住宅ローンはどうなる？─ 金利推移と家計シミュレーション",
    description: "住宅ローン金利推移と借入額別の月返済シミュレーション。",
    slug: SLUG,
    readingTime: 7,
    tags: ["住宅ローン", "金利", "日銀"],
  });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(SLUG);
  const organizationJsonLd = generateOrganizationJsonLd();
  const faqJsonLd = generateFaqPageJsonLd([
    {
      question: "住宅ローン変動金利は30年でどう変わりましたか？",
      answer: "1990年に8.5%だった変動金利は、2000年に2.4%、2016年に0.5%、2022年に0.4%まで20倍以上の下落となりました。2024年の日銀利上げ後は約0.6%に上昇しており、長く続いた異常な低金利時代が転換点を迎えています。",
    },
    {
      question: "金利上昇で月返済額はどれくらい変わりますか？",
      answer: "借入3,500万円・35年返済の場合、金利0.4%なら月8.9万円、1.5%なら月10.7万円となり、月約1.8万円の増加（35年通算で749万円の追加負担）になります。借入5,000万円なら金利2%で月16.6万円、年収700万円世帯の手取りの36%が返済に消える計算です。",
    },
    {
      question: "変動金利と固定金利、どちらを選ぶべきですか？",
      answer: "変動金利は月返済額に余裕があり繰上返済を予定している人、短期で売却・完済する見込みの人に向いています。固定金利は金利上昇リスクを取りたくない人、家計のキャッシュフローを長期で予測したい人、35年フルローンを組む人に向いています。",
    },
    {
      question: "今後5年で住宅ローン金利はどうなりますか？",
      answer: "3つのシナリオが想定されます。緩やかな利上げで2028年に住宅ローン変動金利1.0〜1.2%、中位で年0.5%程度の利上げで1.5〜2.0%、急速利上げで2〜3%台。フラット35の固定金利は1.8%前後で、金利が2%上昇すると変動の方が高くなります。",
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
        title="日銀利上げで住宅ローンはどうなる？─ 金利推移と家計シミュレーション"
        description="2024年3月、日銀はマイナス金利を解除。1990年代初頭の8%台から2022年の0.4%まで下がった住宅ローン金利は、ここから上昇に転じる可能性が高い。借入額別の月返済額シミュレーションを提示する。"
        readingTime={7}
        tags={["住宅ローン", "金利", "日銀"]}
      >
        <Section heading="日銀利上げ、住宅ローン保有者への影響は？">
          <p>
            2024年3月、日本銀行は約8年続いたマイナス金利政策を解除し、政策金利を引き上げた。
            さらに2024年7月にも追加利上げを実施。<strong>「金利のある世界」への転換</strong>が本格化している。
          </p>
          <p>
            住宅ローン金利は政策金利と連動するため、変動型ローンを契約している人にとって、これは無視できない動きだ。
            この記事では、過去30年の住宅ローン金利推移と、金利別の月返済額シミュレーションを提示する。
          </p>
        </Section>

        <Section heading="住宅ローン金利の30年推移">
          <DataBox
            items={[
              { label: "1990年 変動金利", value: "8.5%", note: "バブル末期",       color: "#ef4444" },
              { label: "2000年 変動金利", value: "2.4%", note: "ゼロ金利時代",     color: "#D97706" },
              { label: "2016年 変動金利", value: "0.5%", note: "マイナス金利下",   color: "#22c55e" },
              { label: "2022年 変動金利", value: "0.4%", note: "歴史的最低",       color: "#22c55e" },
              { label: "2024年 変動金利", value: "≒0.6%", note: "利上げ後",        color: "#D97706" },
            ]}
          />
          <p>
            <strong>1990年に8.5%だった変動金利は、2022年には0.4%まで20倍以上の下落</strong>。
            この異常な低金利が住宅価格上昇を支え、「家賃を払うより買った方が得」という時代を作ってきた。
            しかし2024年から流れが変わりつつある。
          </p>
        </Section>

        <Section heading="借入3,500万円・35年返済の月返済額シミュレーション">
          <div className="rounded-xl border overflow-hidden overflow-x-auto my-4" style={{ borderColor: "var(--border)" }}>
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--card)", borderBottom: "1px solid var(--border)" }}>
                  <th className="text-left p-3 font-medium">金利</th>
                  <th className="text-right p-3 font-medium">月返済額</th>
                  <th className="text-right p-3 font-medium">総返済額</th>
                  <th className="text-right p-3 font-medium">利息合計</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--muted)" }}>
                {[
                  { r: "0.4%（2022年水準）", m: "8.9万円",  t: "3,749万円", i: "249万円" },
                  { r: "1.0%",            m: "9.9万円",  t: "4,148万円", i: "648万円" },
                  { r: "1.5%",            m: "10.7万円", t: "4,498万円", i: "998万円" },
                  { r: "2.0%",            m: "11.6万円", t: "4,864万円", i: "1,364万円" },
                  { r: "3.0%",            m: "13.5万円", t: "5,649万円", i: "2,149万円" },
                  { r: "5.0%",            m: "17.7万円", t: "7,420万円", i: "3,920万円" },
                ].map((r) => (
                  <tr key={r.r} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                    <td className="p-3 font-medium" style={{ color: "var(--text)" }}>{r.r}</td>
                    <td className="p-3 text-right tabular-nums">{r.m}</td>
                    <td className="p-3 text-right tabular-nums">{r.t}</td>
                    <td className="p-3 text-right tabular-nums">{r.i}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            金利が0.4% → 1.5%に上昇すると、<strong>月返済額が約1.8万円増加</strong>。
            35年通算では749万円の追加負担になる。
            これは家計にとって、決して小さくない影響だ。
          </p>
        </Section>

        <Section heading="借入5,000万円・35年返済のシミュレーション">
          <p>首都圏で新築マンションを買う場合の借入額（5,000万円）でも試算する。</p>
          <div className="rounded-xl border overflow-hidden overflow-x-auto my-4" style={{ borderColor: "var(--border)" }}>
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--card)", borderBottom: "1px solid var(--border)" }}>
                  <th className="text-left p-3 font-medium">金利</th>
                  <th className="text-right p-3 font-medium">月返済額</th>
                  <th className="text-right p-3 font-medium">利息合計</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--muted)" }}>
                {[
                  { r: "0.4%", m: "12.7万円", i: "355万円" },
                  { r: "1.0%", m: "14.1万円", i: "925万円" },
                  { r: "1.5%", m: "15.3万円", i: "1,425万円" },
                  { r: "2.0%", m: "16.6万円", i: "1,950万円" },
                  { r: "3.0%", m: "19.3万円", i: "3,070万円" },
                ].map((r) => (
                  <tr key={r.r} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                    <td className="p-3 font-medium" style={{ color: "var(--text)" }}>{r.r}</td>
                    <td className="p-3 text-right tabular-nums">{r.m}</td>
                    <td className="p-3 text-right tabular-nums">{r.i}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            金利が2%まで上昇すると、月返済額は16.6万円。年収700万円世帯の手取り（約540万円）の36%が住宅ローン返済に消える計算だ。
          </p>
        </Section>

        <Section heading="日銀利上げシナリオ：今後5年で何が起きるか">
          <p>
            日銀の見通しと市場予測を踏まえると、政策金利は今後5年で以下のシナリオが想定される。
          </p>
          <div className="rounded-xl border p-4 space-y-3 my-4" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <div>
              <div className="font-semibold" style={{ color: "#22c55e" }}>🟢 緩やかな利上げシナリオ</div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                政策金利を年0.25%ずつ引き上げ、2028年に1.0%程度。住宅ローン変動金利は1.0〜1.2%。家計への影響は緩やか。
              </p>
            </div>
            <div>
              <div className="font-semibold" style={{ color: "#D97706" }}>🟡 中位シナリオ</div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                インフレ進行で年0.5%程度の利上げ。2028年に政策金利2%。住宅ローン変動金利は1.5〜2.0%へ。
              </p>
            </div>
            <div>
              <div className="font-semibold" style={{ color: "#ef4444" }}>🔴 急速利上げシナリオ</div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                円安加速・インフレ高止まりで、年1%以上の急速利上げ。住宅ローン金利は2〜3%台。家計を直撃。
              </p>
            </div>
          </div>
        </Section>

        <Section heading="変動 vs 固定、どちらを選ぶべきか">
          <div
            className="rounded-xl border p-4 space-y-3 my-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <div>
              <div className="font-semibold" style={{ color: "var(--text)" }}>変動金利が向いている人</div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                月返済額に余裕がある（金利上昇に耐えられる）、繰上返済を積極的に行う予定、短期で売却 or 完済する見込みがある。
              </p>
            </div>
            <div>
              <div className="font-semibold" style={{ color: "var(--text)" }}>固定金利が向いている人</div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                金利上昇リスクを取りたくない、家計のキャッシュフローを長期で予測したい、35年フルローンを組んでいる。
              </p>
            </div>
          </div>
          <p>
            2024年現在、フラット35（35年固定）の金利は1.8%前後。変動0.6%との差は1.2%。
            <strong>金利が今後2%上昇すると変動の方が高くなる</strong>ため、固定への切替を検討する価値が出てくる。
          </p>
        </Section>

        <Section heading="まとめ：金利のある世界に備える">
          <ul className="list-disc pl-5 space-y-1 my-3 text-sm" style={{ color: "var(--text)" }}>
            <li>住宅ローン変動金利は30年で8.5% → 0.4%まで20倍下落</li>
            <li>2024年から利上げ局面入りし、すでに0.6%程度に上昇</li>
            <li>金利1.5%まで上がると月返済額は1.8〜2万円増</li>
            <li>変動 vs 固定の選択は「金利上昇に耐えられるか」が判断軸</li>
            <li>繰上返済・借換え・固定化など、複数の選択肢を検討すべき</li>
          </ul>
        </Section>
        <Section heading="関連記事">
          <ul className="list-disc pl-5 space-y-1">
            <li><Link href="/articles/housing-price" className="underline" style={{ color: "var(--link)" }}>なぜ若者は家を買えないのか ─ 住宅価格と賃金の34年</Link></li>
            <li><Link href="/articles/yen-depreciation" className="underline" style={{ color: "var(--link)" }}>円安が進む仕組みと日本経済への影響</Link></li>
            <li><Link href="/articles/nisa-vs-savings" className="underline" style={{ color: "var(--link)" }}>新NISA vs 貯金 ─ データで考える「30年寝かせるならどっち」</Link></li>
          </ul>
        </Section>
      </ArticleLayout>
    </>
  );
}
