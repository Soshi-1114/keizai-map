import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd } from "@/lib/jsonld";

const SLUG = "retirement-2000man-revisited";

export const metadata: Metadata = {
  title: "老後2,000万円問題は今いくら必要？─ 物価で再計算してみた | KeizaiMap",
  description:
    "2019年に話題となった「老後2,000万円問題」。報告書から5年経った2024年、物価上昇と社会保険料増加を反映すると、必要額はいくらまで膨らんでいるのか。データで再試算する。",
  openGraph: {
    title: "老後2,000万円問題は今いくら必要？─ 物価で再計算してみた",
    images: [{ url: `/og/article?slug=${SLUG}` }],
  },
};

export default function Retirement2000ManPage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "老後2,000万円問題は今いくら必要？─ 物価で再計算してみた",
    description: "2019年の試算を2024年物価で再計算。",
    slug: SLUG,
    readingTime: 7,
    tags: ["老後資金", "年金", "老後2000万円"],
  });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(SLUG);
  const organizationJsonLd = generateOrganizationJsonLd();

  return (
    <>
      <Script id="article-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <Script id="breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Script id="org-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <ArticleLayout
        slug={SLUG}
        title="老後2,000万円問題は今いくら必要？─ 物価で再計算してみた"
        description="2019年に話題となった「老後2,000万円問題」。報告書から5年経った2024年、物価上昇と社会保険料増加を反映すると、必要額はいくらまで膨らんでいるのか。データで再試算する。"
        readingTime={7}
        tags={["老後資金", "年金", "老後2000万円"]}
      >
        <Section heading="覚えていますか、『2,000万円問題』">
          <p>
            2019年に金融庁の報告書「高齢社会における資産形成・管理」が発表され、
            「老後30年間で約2,000万円不足する」という試算が一人歩きし、社会的な議論を巻き起こした。
          </p>
          <p>
            あれから5年。物価は上昇し、社会保険料率も増えた。この間に必要老後資金は<strong>いくらまで膨らんだのか</strong>。
            KeizaiMap のデータを使って再計算してみる。
          </p>
        </Section>

        <Section heading="2019年試算の中身">
          <p>
            報告書のモデルケースは「夫65歳以上・妻60歳以上の無職世帯」。
            総務省の家計調査（2017年）に基づき、以下の前提だった。
          </p>
          <DataBox
            items={[
              { label: "月の実収入", value: "≒20.9万円", note: "年金中心",      color: "#22c55e" },
              { label: "月の実支出", value: "≒26.4万円", note: "食費・住居等",  color: "#ef4444" },
              { label: "月の不足額", value: "≒5.5万円",  note: "支出>収入",     color: "#ef4444" },
              { label: "30年での不足", value: "≒1,980万円", note: "≒2,000万円", color: "#ef4444" },
            ]}
          />
          <p>
            「月5.5万円の赤字 × 12ヶ月 × 30年 ≒ 1,980万円」
            これが「2,000万円問題」の数学的根拠だった。
          </p>
        </Section>

        <Section heading="2024年版で再計算する3つの調整">
          <div
            className="rounded-xl border p-4 space-y-3 my-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            {[
              { num: "①", title: "物価上昇分（+7%）", desc: "2017年からのCPI上昇は約7%。2017年の26.4万円支出は、2024年では約28.2万円に相当。" },
              { num: "②", title: "社会保険料率の上昇", desc: "国民健康保険料の引き上げで、高齢者の負担も増加。月支出に追加で約3,000円相当。" },
              { num: "③", title: "年金支給額の伸びは抑制", desc: "マクロ経済スライドにより、年金は物価ほど上がらない。実収入は20.9万円→21.5万円程度。" },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex gap-3">
                <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#ef444420", color: "#ef4444" }}>
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

        <Section heading="2024年版の再試算結果">
          <DataBox
            items={[
              { label: "月の実収入（再）", value: "≒21.5万円", note: "+2.9%",         color: "#22c55e" },
              { label: "月の実支出（再）", value: "≒28.2万円", note: "+6.8%",          color: "#ef4444" },
              { label: "月の不足額（再）", value: "≒6.7万円",  note: "+1.2万円",      color: "#ef4444" },
              { label: "30年での不足",   value: "≒2,400万円", note: "+400万円",       color: "#ef4444" },
            ]}
          />
          <p>
            5年で<strong>必要資金が約400万円増加</strong>した計算。
            「老後2,000万円問題」は、2024年版では実質「<strong>老後2,400万円問題</strong>」になっている。
          </p>
        </Section>

        <Section heading="35年後（2060年）にはいくら必要か">
          <p>
            では、今30歳の人が65歳になる2060年時点ではどうか。年率1.5%のインフレが続くと仮定すると：
          </p>
          <DataBox
            items={[
              { label: "現役世代（30歳）が65歳になる時", value: "2060年", color: "#4F8EF7" },
              { label: "35年間のCPI上昇（1.5%/年）",     value: "+68%",   color: "#D97706" },
              { label: "必要老後資金（2024年比）",       value: "≒4,000万円", note: "現在価値とは別物", color: "#ef4444" },
              { label: "現在価値換算（実質）",           value: "≒2,400万円", note: "実質的には変わらず", color: "#22c55e" },
            ]}
          />
          <p>
            未来の通貨ベースで見ると4,000万円になるが、現在価値（実質）では同じ2,400万円相当。
            「未来額面が膨らんだ」だけで、実質的な負担は変わらないのが本質だ。
          </p>
        </Section>

        <Section heading="その2,000万を作るには毎月いくら積み立てる？">
          <p>
            30年で2,400万円を貯めるとして、毎月の積立額はいくら必要か。
            運用利回り別にシミュレーションした。
          </p>
          <div className="rounded-xl border overflow-hidden overflow-x-auto my-4" style={{ borderColor: "var(--border)" }}>
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--card)", borderBottom: "1px solid var(--border)" }}>
                  <th className="text-left p-3 font-medium">運用想定</th>
                  <th className="text-right p-3 font-medium">月積立額</th>
                  <th className="text-right p-3 font-medium">30年元本</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--muted)" }}>
                {[
                  { y: "0%（預金）",      m: "6.7万円", t: "2,400万" },
                  { y: "1%（債券）",      m: "5.7万円", t: "2,050万" },
                  { y: "3%（バランス型）", m: "4.0万円", t: "1,440万" },
                  { y: "5%（株式中心）",   m: "2.9万円", t: "1,040万" },
                  { y: "7%（S&P500想定）", m: "2.0万円", t: "720万" },
                ].map((r) => (
                  <tr key={r.y} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                    <td className="p-3 font-medium" style={{ color: "var(--text)" }}>{r.y}</td>
                    <td className="p-3 text-right tabular-nums">{r.m}</td>
                    <td className="p-3 text-right tabular-nums">{r.t}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            運用利回りで月積立額は<strong>3倍以上変わる</strong>。
            預金だけで6.7万円積み立てるのと、株式中心で2.9万円積み立てるのでは、家計への負担が全然違う。
          </p>
        </Section>

        <Section heading="3つの落とし穴に注意">
          <ul className="list-disc pl-5 space-y-1 my-3 text-sm" style={{ color: "var(--text)" }}>
            <li><strong>「平均」ベースの試算</strong>：個人差が大きい。持ち家の有無、医療費、介護費で大きく変動</li>
            <li><strong>長寿リスク</strong>：90歳まで生きると30年では足りない。35年・40年を視野に</li>
            <li><strong>年金制度の不確実性</strong>：今後の支給開始年齢引き上げ・給付水準調整リスクがある</li>
          </ul>
        </Section>

        <Section heading="まとめ：『2,000万円』は古い目安">
          <ul className="list-disc pl-5 space-y-1 my-3 text-sm" style={{ color: "var(--text)" }}>
            <li>2024年再計算では老後資金は約2,400万円必要</li>
            <li>2060年時点では名目4,000万円だが、実質は2,400万円相当</li>
            <li>運用利回りで月積立額は3倍以上変わる</li>
            <li>持ち家・健康・長寿の個人差で大きく変動するため自分用試算が重要</li>
          </ul>
        </Section>
        <Section heading="関連記事">
          <ul className="list-disc pl-5 space-y-1">
            <li><Link href="/articles/nisa-vs-savings" className="underline" style={{ color: "var(--link)" }}>新NISA vs 貯金 ─ データで考える「30年寝かせるならどっち」</Link></li>
            <li><Link href="/articles/social-insurance-burden" className="underline" style={{ color: "var(--link)" }}>手取りが増えない本当の理由 ─ 社会保険料30年の増加</Link></li>
            <li><Link href="/articles/real-take-home-pay-30years" className="underline" style={{ color: "var(--link)" }}>年収500万でも30年前の年収300万に負けている？─ 実質手取りで見る30年</Link></li>
          </ul>
        </Section>
      </ArticleLayout>
    </>
  );
}
