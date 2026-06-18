import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { articleOpenGraph, articleSeoTitle, articleRobots } from "@/lib/article-metadata";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd, generateFaqPageJsonLd } from "@/lib/jsonld";

const SLUG = "real-wages-trend-1990-2024";

export const metadata: Metadata = {
  alternates: { canonical: "/articles/real-wages-trend-1990-2024" },
  title: articleSeoTitle(SLUG),
  description: "バブル期の1990年を100とした実質賃金指数は35年後の2025年に97.9と2.1%低下。デフレ・リーマンショック・消費税増税・円安インフレの4つの局面で賃金がどう変化したかを時系列で分析。",
  openGraph: articleOpenGraph("real-wages-trend-1990-2024"),
  robots: articleRobots(SLUG),
};

export default function RealWagesTrendPage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "日本の実質賃金推移【1990〜2025】データ分析",
    description: "35年間で2.1%低下した実質賃金の全像。10年ごとの変動と転機、物価との乖離を数字で追う。",
    slug: SLUG,
    readingTime: 6,
    tags: ["実質賃金", "データ分析", "35年推移"],
  });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(SLUG);
  const organizationJsonLd = generateOrganizationJsonLd();
  const faqJsonLd = generateFaqPageJsonLd([
    {
      question: "1990年から2025年で実質賃金はどれくらい変化しましたか？",
      answer: "1990年を100とすると、2025年の実質賃金は97.9となり、35年間で2.1%低下しました。同期間に物価（CPI）は123.7まで約23.7%上昇しており、物価との乖離が家計の購買力を圧迫しています。",
    },
    {
      question: "実質賃金が最も低かったのはいつですか？",
      answer: "実質賃金の底はリーマンショック後の2010年（98.5）と、アベノミクス末期からコロナ初年度の2020年（96.5）でした。1998年の金融危機までは109.5の高水準だった水準と比べると、約13ポイントの低下となっています。直近では2024年の99.2から2025年の97.9へ再び低下しています。",
    },
    {
      question: "アベノミクスで実質賃金は上昇しましたか？",
      answer: "2012年（97.4）から2020年（96.5）にかけて、実質賃金は0.9%低下しました。アベノミクスは株価と円安をもたらしましたが、消費税増税と輸入物価上昇による物価上昇が名目賃金の上昇を上回ったため、実質賃金は伸び悩みました。",
    },
    {
      question: "2022年以降に実質賃金は回復していますか？",
      answer: "2020年の96.5から2022年の97.8、2024年の99.2へと一時回復しましたが、2025年は97.9へ再び低下。1990年水準（100）には依然届いていません。CPI 119.9→123.7のさらなる物価上昇が春闘5%超の賃上げを実質ベースで打ち消しています。",
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
        title="日本の実質賃金推移【1990〜2025】データ分析"
        description="35年間で2.1%低下した実質賃金の全像。1990年を100とした場合、10年ごとの変動と物価との乖離を数字で追う。"
        readingTime={6}
        tags={["実質賃金", "データ分析", "35年推移"]}
      >
      <Section heading="バブル期と失われた35年：実質賃金の4つの時期">
        <p>
          1990年から2025年までの35年間、日本の実質賃金は8つの転機を経験しています。
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
            { label: "2002年",   value: "104.1", note: "デフレ深刻化期", color: "#ef4444" },
            { label: "2006年",   value: "103.4", note: "小泉改革末期", color: "#D97706" },
            { label: "2010年",   value: "98.5",  note: "リーマン後の低水準", color: "#ef4444" },
          ]}
        />
        <p>
          2000年代は日本経済の困難な時期でした。
          2000年の107.8から2010年の98.5へ約9ポイントも低下し、長期下落基調が続きました。
          デフレ環境で企業は賃上げを控え、労働者の実質購買力は徐々に侵食されていきました。
        </p>
      </Section>

      <Section heading="2010年代：アベノミクス期待と失望（2010→2020）">
        <DataBox
          items={[
            { label: "2010年",   value: "98.5",  note: "リーマン後の低水準", color: "#D97706" },
            { label: "2012年",   value: "97.4",  note: "アベノミクス開始", color: "#ef4444" },
            { label: "2014年",   value: "97.1",  note: "消費税8%増税年", color: "#ef4444" },
            { label: "2020年",   value: "96.5",  note: "COVID-19発生時", color: "#ef4444" },
          ]}
        />
        <p>
          アベノミクスは株価と円安をもたらしましたが、実質賃金は伸び悩みました。
          2012年から2020年にかけて、実質賃金は97.4から96.5へ0.9%低下しました。
          名目賃金は緩やかに上昇したものの、消費税増税と輸入物価上昇による物価上昇がそれを上回ったためです。
        </p>
      </Section>

      <Section heading="2020年代：インフレと消費者物価の急上昇（2020→2025）">
        <DataBox
          items={[
            { label: "2020年",   value: "96.5",  note: "パンデミック開始", color: "#ef4444" },
            { label: "2022年",   value: "97.8",  note: "円安加速＋インフレ本格化", color: "#D97706" },
            { label: "2024年",   value: "99.2",  note: "コロナ後の戻り高値", color: "#D97706" },
            { label: "2025年",   value: "97.9",  note: "物価高で再び低下", color: "#ef4444" },
          ]}
        />
        <p>
          2022年以降、日本経済は大きな変化を経験しました。
          ロシア・ウクライナ戦争によるエネルギー価格上昇、円安加速、海外発のインフレ波及により、
          日本の物価は急速に上昇しました。
          実質賃金は2020年の96.5から2022年の97.8、2024年の99.2へと一時回復しましたが、
          2025年は春闘5%超の高賃上げにもかかわらず97.9へ再び低下。物価上昇が賃上げを実質ベースで打ち消す構図が続いています。
        </p>
      </Section>

      <Section heading="物価との乖離：なぜ実質賃金は停滞したのか">
        <DataBox
          items={[
            { label: "実質賃金", value: "97.9", note: "1990年比 -2.1%", color: "#ef4444" },
            { label: "物価（CPI）", value: "123.7", note: "1990年比 +23.7%", color: "#D97706" },
            { label: "乖離",       value: "-25.8%", note: "物価上昇が購買力を侵食", color: "#ef4444" },
          ]}
        />
        <p>
          最も重要なのは、35年間を通して物価が実質賃金の上昇を上回ったという事実です。
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
          <li>1990→2025年：実質賃金 97.9（-2.1%）、物価 123.7（+23.7%）</li>
          <li>バブル崩壊後、デフレ期待で一時回復も、2000年代に再び低下</li>
          <li>アベノミクスで株高・円安が進むも、実質賃金は停滞</li>
          <li>2020年代の物価上昇により、家計の購買力はさらに圧迫</li>
          <li>名目値ではなく、実質値（物価調整済み）で経済を判断することの重要性</li>
        </ul>
      </Section>
      <Section heading="関連記事">
        <ul className="list-disc pl-5 space-y-1">
          <li><Link href="/articles/real-wages" className="underline" style={{ color: "var(--link)" }}>実質賃金とは？なぜ日本人の生活は豊かになった実感がないのか</Link></li>
          <li><Link href="/articles/abenomics-real-wages-analysis" className="underline" style={{ color: "var(--link)" }}>アベノミクスで実質賃金は上がったのか？</Link></li>
          <li><Link href="/articles/shunto-2025-real-impact" className="underline" style={{ color: "var(--link)" }}>2025年 春闘・賃上げの実態 ─ 過去30年で最高水準だが家計に届くか</Link></li>
        </ul>
      </Section>
    </ArticleLayout>
    </>
  );
}
