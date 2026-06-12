import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd } from "@/lib/jsonld";

const SLUG = "yen-depreciation-real-wages";

export const metadata: Metadata = {
  alternates: { canonical: "/articles/yen-depreciation-real-wages" },
  title: "円安と実質賃金の関係【2012→2024】| KeizaiMap",
  description: "円相場が79.8円から151.8円へ90%下落した12年間、実質賃金はどう変わったのか。円安が輸出企業を潤す一方で、家計の購買力をどう圧迫したかを分析。",
  openGraph: {
    images: [{ url: "/og/article?slug=yen-depreciation-real-wages" }],
  },
};

export default function YenDepreciationRealWagesPage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "円安と実質賃金の関係【2012→2024】",
    description: "円相場が79.8円から151.8円へ90%下落した12年間、実質賃金はどう変わったのか。円安が輸出企業を潤す一方で、家計の購買力をどう圧迫したかを解く。",
    slug: SLUG,
    readingTime: 6,
    tags: ["円安", "実質賃金", "家計"],
  });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(SLUG);
  const organizationJsonLd = generateOrganizationJsonLd();

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
      <ArticleLayout
        slug={SLUG}
        title="円安と実質賃金の関係【2012→2024】"
        description="円相場が79.8円から151.8円へ90%下落した12年間、実質賃金はどう変わったのか。円安が輸出企業を潤す一方で、家計の購買力をどう圧迫したかを分析。"
        readingTime={6}
        tags={["円安", "実質賃金", "家計"]}
      >
      <Section heading="「アベノミクス」の隠れた代償：円安が家計を痛めた理由">
        <p>
          アベノミクスの最大の成果の一つが「円安」です。
          2012年の1ドル=79.8円（歴史的円高）から、
          2024年の1ドル=151.8円（34年ぶりの円安水準）へと転換しました。
        </p>
        <p>
          円安は企業（特に輸出企業）にとって朗報です。
          ドル建ての海外売上を円換算すれば、その円金額が大幅に増加するからです。
        </p>
        <p>
          しかし、同じ期間に実質賃金は97.4から96.5へ0.9%低下しました。
          この矛盾の背景には、円安が輸入物価を大幅に上昇させたという事実があります。
        </p>
      </Section>

      <Section heading="2012→2024年：円安の進行と実質賃金の関係">
        <DataBox
          items={[
            { label: "2012年",   value: "79.8円",  note: "歴史的円高", color: "#22c55e" },
            { label: "2014年",   value: "105.9円", note: "アベノミクス後2年", color: "#D97706" },
            { label: "2020年",   value: "106.8円", note: "COVID-19前", color: "#D97706" },
            { label: "2024年",   value: "151.8円", note: "34年ぶり円安", color: "#ef4444" },
          ]}
        />
        <DataBox
          items={[
            { label: "2012年", value: "97.4",  note: "実質賃金", color: "#4F8EF7" },
            { label: "2014年", value: "97.1",  note: "▼0.3%（円安加速期）", color: "#ef4444" },
            { label: "2020年", value: "96.5",  note: "横ばい", color: "#ef4444" },
            { label: "2024年", value: "99.2",  note: "回復傾向だが依然低い", color: "#ef4444" },
          ]}
        />
        <p>
          円安が最も急速に進んだ2012年〜2014年に、実質賃金は低下しました。
          2014年には97.4から97.1へ0.3%低下しており、
          この時期が「円安による家計圧迫」の最初の局面だったといえます。
        </p>
      </Section>

      <Section heading="円安が輸入物価を上昇させるメカニズム">
        <p>
          日本はエネルギー（石油・ガス）と食料の大部分を海外から輸入しています。
          これらの国際商品市場ではドル建て価格が基本です。
        </p>
        <p>
          1ドル=80円と150円では、同じドル価格のガソリンでも日本での値段が大きく異なります。
          100ドルのガソリンが80円時代は8,000円ですが、150円時代は15,000円になるのです。
        </p>
        <p>
          この「輸入物価上昇」は直ちに消費者物価（CPI）に反映されます。
        </p>
      </Section>

      <Section heading="円安による物価上昇のデータ：2012→2024年">
        <DataBox
          items={[
            { label: "2012年", value: "105.6", note: "CPI（消費者物価指数）", color: "#D97706" },
            { label: "2015年", value: "110.4", note: "+4.8pt（消費税増税含む）", color: "#D97706" },
            { label: "2020年", value: "112.4", note: "COVID-19・エネルギー危機", color: "#ef4444" },
            { label: "2024年", value: "119.9", note: "+14.3pt（全期間）", color: "#ef4444" },
          ]}
        />
        <p>
          2012年から2024年にかけて、物価は105.6から119.9へ14.3ポイント上昇しました。
          特に2022年以降、ウクライナ戦争によるエネルギー価格上昇と、
          円安による輸入物価上昇が重なり、物価上昇が加速しました。
        </p>
        <p>
          この間、実質賃金は97.4から99.2へわずか1.8ポイント上昇に留まり、
          物価上昇に追い付いていません。
        </p>
      </Section>

      <Section heading="円安による二つの世界：勝者と敗者">
        <div
          className="grid md:grid-cols-2 gap-4 my-4"
          style={{ fontSize: "0.875rem" }}
        >
          <div
            className="rounded-xl border p-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="font-medium mb-2" style={{ color: "#22c55e" }}>✓ 円安の勝者</div>
            <ul className="space-y-1 text-xs" style={{ color: "var(--muted)" }}>
              <li>• トヨタ・ホンダなど自動車メーカー</li>
              <li>• 電機メーカー（ソニー・任天堂など）</li>
              <li>• 経営層・株主</li>
              <li>• 海外事業が多い大企業</li>
            </ul>
          </div>
          <div
            className="rounded-xl border p-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="font-medium mb-2" style={{ color: "#ef4444" }}>✗ 円安の敗者</div>
            <ul className="space-y-1 text-xs" style={{ color: "var(--muted)" }}>
              <li>• 一般労働者（実質賃金低下）</li>
              <li>• 輸入品に依存する中小企業</li>
              <li>• 年金受給者（実質価値低下）</li>
              <li>• 低所得世帯（生活必需品の価格上昇）</li>
            </ul>
          </div>
        </div>
        <p>
          円安は「強い企業」と「弱い労働者」の格差を拡大させるメカニズムなのです。
        </p>
      </Section>

      <Section heading="2022年以降の加速：「ハイパー円安」と家計危機">
        <DataBox
          items={[
            { label: "2020年", value: "106.8円", note: "COVID-19直後", color: "#D97706" },
            { label: "2022年", value: "131.5円", note: "FRB利上げ加速", color: "#ef4444" },
            { label: "2024年", value: "151.8円", note: "日銀マイナス金利解除", color: "#ef4444" },
          ]}
        />
        <p>
          2022年から2024年の円安加速は、アメリカのFRB（連邦準備制度）による
          急速な利上げが原因です。
          日本銀行がマイナス金利を続ける一方で、米国の金利が5%を超えると、
          「日米金利差」が拡大し、ドルが買われ続けました。
        </p>
        <p>
          この急速な円安の結果、日本の物価は2020年の112.4から2024年の119.9へ上昇し、
          輸入物価の上昇が加速しました。
        </p>
      </Section>

      <Section heading="矛盾：円安で企業利益は上昇、実質賃金は低下">
        <DataBox
          items={[
            { label: "法人税（2012年）", value: "8.5兆円",  note: "円高時代", color: "#22c55e" },
            { label: "法人税（2024年）", value: "18.8兆円", note: "円安時代（+121%）", color: "#22c55e" },
            { label: "実質賃金（2012年）", value: "97.4",    note: "円高時代", color: "#D97706" },
            { label: "実質賃金（2024年）", value: "99.2",    note: "円安時代（+1.8%）", color: "#D97706" },
          ]}
        />
        <p>
          円安による企業利益の増加（法人税+121%）と、
          労働者の実質賃金停滞（+1.8%）という大きな格差が生まれました。
        </p>
        <p>
          企業は円安による利益を労働者に還元せず、株主配当と内部留保に充てました。
          これが「アベノミクスの成功」と「家計困窮」の同時性を生み出したのです。
        </p>
      </Section>

      <Section heading="KeizaiMapで見る「隠れた代償」">
        <p>
          KeizaiMap のグラフで「USD/JPY」（円相場）と「消費者物価（CPI）」を同時表示してください。
          2012年から2024年にかけて、円安とCPIの上昇がほぼ同期していることが分かります。
        </p>
        <p>
          さらに「実質賃金」を追加表示すれば、
          物価上昇に実質賃金が追い付いていない現実が一目瞭然です。
        </p>
      </Section>

      <Section heading="まとめ：円安は「構造的な家計圧迫」のメカニズム">
        <ul className="list-disc pl-5 space-y-1">
          <li>2012〜2024年の12年間で円安は90%進行（79.8円→151.8円）</li>
          <li>円安は輸出企業の利益を大幅に増加させた（法人税+121%）</li>
          <li>一方で、輸入物価上昇により家計は圧迫された（物価+14.3pt）</li>
          <li>実質賃金は1.8%しか上昇せず、物価上昇に追い付かず</li>
          <li>企業利益の増加が労働者に還流しないメカニズム</li>
          <li>「強い企業」と「弱い家計」の格差拡大こそがアベノミクスの遺産</li>
        </ul>
      </Section>
      <Section heading="関連記事">
        <ul className="list-disc pl-5 space-y-1">
          <li><Link href="/articles/yen-depreciation" className="underline" style={{ color: "var(--link)" }}>円安が進む仕組みと日本経済への影響</Link></li>
          <li><Link href="/articles/real-wages" className="underline" style={{ color: "var(--link)" }}>実質賃金とは？なぜ日本人の生活は豊かになった実感がないのか</Link></li>
          <li><Link href="/articles/yen-purchasing-power-decline" className="underline" style={{ color: "var(--link)" }}>日本の通貨価値はどれだけ下がったか ─ ドル建てで見る30年</Link></li>
        </ul>
      </Section>
    </ArticleLayout>
    </>
  );
}
