import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { LiveDataBox } from "@/components/LiveDataBox";
import { articleOpenGraph, articleSeoTitle } from "@/lib/article-metadata";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd, generateFaqPageJsonLd } from "@/lib/jsonld";

const SLUG = "yen-purchasing-power-decline";

export const metadata: Metadata = {
  alternates: { canonical: "/articles/yen-purchasing-power-decline" },
  title: articleSeoTitle(SLUG),
  description:
    "円安と物価上昇のダブルパンチで、円の購買力は急減している。ドル建て換算した最低賃金・日経平均・GDPで日本経済を見直すと、別の風景が見えてくる。",
  openGraph: articleOpenGraph("yen-purchasing-power-decline"),
};

export default function YenPurchasingPowerDeclinePage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "日本の通貨価値はどれだけ下がったか ─ ドル建てで見る35年",
    description: "円安と物価で購買力は急減。ドル建ての最低賃金・日経平均で日本経済を見直す。",
    slug: SLUG,
    readingTime: 6,
    tags: ["円安", "購買力", "ドル建て"],
  });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(SLUG);
  const organizationJsonLd = generateOrganizationJsonLd();
  const faqJsonLd = generateFaqPageJsonLd([
    {
      question: "日本の最低賃金はドル建てで見るとどう変化していますか？",
      answer: "全国加重平均最低賃金は1990年の約474円から2025年に1,121円と円ベースで約2.4倍に上昇しました。しかしドル建てで見ると、2012年の$9.49/時を頂点に2025年は$7.49/時へ約21%下落しています。世界基準で見れば労働の価値が下がっているのです。",
    },
    {
      question: "日経平均はドル建てで見ても史上最高値ですか？",
      answer: "2025年末の日経平均は約49,400円÷149.7円で約$330、1989年12月末（38,915円÷144.8円で約$269）を約23%上回り、ドル建てでも35年ぶりにバブル期高値を超えました。ただしS&P500がこの間に約15倍になったことと比較すれば、株価成長の遅れは際立ちます。",
    },
    {
      question: "ドル建てGDPで日本は何位ですか？",
      answer: "2025年時点で日本のドル建てGDPは約$4.2兆で世界5位です。1995年（$5.5兆）は2位、2012年（$6.2兆）は3位、2023年にドイツに抜かれて4位に、2025年にはインドに抜かれて5位に転落しました。円安進行と人口減少が背景にあります。",
    },
    {
      question: "なぜドル建てで日本経済を見ることが重要なのですか？",
      answer: "原油・半導体・AIクラウド・海外旅行・留学費用・輸入食品など、国際的なモノ・サービスの価格はほとんどがドル建てで決まります。円安が進めば円ベースで自動的に値上がりするため、ドル建てで稼げないことは海外モノが買えなくなることを意味します。",
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
        title="日本の通貨価値はどれだけ下がったか ─ ドル建てで見る35年"
        description="円安と物価上昇のダブルパンチで、円の購買力は急減している。ドル建て換算した最低賃金・日経平均・GDPで日本経済を見直すと、別の風景が見えてくる。"
        readingTime={6}
        tags={["円安", "購買力", "ドル建て"]}
      >
        <Section heading="円の話を、ドルで見直す">
          <p>
            日本のニュースは「円ベース」で経済を語ることが多い。
            「日経平均は史上最高値を更新」「最低賃金は1,000円超」──ところが
            これらの数字を<strong>ドル建て</strong>に換算してみると、まったく別の景色が見える。
          </p>
          <p>
            円安が進むと、国際的に見たときの日本人の「購買力」は急速に減少する。
            この記事では3つの指標をドル建てで再評価する。
          </p>
        </Section>

        <Section heading="まずは前提：USD/JPY の30年">
          <LiveDataBox
            items={[
              { year: 1995, key: "fx", label: "1995年" },
              { year: 2011, key: "fx", label: "2011年（円高ピーク）" },
              { year: 2012, key: "fx", label: "2012年" },
              { year: 2025, key: "fx", label: "2025年（最新）" },
            ]}
          />
          <p>
            1995年に1ドル94円、2011年には1ドル79.8円まで進んだ超円高は、
            2012年末のアベノミクス開始以降に大きく転換。2024年に1ドル151.8円、2025年も149.7円と高止まりしている。
            <strong>13年間で約88%の円安進行</strong>だ。
          </p>
        </Section>

        <Section heading="ドル建て最低賃金で見る日本の労働価値">
          <p>
            日本の全国加重平均最低賃金は、1990年の約474円から2025年の1,121円へと約2.4倍に上昇している。
            「最低賃金は確実に上がっている」というのは円ベースでの事実だ。
            では<strong>ドル建て</strong>ではどうか。
          </p>

          <DataBox
            items={[
              { label: "1990年", value: "$3.27/時", note: "474円 ÷ 144.8円", color: "#4FD9A0" },
              { label: "2000年", value: "$5.91/時", note: "637円 ÷ 107.8円", color: "#4FD9A0" },
              { label: "2012年", value: "$9.49/時", note: "757円 ÷ 79.8円",  color: "#4FD9A0" },
              { label: "2024年", value: "$6.95/時", note: "1055円 ÷ 151.8円", color: "#ef4444" },
              { label: "2025年", value: "$7.49/時", note: "1121円 ÷ 149.7円", color: "#ef4444" },
            ]}
          />

          <p>
            ドル建ての最低賃金は、<strong>2012年の$9.49を頂点に、2025年は$7.49まで下落</strong>している。
            円ベースで賃金は上がっているのに、世界基準で見ると13年で約21%も<strong>労働の価値が下がった</strong>ことになる。
          </p>
          <p>
            参考までに2025年の最低賃金（時給）の国際比較は次のとおりだ：
          </p>
          <ul className="list-disc pl-5 space-y-1 my-3 text-sm" style={{ color: "var(--text)" }}>
            <li>米国（連邦） $7.25 → 日本とほぼ同水準</li>
            <li>カリフォルニア州 $16.00 → 日本の2倍以上</li>
            <li>オーストラリア $15.75 → 日本の2倍超</li>
            <li>ドイツ €12.41（約$13.5） → 日本の約2倍</li>
          </ul>
          <p>「日本の最低賃金が安すぎる」というニュースの背景には、この円安進行がある。</p>
        </Section>

        <Section heading="ドル建て日経平均で見る『株高』の実像">
          <p>
            2024年、日経平均はバブル期高値の3万9,000円台を更新。2025年にはさらに上昇し約4万9,000円となり、
            メディアは「史上最高値」と連日報じた。ではドル建てではどうだろうか。
          </p>

          <DataBox
            items={[
              { label: "1989年12月 末値", value: "$269", note: "38,915円 ÷ 144.8", color: "#8B5CF6" },
              { label: "2024年12月 末値", value: "$258", note: "39,200円 ÷ 151.8", color: "#ef4444" },
              { label: "2025年12月 末値", value: "$330", note: "49,400円 ÷ 149.7", color: "#22c55e" },
              { label: "差分（36年）",   value: "+23%",  note: "ドル建てでも更新", color: "#22c55e" },
            ]}
          />

          <p>
            2025年にはドル建てでも1989年の水準を上回り、35年ぶりに「ドル建て最高値」を更新した。
            ただし米S&P500がこの間に約15倍になったことと比較すれば、日本株の長期成長の遅れは依然として際立つ。
          </p>
        </Section>

        <Section heading="ドル建てGDPで見る日本の世界順位">
          <DataBox
            items={[
              { label: "1995年 ドル建GDP", value: "$5.5兆", note: "世界2位", color: "#4F8EF7" },
              { label: "2012年 ドル建GDP", value: "$6.2兆", note: "世界3位", color: "#4F8EF7" },
              { label: "2024年 ドル建GDP", value: "$4.1兆", note: "世界4位（独に抜かれる）", color: "#ef4444" },
              { label: "2025年 ドル建GDP", value: "$4.2兆", note: "世界5位（印に抜かれる）", color: "#ef4444" },
            ]}
          />
          <p>
            2023年に日本はドル建てGDPでドイツに抜かれ、2025年にはインドにも抜かれて世界5位に転落した。
            円ベースの日本のGDPは横ばい〜微増だが、円安進行により<strong>ドル建てでは縮小</strong>している。
          </p>
        </Section>

        <Section heading="なぜ『ドル建て』を意識すべきか">
          <p>
            国際的なモノ・サービスの価格は、ほとんどがドル建てで決まる。
            原油、半導体、AI クラウド、海外旅行、留学費用、輸入食品──
            これらの価格は、円安が進むと自動的に円ベースで上昇する。
          </p>
          <p>
            つまり「日本人がドル建てで稼げないこと」は、<strong>海外モノが買えなくなる</strong>ことを意味する。
            円ベースの賃金上昇だけでは、グローバル経済の中で生活水準を維持することは難しい。
          </p>
        </Section>

        <Section heading="まとめ：見えないインフレが進んでいる">
          <ul className="list-disc pl-5 space-y-1 my-3 text-sm" style={{ color: "var(--text)" }}>
            <li>USD/JPY: 79.8 → 149.7（13年で約88%の円安）</li>
            <li>最低賃金（ドル建て）: $9.49 → $7.49（▲21%）</li>
            <li>日経平均（ドル建て）: 1989年比 +23%（35年でようやく更新）</li>
            <li>GDP（ドル建て）: 世界2位 → 5位</li>
          </ul>
          <p>
            KeizaiMap で USD/JPY と CPI を重ねて表示すると、円ベースの数字に隠れた「見えないインフレ」を可視化できる。
            次に給料明細を見るときは、ドル建てで自分の年収を計算してみてほしい。
          </p>
        </Section>
        <Section heading="関連記事">
          <ul className="list-disc pl-5 space-y-1">
            <li><Link href="/articles/yen-depreciation" className="underline" style={{ color: "var(--link)" }}>円安が進む仕組みと日本経済への影響</Link></li>
            <li><Link href="/articles/yen-depreciation-real-wages" className="underline" style={{ color: "var(--link)" }}>円安と実質賃金の関係【2012→2025】</Link></li>
            <li><Link href="/articles/nisa-vs-savings" className="underline" style={{ color: "var(--link)" }}>新NISA vs 貯金 ─ データで考える「35年寝かせるならどっち」</Link></li>
          </ul>
        </Section>
      </ArticleLayout>
    </>
  );
}
