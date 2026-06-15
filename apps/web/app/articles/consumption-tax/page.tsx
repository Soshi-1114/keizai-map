import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { articleOpenGraph, articleSeoTitle } from "@/lib/article-metadata";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd, generateFaqPageJsonLd } from "@/lib/jsonld";

const SLUG = "consumption-tax";

export const metadata: Metadata = {
  alternates: { canonical: "/articles/consumption-tax" },
  title: articleSeoTitle(SLUG),
  description: "1989年の3%導入から2019年の10%まで、消費税率はどのように変化し、家計や経済にどんな影響を与えてきたか。消費者物価指数のデータとあわせて振り返る。",
  openGraph: articleOpenGraph("consumption-tax"),
};

export default function ConsumptionTaxPage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "消費税率引き上げの歴史と家計への影響",
    description: "1989年の3%導入から2019年の10%まで、消費税はどのように変化してきたのか。各増税のタイミングで物価や税収にどんな変化があったかをデータで確認します。",
    slug: SLUG,
    readingTime: 4,
    tags: ["消費税", "税収", "物価"],
  });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(SLUG);
  const organizationJsonLd = generateOrganizationJsonLd();
  const faqJsonLd = generateFaqPageJsonLd([
  {
    "question": "消費税とは何ですか？",
    "answer": "消費税は商品やサービスの購入時にかかる間接税です。日本では1989年に3%で導入され、1997年に5%、2014年に8%、2019年に10%（飲食料品等は8%の軽減税率）へと段階的に引き上げられてきました。"
  },
  {
    "question": "消費税はいつから始まりましたか？",
    "answer": "日本の消費税は1989年（平成元年）4月1日に税率3%で導入されました。その後1997年に5%、2014年に8%、2019年に10%（軽減税率8%）へと引き上げられています。"
  },
  {
    "question": "消費税の増税後、家計はどう変わりましたか？",
    "answer": "消費税増税の都度、消費者物価指数（CPI）は上昇する一方で実質賃金は低下する傾向が見られます。特に1997年の3%→5%増税前後は、日本の長期停滞の転機の一つとされています。2025年のデータでは1990年を100としたCPIが123.7まで上昇した一方、実質賃金は97.9と1990年水準を下回っています。"
  },
  {
    "question": "消費税収はどのくらいありますか？",
    "answer": "2025年度の一般会計税収は80.7兆円（過去最高）で、そのうち消費税収は約25兆円程度（税収全体の約3割）を占めます。消費税は景気変動の影響を受けにくい安定財源として、社会保障財源の柱となっています。"
  }
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
      <script id="faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ArticleLayout
        slug={SLUG}
        title="消費税率引き上げの歴史と家計への影響"
        description="1989年の3%導入から2019年の10%まで、消費税はどのように変化してきたのか。各増税のタイミングで物価や税収にどんな変化があったかをデータで確認します。"
        readingTime={4}
        tags={["消費税", "税収", "物価"]}
      >
      <Section heading="消費税とは">
        <p>
          消費税は、商品・サービスの消費に対して課税される間接税です。
          最終消費者が負担し、事業者を通じて国に納められます。
          直接税（所得税・法人税など）と異なり、景気変動の影響を受けにくく、
          安定した税収を確保できることが特徴です。
        </p>
        <p>
          日本の消費税収は、社会保障（年金・医療・介護・少子化対策）の財源として位置づけられており、
          税率の引き上げとともに社会保障費の増加を賄う目的が繰り返し説明されてきました。
        </p>
      </Section>

      <Section heading="消費税率の変遷：1989〜2019年">
        <p>
          日本の消費税は、1989年（平成元年）に竹下登内閣のもとで3%として導入されました。
          以来、4回の税率変更を経て現在の10%に至っています。
        </p>

        <div
          className="rounded-xl border overflow-hidden my-4"
          style={{ borderColor: "var(--border)" }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "var(--card)", color: "var(--muted)" }}>
                <th className="text-left p-3 font-medium">時期</th>
                <th className="text-left p-3 font-medium">税率</th>
                <th className="text-left p-3 font-medium">内閣</th>
              </tr>
            </thead>
            <tbody>
              {[
                { year: "1989年4月", rate: "3%", pm: "竹下登" },
                { year: "1997年4月", rate: "5%", pm: "橋本龍太郎" },
                { year: "2014年4月", rate: "8%", pm: "安倍晋三" },
                { year: "2019年10月", rate: "10%（軽減税率8%）", pm: "安倍晋三" },
              ].map((row, i) => (
                <tr
                  key={row.year}
                  className="border-t"
                  style={{ borderColor: "var(--border)", backgroundColor: i % 2 === 0 ? "transparent" : "var(--card)" }}
                >
                  <td className="p-3">{row.year}</td>
                  <td className="p-3 font-medium" style={{ color: "#E05C5C" }}>{row.rate}</td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>{row.pm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section heading="各増税と物価・税収への影響">
        <p>
          消費税の引き上げは、消費者物価指数（CPI）に直接影響を与えます。
          KeizaiMap のデータから各時点の変化を確認できます。
        </p>

        <DataBox
          items={[
            { label: "1996年（5%前）", value: "107.1", note: "CPI指数（1990=100）", color: "#D97706" },
            { label: "1998年（5%後）", value: "109.7", note: "+2.6pt上昇", color: "#D97706" },
            { label: "2012年（8%前）", value: "105.6", note: "CPI指数", color: "#D97706" },
            { label: "2014年（8%後）", value: "109.2", note: "+3.6pt上昇", color: "#D97706" },
          ]}
        />

        <p>
          <strong>1997年（3→5%）</strong>：橋本政権による増税と同時期に、アジア通貨危機・
          金融機関の相次ぐ破綻が重なり、消費が大きく落ち込みました。
          翌1998年には税収が49.4兆円まで減少（1996年の52.1兆円から）しています。
        </p>
        <p>
          <strong>2014年（5→8%）</strong>：安倍政権下での引き上げ。
          直前の2012年に比べ2014年のCPIは3.6ポイント上昇し、実質賃金への下押し圧力となりました。
          消費の落ち込みは予想を超え、2015年に予定していた10%への引き上げを2年延期する要因のひとつとなりました。
        </p>
        <p>
          <strong>2019年（8→10%）</strong>：食料品・新聞などに8%の軽減税率が導入されました。
          増税直後にコロナ禍（2020年）が重なったため、単独の影響を切り分けることは難しい状況です。
        </p>
      </Section>

      <Section heading="税収と社会保障の関係">
        <p>
          KeizaiMapのデータでは、一般会計税収の推移を確認できます。
          消費税導入以降、税収構造は大きく変化しました。
        </p>
        <DataBox
          items={[
            { label: "1990年", value: "60.1兆円", color: "#E05C5C" },
            { label: "2002年（最低）", value: "43.8兆円", color: "#ef4444" },
            { label: "2020年", value: "60.8兆円", color: "#E05C5C" },
            { label: "2025年", value: "80.7兆円", note: "過去最高", color: "#22c55e" },
          ]}
        />
        <p>
          消費税は景気変動の影響を受けにくい安定財源として、
          税収全体に占める割合を高めてきました。
          一方、税負担の逆進性（低所得者ほど負担割合が高い）という問題は、
          軽減税率の導入でも完全には解消されていない点が指摘されています。
        </p>
      </Section>
      <Section heading="関連記事">
        <ul className="list-disc pl-5 space-y-1">
          <li><Link href="/articles/consumption-tax-wage-price" className="underline" style={{ color: "var(--link)" }}>消費税増税後の物価と賃金の変化【1997→2019】</Link></li>
          <li><Link href="/articles/social-insurance-burden" className="underline" style={{ color: "var(--link)" }}>手取りが増えない本当の理由 ─ 社会保険料30年の増加</Link></li>
          <li><Link href="/articles/real-wages" className="underline" style={{ color: "var(--link)" }}>実質賃金とは？なぜ日本人の生活は豊かになった実感がないのか</Link></li>
        </ul>
      </Section>
    </ArticleLayout>
    </>
  );
}
