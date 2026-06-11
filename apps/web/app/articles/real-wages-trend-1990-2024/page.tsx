import type { Metadata } from "next";
import Script from "next/script";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd } from "@/lib/jsonld";

const SLUG = "real-wages-trend-1990-2024";

export const metadata: Metadata = {
  title: "日本の実質賃金推移【1990〜2024】データ分析 | KeizaiMap",
  description: "バブル期の1990年を100とした実質賃金指数は34年後の2024年に99.2と0.8%低下。デフレ・リーマンショック・消費税増税・円安インフレの4つの局面で賃金がどう変化したかを時系列で分析。",
  openGraph: {
    images: [{ url: "/og/article?slug=real-wages-trend-1990-2024" }],
  },
};

export default function RealWagesTrendPage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "日本の実質賃金推移【1990〜2024】データ分析",
    description: "34年間で0.8%低下した実質賃金の全像。10年ごとの変動と転機、物価との乖離を数字で追う。",
    slug: SLUG,
    readingTime: 6,
    tags: ["実質賃金", "データ分析", "34年推移"],
  });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(SLUG);
  const organizationJsonLd = generateOrganizationJsonLd();

  return (
    <>
      <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="org-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <ArticleLayout
        slug={SLUG}
        title="日本の実質賃金推移【1990〜2024】データ分析"
        description="34年間で0.8%低下した実質賃金の全像。1990年を100とした場合、10年ごとの変動と物価との乖離を数字で追う。"
        readingTime={6}
        tags={["実質賃金", "データ分析", "34年推移"]}
      >
      <Section heading="バブル期と失われた30年：実質賃金の4つの時期">
        <p>
          1990年から2024年までの34年間、日本の実質賃金は8つの転機を経験しています。
          バブル崩壊直後の落ち込み、デフレによる一時的な回復、アベノミクスによる期待、
          そして最近の物価上昇による圧迫——これらが実質賃金にどう映ったのか、
          KeizaiMap のデータから読み解きます。
        </p>
      </Section>

      <Section heading="1990年代：バブル崩壊と金融危機（1990→2000）">
        <DataBox
          items={[
            { label: "1990年",   value: "100.0", note: "バブル期のピーク", color: "#4F8EF7" },
            { label: "1992年",   value: "107.2", note: "一時的な上昇", color: "#4F8EF7" },
            { label: "1998年",   value: "109.5", note: "金融危機直前のピーク", color: "#4F8EF7" },
            { label: "2000年",   value: "107.8", note: "-0.2%（1998年比）", color: "#4F8EF7" },
          ]}
        />
        <p>
          バブル崩壊直後の1990年代前半は意外と実質賃金が上昇しています。
          これはデフレの初期段階で、物価が落ちる速度が賃金低下より早かったためです。
          しかし1997年の消費税3→5%引き上げと1998年の金融危機により、
          この「見かけの繁栄」は終焉を迎えます。
        </p>
      </Section>

      <Section heading="2000年代：デフレの深刻化（2000→2010）">
        <DataBox
          items={[
            { label: "2000年",   value: "107.8", note: "2000年代の開始", color: "#4F8EF7" },
            { label: "2002年",   value: "104.1", note: "デフレ最悪時", color: "#ef4444" },
            { label: "2006年",   value: "105.8", note: "小泉改革末期", color: "#D97706" },
            { label: "2010年",   value: "101.9", note: "リーマン後の回復途上", color: "#ef4444" },
          ]}
        />
        <p>
          2000年代は日本経済のもっとも困難な時期でした。
          2002年には実質賃金は104.1まで低下し、その後も回復は緩やかでした。
          デフレ環境で企業は賃上げを控え、労働者の実質購買力は徐々に侵食されていきました。
        </p>
      </Section>

      <Section heading="2010年代：アベノミクス期待と失望（2010→2020）">
        <DataBox
          items={[
            { label: "2010年",   value: "101.9", note: "リーマン危機から回復中", color: "#D97706" },
            { label: "2012年",   value: "97.4",  note: "アベノミクス開始", color: "#ef4444" },
            { label: "2014年",   value: "96.3",  note: "消費税8%増税直後", color: "#ef4444" },
            { label: "2020年",   value: "96.5",  note: "COVID-19発生時", color: "#ef4444" },
          ]}
        />
        <p>
          アベノミクスは株価と円安をもたらしましたが、実質賃金には悪影響を及ぼしました。
          2012年から2020年にかけて、実質賃金は97.4から96.5へ0.9%低下しました。
          名目賃金はある程度上昇しても、物価上昇（特に消費税増税と輸入物価上昇）がそれを上回ったためです。
        </p>
      </Section>

      <Section heading="2020年代：インフレと消費者物価の急上昇（2020→2024）">
        <DataBox
          items={[
            { label: "2020年",   value: "96.5",  note: "パンデミック開始", color: "#ef4444" },
            { label: "2022年",   value: "95.8",  note: "円安加速＋インフレ本格化", color: "#ef4444" },
            { label: "2024年",   value: "99.2",  note: "4年ぶりの上昇", color: "#ef4444" },
          ]}
        />
        <p>
          2022年以降、日本経済は劇的な変化を遂行しました。
          ロシア・ウクライナ戦争によるエネルギー価格上昇、円安加速、アメリカのインフレ輸入により、
          日本の物価は急速に上昇しました。
          実質賃金は一度は95.8まで低下しましたが、2024年には99.2へ回復しました。
          ただし、これは物価上昇の加速度が落ちているだけで、購買力の抜本的改善ではありません。
        </p>
      </Section>

      <Section heading="物価との乖離：なぜ実質賃金は停滞したのか">
        <DataBox
          items={[
            { label: "実質賃金", value: "99.2", note: "1990年比 -0.8%", color: "#ef4444" },
            { label: "物価（CPI）", value: "119.9", note: "1990年比 +19.9%", color: "#D97706" },
            { label: "乖離",       value: "-20.7%", note: "物価上昇が購買力を侵食", color: "#ef4444" },
          ]}
        />
        <p>
          最も重要なのは、34年間を通して物価が実質賃金の上昇を上回ったという事実です。
          名目賃金はプラスであっても、物価上昇（特に必需品）がそれを超えば、
          実際に買える商品・サービスの量は減少します。
          日本の場合、この乖離が生活の「しんどさ」の本質です。
        </p>
      </Section>

      <Section heading="KeizaiMapで見る全体図">
        <p>
          KeizaiMapの「グラフ」タブで「実質賃金」と「消費者物価（CPI）」を同時に表示してください。
          二本の線の乖離の大きさが、日本の家計が直面している現実です。
        </p>
        <p>
          「政権比較」タブで各政権期間の実質賃金変化を見比べれば、
          どの時代がもっとも家計に優しく、どの時代がもっとも厳しかったのかが一目瞭然です。
        </p>
      </Section>

      <Section heading="まとめ：停滞する実質賃金の謎">
        <ul className="list-disc pl-5 space-y-1">
          <li>1990→2024年：実質賃金 99.2（-0.8%）、物価 119.9（+19.9%）</li>
          <li>バブル崩壊後、デフレ期待で一時回復も、2000年代に再び低下</li>
          <li>アベノミクスで株高・円安が進むも、実質賃金は停滞</li>
          <li>2020年代の物価上昇により、家計の購買力はさらに圧迫</li>
          <li>名目値ではなく、実質値（物価調整済み）で経済を判断することの重要性</li>
        </ul>
      </Section>
    </ArticleLayout>
    </>
  );
}
