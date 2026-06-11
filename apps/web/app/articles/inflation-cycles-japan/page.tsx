import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd } from "@/lib/jsonld";

const SLUG = "inflation-cycles-japan";

export const metadata: Metadata = {
  title: "物価高はいつまで続く？─ 過去30年の4つのインフレ局面を分析 | KeizaiMap",
  description:
    "1990年バブル崩壊・1997年消費税増税・2008年資源高・2022年円安インフレ。日本経済が直面した4つのインフレ局面を比較し、今回の物価高の終わりを過去データから予測する。",
  openGraph: {
    title: "物価高はいつまで続く？─ 過去30年の4つのインフレ局面を分析",
    images: [{ url: `/og/article?slug=${SLUG}` }],
  },
};

export default function InflationCyclesJapanPage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "物価高はいつまで続く？─ 過去30年の4つのインフレ局面を分析",
    description: "1990年・1997年・2008年・2022年の4つのインフレを比較し終わりを予測。",
    slug: SLUG,
    readingTime: 7,
    tags: ["物価高", "インフレ", "予測"],
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
        title="物価高はいつまで続く？─ 過去30年の4つのインフレ局面を分析"
        description="1990年バブル崩壊・1997年消費税増税・2008年資源高・2022年円安インフレ。日本経済が直面した4つのインフレ局面を比較し、今回の物価高の終わりを過去データから予測する。"
        readingTime={7}
        tags={["物価高", "インフレ", "予測"]}
      >
        <Section heading="今の物価高は『いつもと違う』のか">
          <p>
            2022年から本格化した物価上昇は、2024年現在も続いている。
            食料品・電気・ガソリン・サービス価格まで上昇し、家計を直撃している。
          </p>
          <p>
            「これまでのインフレと何が違うのか」「いつ終わるのか」。
            過去30年で日本経済が経験した<strong>4つのインフレ局面</strong>を振り返ることで、今回の特徴と終わりを予測する。
          </p>
        </Section>

        <Section heading="日本の4つのインフレ局面">
          <div className="rounded-xl border overflow-hidden overflow-x-auto my-4" style={{ borderColor: "var(--border)" }}>
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--card)", borderBottom: "1px solid var(--border)" }}>
                  <th className="text-left p-3 font-medium">局面</th>
                  <th className="text-left p-3 font-medium">期間</th>
                  <th className="text-left p-3 font-medium">CPI上昇率</th>
                  <th className="text-left p-3 font-medium">主因</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--muted)" }}>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  <td className="p-3 font-medium" style={{ color: "var(--text)" }}>① バブル末期</td>
                  <td className="p-3">1989-1991</td>
                  <td className="p-3 tabular-nums">+3.3%/年</td>
                  <td className="p-3">資産価格高騰・消費税3%導入</td>
                </tr>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  <td className="p-3 font-medium" style={{ color: "var(--text)" }}>② 橋本増税</td>
                  <td className="p-3">1997-1998</td>
                  <td className="p-3 tabular-nums">+1.8%/年</td>
                  <td className="p-3">消費税5%への引上げ</td>
                </tr>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  <td className="p-3 font-medium" style={{ color: "var(--text)" }}>③ 資源高</td>
                  <td className="p-3">2007-2008</td>
                  <td className="p-3 tabular-nums">+1.4%/年</td>
                  <td className="p-3">原油・食料価格上昇</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium" style={{ color: "var(--text)" }}>④ 円安+資源高</td>
                  <td className="p-3">2022-2024</td>
                  <td className="p-3 tabular-nums">+2.5〜3.0%/年</td>
                  <td className="p-3">円安・原油・賃上げ波及</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section heading="局面① バブル末期（1989-1991）">
          <DataBox
            items={[
              { label: "1989年 CPI", value: "≒97",   color: "#D97706" },
              { label: "1991年 CPI", value: "103.3", note: "2年で+6.5%", color: "#ef4444" },
              { label: "終わりの引き金", value: "バブル崩壊", note: "資産価格暴落", color: "#4F8EF7" },
            ]}
          />
          <p>
            消費税3%導入（1989年）と資産価格高騰が同時に進行。1991年の株価暴落で実需が冷え込み、インフレは収束した。
            <strong>「資産バブル → 実需崩壊」というパターン</strong>だった。
          </p>
        </Section>

        <Section heading="局面② 橋本増税（1997-1998）">
          <DataBox
            items={[
              { label: "1996年 CPI", value: "107.1", color: "#D97706" },
              { label: "1998年 CPI", value: "109.7", note: "+2.4%",      color: "#ef4444" },
              { label: "終わりの引き金", value: "金融危機", note: "山一證券破綻", color: "#4F8EF7" },
            ]}
          />
          <p>
            消費税5%引上げによる一時的なインフレ。
            だが1997年末からの金融危機（山一・拓銀破綻）で需要が崩壊、すぐにデフレに転落した。
            <strong>「税制要因 → 短期で収束」</strong>。
          </p>
        </Section>

        <Section heading="局面③ 資源高（2007-2008）">
          <DataBox
            items={[
              { label: "2006年 CPI", value: "106.6", color: "#D97706" },
              { label: "2008年 CPI", value: "108.2", note: "+1.5%",      color: "#ef4444" },
              { label: "終わりの引き金", value: "リーマンショック", note: "資源価格暴落", color: "#4F8EF7" },
            ]}
          />
          <p>
            原油価格が史上最高値（147ドル/バレル）を記録。日本も輸入インフレに陥ったが、
            リーマンショックで原油価格が一気に40ドル台まで暴落し、インフレは沈静化した。
            <strong>「外的ショック → 急速に収束」</strong>。
          </p>
        </Section>

        <Section heading="局面④ 円安＋資源高（2022-現在）">
          <DataBox
            items={[
              { label: "2021年 CPI", value: "112.2", color: "#D97706" },
              { label: "2024年 CPI", value: "119.9", note: "3年で+6.9%", color: "#ef4444" },
              { label: "終わりの引き金", value: "未確定",  note: "円高転換 or 賃金停止", color: "#4F8EF7" },
            ]}
          />
          <p>
            今回の特徴は、<strong>円安と資源高が同時に進行している</strong>こと。
            さらに、過去のインフレが「外的ショック → 一過性」だったのに対し、
            今回は<strong>賃上げを伴うインフレ</strong>として進行している点が異なる。
          </p>
        </Section>

        <Section heading="今回のインフレ、3つの終わり方シナリオ">
          <div className="rounded-xl border p-4 space-y-3 my-4" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <div>
              <div className="font-semibold" style={{ color: "#22c55e" }}>🟢 シナリオA：賃金主導の良いインフレへ定着</div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                春闘の高水準賃上げが定着し、実質賃金プラスの「良いインフレ」が継続。CPIは年2%程度で安定。
              </p>
            </div>
            <div>
              <div className="font-semibold" style={{ color: "#D97706" }}>🟡 シナリオB：円高転換でデフレ再来</div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                日米金利差が縮小し円高に転換。輸入価格が下落して物価上昇が止まる。賃上げも続かず、再びデフレ。
              </p>
            </div>
            <div>
              <div className="font-semibold" style={{ color: "#ef4444" }}>🔴 シナリオC：超円安で悪いインフレ継続</div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                円安が170円超まで進行し、輸入インフレが家計を直撃。賃上げが追いつかず、実質賃金マイナスが固定化。
              </p>
            </div>
          </div>
        </Section>

        <Section heading="家計が今できる3つの備え">
          <ul className="list-disc pl-5 space-y-1 my-3 text-sm" style={{ color: "var(--text)" }}>
            <li>固定費の見直し：物価上昇分を吸収できるよう、家賃・通信費・保険を削減</li>
            <li>NISA等で長期分散投資：インフレに弱い現金預金から、株式・実物資産へ分散</li>
            <li>収入チャネルの多様化：副業・転職で賃上げを獲得（春闘に頼らない）</li>
          </ul>
        </Section>

        <Section heading="まとめ">
          <ul className="list-disc pl-5 space-y-1 my-3 text-sm" style={{ color: "var(--text)" }}>
            <li>過去のインフレは「外的ショック → 1〜2年で収束」が大半</li>
            <li>2022年からのインフレは賃上げ波及があり、過去と異なる構造</li>
            <li>終わりのカギは「為替（円高転換するか）」と「賃上げ持続性」</li>
            <li>家計はインフレを前提とした資産配置・収入確保が重要</li>
          </ul>
        </Section>
        <Section heading="関連記事">
          <ul className="list-disc pl-5 space-y-1">
            <li><Link href="/articles/consumption-tax" className="underline" style={{ color: "var(--link)" }}>消費税率引き上げの歴史と家計への影響</Link></li>
            <li><Link href="/articles/yen-depreciation" className="underline" style={{ color: "var(--link)" }}>円安が進む仕組みと日本経済への影響</Link></li>
            <li><Link href="/articles/real-wages-trend-1990-2024" className="underline" style={{ color: "var(--link)" }}>日本の実質賃金推移【1990〜2024】データ分析</Link></li>
          </ul>
        </Section>
      </ArticleLayout>
    </>
  );
}
