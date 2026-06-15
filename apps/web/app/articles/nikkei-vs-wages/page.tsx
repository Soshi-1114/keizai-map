import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { articleOpenGraph, articleSeoTitle } from "@/lib/article-metadata";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd, generateFaqPageJsonLd } from "@/lib/jsonld";

const SLUG = "nikkei-vs-wages";

export const metadata: Metadata = {
  alternates: { canonical: "/articles/nikkei-vs-wages" },
  title: articleSeoTitle(SLUG),
  description: "2025年、日経平均は1990年比で約96%上昇している。しかし同じ期間の実質賃金は97.9と1990年水準を下回ったままだ。株高の恩恵はなぜ家計に届かないのか。データで構造を読み解く。",
  openGraph: articleOpenGraph("nikkei-vs-wages"),
};

export default function NikkeiVsWagesPage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "日経平均は最高値なのに、なぜ生活は豊かにならないのか",
    description: "日経平均が上昇を続ける一方、実質賃金は横ばいのまま。株高の恩恵はなぜ家計に届かないのか。データで構造を読み解く。",
    slug: SLUG,
    readingTime: 5,
    tags: ["日経平均", "株高", "格差"],
  });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(SLUG);
  const organizationJsonLd = generateOrganizationJsonLd();
  const faqJsonLd = generateFaqPageJsonLd([
  {
    "question": "なぜ株価が上がっても賃金は上がらないのですか？",
    "answer": "主な理由は、株式を保有しているのは富裕層に偏っており、企業利益の増加が配当や自社株買いに使われ労働者への賃上げに回りにくい構造があるためです。アベノミクス期（2012〜2020）で税収は38.5%増、日経平均（1990=100）は54.6→116.5へと約2倍になりましたが、実質賃金は0.9%低下しました。"
  },
  {
    "question": "日経平均と実質賃金はどう違う推移をしましたか？",
    "answer": "1990年を100とすると、2025年の日経平均は196.1と約96%上昇しています。一方、実質賃金は97.9と1990年水準を下回ったままです。35年間で株価はほぼ2倍に上昇しましたが、労働者の購買力はむしろ低下しました。"
  },
  {
    "question": "株高の恩恵を受けるにはどうすればよいですか？",
    "answer": "新NISA（年間投資枠360万円、非課税保有限度額1,800万円）を活用した長期分散投資が有効です。KeizaiMapのデータでは1990年から35年間の日経平均は約1.96倍ですが、S&P500は同期間で約15倍になっています。長期・積立・分散を組み合わせることで、株高の恩恵を受けやすくなります。"
  }
]);

  return (
    <>
      <script id="article-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script id="breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script id="org-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script id="faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ArticleLayout
        slug={SLUG}
        title="日経平均は最高値なのに、なぜ生活は豊かにならないのか"
        description="2025年、日経平均は1990年比で約96%上昇している。しかし同じ期間の実質賃金は97.9と1990年水準を下回ったままだ。株高の恩恵はなぜ家計に届かないのか。データで構造を読み解く。"
        readingTime={5}
        tags={["日経平均", "株高", "格差"]}
      >
        <Section heading="株価と賃金の35年間">
          <p>
            2024年2月、日経平均株価は1989年末のバブル最高値（38,915円）を34年ぶりに更新し、
            2025年にはさらに上昇を続けた。メディアは「株価最高値」と連日報じた。
          </p>
          <p>
            では、その恩恵は家計に届いているのだろうか。
            KeizaiMapのデータで1990年を100として並べると、答えは明確だ。
          </p>

          <DataBox
            items={[
              { label: "日経平均（1990=100）", value: "196.1", note: "+96%（1990年比）", color: "#8B5CF6" },
              { label: "実質賃金（1990=100）", value: "97.9",  note: "1990年比 -2.1%",   color: "#ef4444" },
              { label: "CPI（1990=100）",      value: "123.7", note: "+23.7%",            color: "#D97706" },
            ]}
          />

          <p>
            株価はほぼ2倍に上昇した一方、実質賃金は35年前を下回っている。
            さらに物価は約24%上がっているため、生活実感としての豊かさはむしろ後退した。
          </p>
        </Section>

        <Section heading="なぜ株高が家計に届かないのか">
          <p>
            その主な理由は「株式保有の偏在」だ。
          </p>
          <div
            className="rounded-xl border p-4 space-y-3 my-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            {[
              {
                title: "日本の株式保有率の低さ",
                desc: "日本の個人の株式保有率はアメリカと比べて低い。多くの家計は預貯金中心であり、株高の直接的な恩恵を受けにくい。",
              },
              {
                title: "機関投資家・外国人投資家が主役",
                desc: "日経平均を動かす主体は年金基金（GPIF）、日銀のETF購入、外国人機関投資家だ。個人の資産形成への波及は間接的で限定的になりやすい。",
              },
              {
                title: "企業収益が内部留保に積み上がる",
                desc: "株高の恩恵を受けた企業が利益を設備投資・賃上げに回す「トリクルダウン」が想定通りに機能しなかった。日本企業の内部留保は2020年代に500兆円を超えたとされる。",
              },
            ].map(({ title, desc }) => (
              <div key={title} className="border-l-2 pl-3 py-1" style={{ borderColor: "#8B5CF6" }}>
                <div className="text-sm font-semibold mb-0.5">{title}</div>
                <div className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{desc}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section heading="アベノミクス期（2012〜2020）の典型例">
          <p>
            この構造が最も顕著に現れたのがアベノミクス期だ。
          </p>
          <DataBox
            items={[
              { label: "日経平均変化率", value: "+113%",  note: "2012→2020（54.6→116.5、1990=100）", color: "#8B5CF6" },
              { label: "実質賃金変化率", value: "▼0.9%",  note: "97.4→96.5",  color: "#ef4444" },
              { label: "税収変化率",     value: "+38.5%", note: "43.9→60.8兆円", color: "#22c55e" },
            ]}
          />
          <p>
            株価は約2倍、税収も4割近く増えた一方で、実質賃金は下落した。
            企業収益の改善が賃上げや消費拡大につながる「好循環」は、
            少なくとも実質賃金の観点からは確認しにくい結果となった。
          </p>
        </Section>

        <Section heading="NISAと資産形成">
          <p>
            こうした現実を踏まえ、政府は2024年に新NISAを拡充し、個人の資産形成を後押ししている。
            「貯蓄から投資へ」のシフトが進めば、将来的には株高の恩恵が家計に届きやすくなる可能性がある。
          </p>
          <p>
            一方で、投資元本のない低所得層には恩恵が届きにくいという構造的な課題も指摘される。
            KeizaiMapで株価・賃金・物価の推移を並べて確認しながら、
            「数字の上の豊かさ」と「生活実感」のギャップを自分で検証してほしい。
          </p>
        </Section>
        <Section heading="関連記事">
          <ul className="list-disc pl-5 space-y-1">
            <li><Link href="/articles/real-wages" className="underline" style={{ color: "var(--link)" }}>実質賃金とは？なぜ日本人の生活は豊かになった実感がないのか</Link></li>
            <li><Link href="/articles/income-inequality-japan" className="underline" style={{ color: "var(--link)" }}>格差は本当に広がっているのか？─ ジニ係数と所得分布で見る35年</Link></li>
            <li><Link href="/articles/nisa-vs-savings" className="underline" style={{ color: "var(--link)" }}>新NISA vs 貯金 ─ データで考える「35年寝かせるならどっち」</Link></li>
          </ul>
        </Section>
      </ArticleLayout>
    </>
  );
}
