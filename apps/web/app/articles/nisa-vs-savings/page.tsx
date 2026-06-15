import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { articleOpenGraph, articleSeoTitle } from "@/lib/article-metadata";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd, generateFaqPageJsonLd } from "@/lib/jsonld";

const SLUG = "nisa-vs-savings";

export const metadata: Metadata = {
  alternates: { canonical: "/articles/nisa-vs-savings" },
  title: articleSeoTitle(SLUG),
  description:
    "1990年に100万円を銀行預金とS&P500それぞれに置いた場合、2024年にいくらになっているか。日本の超低金利と米国株の長期トレンドを実データで比較し、新NISA時代の選択を考える。",
  openGraph: articleOpenGraph("nisa-vs-savings"),
};

export default function NisaVsSavingsPage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "新NISA vs 貯金 ─ データで考える「30年寝かせるならどっち」",
    description: "100万円を1990年から預金/投資に置いた場合の2024年実績を比較。",
    slug: SLUG,
    readingTime: 7,
    tags: ["NISA", "投資", "貯金"],
  });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(SLUG);
  const organizationJsonLd = generateOrganizationJsonLd();
  const faqJsonLd = generateFaqPageJsonLd([
    {
      question: "1990年に100万円を預金と投資に置いたらどう違いますか？",
      answer: "1990年初頭に100万円を34年間放置した場合、銀行普通預金では約101万円（+1%）、日本国債で約122万円、日経平均で約155万円、S&P500（円建て）で約1,400万円（+1,300%）、金で約700万円という結果になります。",
    },
    {
      question: "なぜ日本の預金は増えないのですか？",
      answer: "日本の銀行普通預金金利は1990年の約2.08%から、2000年代以降は0.1%以下が続き、2020年には約0.001%まで低下しました。34年間の大半が0.1%以下の金利で、この間に物価は20%上昇しているため、預金は実質的にマイナスのリターンとなっています。",
    },
    {
      question: "投資は本当に長期で勝てますか？",
      answer: "S&P500も10年単位で見ればITバブル+リーマンの「失われた10年」（▲9%）など下落局面があります。ただし20年以上保有すれば過去どのタイミングでも+100%以上のリターンを記録しており、「長期分散投資」が推奨される理由となっています。",
    },
    {
      question: "新NISAはどう使えばよいですか？",
      answer: "①生活防衛資金（半年分）は預金で確保、②それ以外はS&P500や全世界株式（オルカン）などインデックス投信を選ぶ、③毎月コツコツ積立して20年以上の長期で考える、④短期の値動きに一喜一憂しない、が最低限の戦略です。年間360万円・生涯1,800万円まで非課税です。",
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
        title="新NISA vs 貯金 ─ データで考える「30年寝かせるならどっち」"
        description="1990年に100万円を銀行預金とS&P500それぞれに置いた場合、2024年にいくらになっているか。日本の超低金利と米国株の長期トレンドを実データで比較し、新NISA時代の選択を考える。"
        readingTime={7}
        tags={["NISA", "投資", "貯金"]}
      >
        <Section heading="100万円を34年間放置したら、どっちが勝つ？">
          <p>
            「貯金は意味がない」「投資は怖い」── どちらの主張も SNS で頻繁に目にする。
            では実際のところ、過去34年間のデータを使うとどうなるか？
          </p>
          <p>
            この記事では、1990年初頭に<strong>100万円を5つの運用先</strong>に置いて2024年末まで放置した場合の結果を比較する。
          </p>
        </Section>

        <Section heading="5つの選択肢、34年後の結果">
          <DataBox
            items={[
              { label: "銀行普通預金",   value: "≒101万円", note: "+1%程度",      color: "#ef4444" },
              { label: "日本国債（10年）", value: "≒122万円", note: "+22%",        color: "#D97706" },
              { label: "日経平均",       value: "≒155万円", note: "+55%",        color: "#4F8EF7" },
              { label: "S&P500（ドル建）", value: "≒1,400万円", note: "+1,300%",  color: "#22c55e" },
              { label: "金（ゴールド）", value: "≒700万円", note: "+600%",       color: "#D97706" },
            ]}
          />
          <p>
            <strong>S&P500（米国株インデックス）に投資していたら、100万円が約14倍</strong>になっていた計算。
            一方、銀行預金は34年間で1%しか増えていない。物価上昇（CPI +19.9%）を考えると、<strong>預金は実質的に約19%目減り</strong>している。
          </p>
        </Section>

        <Section heading="なぜ日本の預金は増えないのか">
          <p>
            日本の銀行普通預金金利の30年推移を見ると、この惨状の理由が分かる。
          </p>
          <DataBox
            items={[
              { label: "1990年", value: "≒2.08%", note: "バブル末期",        color: "#22c55e" },
              { label: "2000年", value: "≒0.10%", note: "ゼロ金利導入",      color: "#D97706" },
              { label: "2010年", value: "≒0.04%", note: "デフレ",            color: "#ef4444" },
              { label: "2020年", value: "≒0.001%", note: "マイナス金利下",   color: "#ef4444" },
              { label: "2024年", value: "≒0.1%",  note: "利上げ後やや上昇", color: "#D97706" },
            ]}
          />
          <p>
            34年間の大半が0.1%以下の金利だった。100万円を1年預けても、つく利息はわずか<strong>10円〜2万円程度</strong>。
            この間に物価は20%上昇しているので、預金は実質的にマイナスのリターンだった。
          </p>
        </Section>

        <Section heading="同じ34年間、米国株はなぜ伸びたか">
          <p>
            S&P500（米国の代表的株価指数）は1990年初頭の約330ポイントから、2024年末は約5,900ポイントへ。
            <strong>34年で約18倍</strong>に成長した（円建てでは円安効果も加わり約14倍）。
          </p>
          <div
            className="rounded-xl border p-4 space-y-2 my-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>米国株が長期で伸びた3つの理由</div>
            <ul className="list-disc pl-5 space-y-1 text-xs" style={{ color: "var(--muted)" }}>
              <li>米国経済の人口増加・GDP拡大（同期間に名目GDPは約5倍）</li>
              <li>世界的企業（GAFAM等）の利益が継続的に上昇</li>
              <li>株主還元（配当・自社株買い）の文化が定着</li>
            </ul>
          </div>
        </Section>

        <Section heading="ただし「過去 = 将来」ではない">
          <p>
            ここで注意したいのは、<strong>過去34年の実績がそのまま将来34年に当てはまるとは限らない</strong>こと。
            S&P500も10年単位で見れば下落局面（2000-2010の「失われた10年」など）があり、
            投資のタイミングによってはマイナスになることもある。
          </p>
          <DataBox
            items={[
              { label: "S&P500の最悪10年", value: "▲9%", note: "2000-2009年（ITバブル+リーマン）", color: "#ef4444" },
              { label: "S&P500の最高10年", value: "+360%", note: "1990-1999年（IT黎明期）",      color: "#22c55e" },
              { label: "20年保有での平均", value: "+450%", note: "1990年以降の20年平均",          color: "#22c55e" },
            ]}
          />
          <p>
            ただし、<strong>20年以上保有すれば過去どのタイミングでも+100%以上</strong>のリターンを記録している。
            「長期分散投資」が推奨される理由がここにある。
          </p>
        </Section>

        <Section heading="新NISA時代の「最低限の戦略」">
          <p>
            2024年から新NISA制度が始まり、年間360万円・生涯1,800万円まで非課税で投資できるようになった。
            この制度を使った最低限の戦略は次のとおりだ：
          </p>
          <div
            className="rounded-xl border p-4 space-y-3 my-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            {[
              { num: "①", title: "生活防衛資金（半年分）は預金", desc: "突然の失業・医療費に備える。これは投資ではなく保険。" },
              { num: "②", title: "それ以外はインデックス投資", desc: "S&P500 や 全世界株式（オルカン）など分散効果の高い投信を選ぶ。" },
              { num: "③", title: "毎月コツコツ積立", desc: "タイミング投資ではなく、20年以上の長期で考える。" },
              { num: "④", title: "値動きは見ない", desc: "短期の上下に一喜一憂しない。長期の右肩上がりを信じる。" },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex gap-3">
                <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#1d4ed820", color: "#1d4ed8" }}>
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

        <Section heading="まとめ：時間を味方につけられるかどうか">
          <ul className="list-disc pl-5 space-y-1 my-3 text-sm" style={{ color: "var(--text)" }}>
            <li>過去34年で100万円は預金で1万円増、S&P500では1,300万円増</li>
            <li>日本の預金金利は30年で0.1%以下、物価上昇に負けている</li>
            <li>長期（20年以上）の株式投資は過去全てプラスのリターン</li>
            <li>新NISAは非課税枠1,800万円の制度的優位がある</li>
            <li>ただし「投資のタイミング」より「保有期間」が重要</li>
          </ul>
          <p>
            KeizaiMap で日経平均と CPI を重ねて表示すると、預金が物価に追いつかない構造が一目で分かる。
          </p>
        </Section>
        <Section heading="関連記事">
          <ul className="list-disc pl-5 space-y-1">
            <li><Link href="/articles/nikkei-vs-wages" className="underline" style={{ color: "var(--link)" }}>日経平均は最高値なのに、なぜ生活は豊かにならないのか</Link></li>
            <li><Link href="/articles/real-wages-trend-1990-2024" className="underline" style={{ color: "var(--link)" }}>日本の実質賃金推移【1990〜2024】データ分析</Link></li>
            <li><Link href="/articles/retirement-2000man-revisited" className="underline" style={{ color: "var(--link)" }}>老後2,000万円問題は今いくら必要？─ 物価で再計算</Link></li>
          </ul>
        </Section>
      </ArticleLayout>
    </>
  );
}
