import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { articleOpenGraph, articleSeoTitle } from "@/lib/article-metadata";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd, generateFaqPageJsonLd } from "@/lib/jsonld";

const SLUG = "abenomics-real-wages-analysis";

export const metadata: Metadata = {
  alternates: { canonical: "/articles/abenomics-real-wages-analysis" },
  title: articleSeoTitle(SLUG),
  description: "2012〜2020年のアベノミクス8年間で実質賃金は0.9%低下。株価は上昇し円安が進む中、なぜ実質賃金だけが下落したのか。消費税増税・非正規雇用増加・物価上昇の影響をデータで検証。",
  openGraph: articleOpenGraph("abenomics-real-wages-analysis"),
};

export default function AbenomicsRealWagesPage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "アベノミクスで実質賃金は上がったのか？",
    description: "2012〜2020年のアベノミクス期間、実質賃金は97.4から96.5へ0.9%低下。株価・円相場・税収が上昇する中、なぜ実質賃金だけが下落したのか。",
    slug: SLUG,
    readingTime: 7,
    tags: ["アベノミクス", "実質賃金", "政策評価"],
  });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(SLUG);
  const organizationJsonLd = generateOrganizationJsonLd();
  const faqJsonLd = generateFaqPageJsonLd([
    {
      question: "アベノミクスで実質賃金は本当に下がったのですか？",
      answer: "はい。2012年から2020年のアベノミクス8年間で、実質賃金は97.4から96.5へ0.9%低下しました。名目賃金は5.4%上昇しましたが、物価が6.4%上昇したため、購買力は逆に減少しました。",
    },
    {
      question: "なぜ株価は上がったのに実質賃金は下がったのですか？",
      answer: "アベノミクスで企業利益は大幅に増え（法人税収は2012年の8.5兆円から2020年の18.8兆円へ121%増加）ました。しかし企業は利益を株主還元や経営層の報酬増に充てることを優先し、労働者への賃上げに反映されなかったためです。",
    },
    {
      question: "消費税増税は実質賃金にどう影響しましたか？",
      answer: "2014年の5→8%増税で物価指数は2012年比3.6ポイント上昇しました。2019年には8→10%へ引き上げられ、軽減税率導入後も物価は上昇。消費税増税のたびに購買力が圧迫され、実質賃金の低下要因となりました。",
    },
    {
      question: "円安はアベノミクスでどう進みましたか？",
      answer: "円相場は2012年の79.8円（歴史的円高）から2020年の106.8円まで下落しました。円安は輸出企業（自動車メーカー等）の利益を増やした一方、石油・ガス・食料の輸入に頼る日本の家計では生活コストの上昇を招きました。",
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
        title="アベノミクスで実質賃金は上がったのか？"
        description="2012〜2020年、実質賃金は97.4から96.5へ0.9%低下。株価と円相場は上昇する中、なぜ実質賃金だけが下落したのか。8年間のデータで検証。"
        readingTime={7}
        tags={["アベノミクス", "実質賃金", "政策評価"]}
      >
      <Section heading="「成功」の矛盾：株価は上がったのに給料は下がった">
        <p>
          2012年末、安倍晋三首相が掲げた経済政策「アベノミクス」は、
          多くの指標で「成功」をもたらしたとされています。
        </p>
        <p>
          株価は大幅に上昇、円は大きく下落し、企業の利益は増加、
          失業率は改善と、一見すると経済回復の象徴に見えました。
        </p>
        <p>
          しかし、労働者にとって最も重要な指標である「実質賃金」は、
          8年間で0.9%低下しました。
          この矛盾は、アベノミクスの本質を問う重要な問いかけです。
        </p>
      </Section>

      <Section heading="アベノミクス8年間の経済指標比較">
        <DataBox
          items={[
            { label: "実質賃金",    value: "▼0.9%",  note: "97.4→96.5", color: "#ef4444" },
            { label: "名目賃金",    value: "▲5.4%",  note: "物価上昇に届かず", color: "#22c55e" },
            { label: "物価（CPI）", value: "▲6.4%",  note: "105.6→112.4", color: "#D97706" },
            { label: "消費税",      value: "5→8→10%", note: "2度の引き上げ", color: "#D97706" },
          ]}
        />
        <p>
          ここに矛盾があります。名目賃金が上昇していても、実質賃金は0.9%低下しました。
          これは物価上昇（6.4%）が名目賃金上昇を上回ったことを意味します。
        </p>
        <p>
          特に重要なのは、消費税が5%から8%、さらに10%へと段階的に引き上げられ、
          その都度、物価が上昇したという事実です。
        </p>
      </Section>

      <Section heading="矛盾の原因1：消費税増税による物価上昇">
        <DataBox
          items={[
            { label: "2012年（5%）",  value: "105.6", note: "消費税 5%", color: "#D97706" },
            { label: "2014年（8%）",  value: "109.2", note: "消費税 8%（+3.6pt上昇）", color: "#ef4444" },
            { label: "2019年（10%）", value: "112.4", note: "消費税 10%（軽減税率8%）", color: "#ef4444" },
          ]}
        />
        <p>
          2014年の消費税5→8%引き上げ前後で、物価指数は2012年比3.6ポイント上昇しました。
          この時期、企業の賃上げは限定的で、労働者の購買力は大きく圧迫されました。
        </p>
        <p>
          政府は「経済成長による税収増加で社会保障を支える」と説明していましたが、
          現実には労働者は減税ではなく増税による物価上昇を受け取ったのです。
        </p>
      </Section>

      <Section heading="矛盾の原因2：円安による輸入物価上昇">
        <DataBox
          items={[
            { label: "2012年",   value: "79.8円",  note: "歴史的円高", color: "#22c55e" },
            { label: "2014年",   value: "105.9円", note: "円安が急加速", color: "#D97706" },
            { label: "2020年",   value: "106.8円", note: "さらに円安", color: "#ef4444" },
          ]}
        />
        <p>
          アベノミクスの主要な政策効果は「円安」でした。
          日本銀行の大規模緩和により、円は79.8円から106.8円まで下落しました。
        </p>
        <p>
          円安は輸出企業（トヨタなど自動車メーカー）の利益を増加させました。
          しかし、日本は石油・ガス・食料の大部分を輸入に依存しているため、
          円安は直ちに家計の生活コストを上昇させたのです。
        </p>
      </Section>

      <Section heading="矛盾の原因3：企業利益の労働者への還流がない">
        <DataBox
          items={[
            { label: "法人税",     value: "8.5兆円", note: "2012年", color: "#22c55e" },
            { label: "法人税",     value: "18.8兆円", note: "2020年（+121%）", color: "#22c55e" },
            { label: "実質賃金",   value: "97.4", note: "2012年", color: "#D97706" },
            { label: "実質賃金",   value: "96.5", note: "2020年（-0.9%）", color: "#ef4444" },
          ]}
        />
        <p>
          アベノミクスで企業の利益は大幅に増加しました。
          法人税だけで見ても、2012年の8.5兆円から2020年の18.8兆円へと約121%増加しています。
        </p>
        <p>
          しかし、この利益の増加は、労働者への賃上げには反映されませんでした。
          企業は利益を株主還元（配当・自社株買収）と経営層の報酬増加に充てることを優先しました。
        </p>
      </Section>

      <Section heading="政策意図と現実のギャップ">
        <p>
          アベノミクスの「3本の矢」（金融緩和・財政出動・成長戦略）の狙いは、
          トリクルダウン理論に基づいていました。
          つまり、企業や富裕層が豊かになれば、その豊かさが労働者にも滲み出るという想定です。
        </p>
        <p>
          しかし、KeizaiMap のデータが示すのは、この理論の破綻です。
          企業利益が増加しても、労働者の実質賃金は停滞したままでした。
        </p>
      </Section>

      <Section heading="KeizaiMapで検証する">
        <p>
          KeizaiMap の「政権比較」タブで安倍②政権（2012-2020）を選択すれば、
          この期間の実質賃金、物価、税収、円相場の変化を一目で比較できます。
        </p>
        <p>
          「グラフ」タブで1990年からの長期データを眺めれば、
          アベノミクスがこの30年の経済停滞の流れを本質的には変えていないことが分かります。
        </p>
      </Section>

      <Section heading="まとめ：成功と失敗の同時性">
        <ul className="list-disc pl-5 space-y-1">
          <li>株価・円相場では「成功」：株価は2倍近く上昇、円は円高から円安へ</li>
          <li>企業利益でも「成功」：法人税収は倍以上に増加</li>
          <li>労働者の実質賃金では「失敗」：0.9%低下、物価上昇に追い付かず</li>
          <li>消費税増税と円安による物価上昇が、賃上げを上回った</li>
          <li>企業の利益増加が労働者に還流しない構造的問題</li>
          <li>「政策の成功」と「家計の困窮」は同時に存在した</li>
        </ul>
      </Section>
      <Section heading="関連記事">
        <ul className="list-disc pl-5 space-y-1">
          <li><Link href="/articles/abenomics" className="underline" style={{ color: "var(--link)" }}>アベノミクスとは何か ─ 3本の矢と経済指標の変化</Link></li>
          <li><Link href="/articles/consumption-tax-wage-price" className="underline" style={{ color: "var(--link)" }}>消費税増税後の物価と賃金の変化【1997→2019】</Link></li>
          <li><Link href="/articles/real-wages-trend-1990-2024" className="underline" style={{ color: "var(--link)" }}>日本の実質賃金推移【1990〜2024】データ分析</Link></li>
        </ul>
      </Section>
    </ArticleLayout>
    </>
  );
}
