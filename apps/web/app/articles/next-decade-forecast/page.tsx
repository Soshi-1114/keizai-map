import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd } from "@/lib/jsonld";

const SLUG = "next-decade-forecast";

export const metadata: Metadata = {
  alternates: { canonical: "/articles/next-decade-forecast" },
  title: "「失われた40年」になる前に ─ 2025〜2035年の日本経済を9つの指標で展望する | KeizaiMap",
  description:
    "過去30年のトレンドから今後10年の日本経済を展望。少子化・財政赤字・円安・賃上げの行方を、政府・IMF・OECDの長期見通しと過去データで照合する。",
  openGraph: {
    title: "「失われた40年」になる前に ─ 2025〜2035年の日本経済を9つの指標で展望する",
    images: [{ url: `/og/article?slug=${SLUG}` }],
  },
};

export default function NextDecadeForecastPage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "「失われた40年」になる前に ─ 2025〜2035年の日本経済を9つの指標で展望する",
    description: "過去30年のトレンドから今後10年の日本経済を展望。各種長期見通しと照合する。",
    slug: SLUG,
    readingTime: 9,
    tags: ["経済予測", "長期展望", "2035年"],
  });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(SLUG);
  const organizationJsonLd = generateOrganizationJsonLd();

  return (
    <>
      <script id="article-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script id="breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script id="org-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <ArticleLayout
        slug={SLUG}
        title="「失われた40年」になる前に ─ 2025〜2035年の日本経済を9つの指標で展望する"
        description="過去30年のトレンドから今後10年の日本経済を展望。少子化・財政赤字・円安・賃上げの行方を、政府・IMF・OECDの長期見通しと過去データで照合する。"
        readingTime={9}
        tags={["経済予測", "長期展望", "2035年"]}
      >
        <Section heading="次の10年を、データで構想する">
          <p>
            「失われた30年」と呼ばれた1990〜2020年代。
            では2025〜2035年の10年間で、日本経済はどう動くのか。
          </p>
          <p>
            この記事では、過去のトレンドと政府・IMF・OECD の長期見通しを照合しながら、
            <strong>9つの指標それぞれの今後10年</strong>を展望する。
            予言ではなく、複数のシナリオを並べて読者の判断材料を提供したい。
          </p>
          <div
            className="rounded-xl border-l-4 p-4 my-4 text-sm"
            style={{ borderLeftColor: "#4F8EF7", backgroundColor: "var(--card)", color: "var(--muted)" }}
          >
            ※ 本記事の予測値はあくまで参考シナリオです。実際の経済動向は政策・国際情勢で大きく変動します。
          </div>
        </Section>

        <Section heading="① 出生数：2030年代に60万人台へ">
          <p>
            最も確度の高い予測は出生数だ。2024年の73万人台から、社人研の中位推計では2030年に約65万人、2035年に約60万人と見込まれている。
          </p>
          <DataBox
            items={[
              { label: "2024年（実績）", value: "73万人", color: "#F59E0B" },
              { label: "2030年（推計）", value: "≒65万人", note: "▲11%", color: "#ef4444" },
              { label: "2035年（推計）", value: "≒60万人", note: "▲18%", color: "#ef4444" },
            ]}
          />
          <p>
            この減少は<strong>確実</strong>に近い。なぜなら、子どもを産む世代の人口（20〜44歳の女性）が既に決まっているからだ。
            少子化対策が成功しても効果が現れるのは20年後以降。今後10年の出生数は概ね決定済みといえる。
          </p>
        </Section>

        <Section heading="② 社会保険料負担率：20%超えへ">
          <p>
            出生数減少と高齢者増加が確実な以上、社会保険料率の上昇も避けがたい。
            <strong>1990年10.8% → 2024年18.5%</strong>のペースが続けば、2035年には20%を超える可能性が高い。
          </p>
          <DataBox
            items={[
              { label: "2024年（実績）", value: "18.5%", color: "#10B981" },
              { label: "2030年（推計）", value: "≒19.8%", note: "+1.3pt", color: "#ef4444" },
              { label: "2035年（推計）", value: "≒21.0%", note: "+2.5pt", color: "#ef4444" },
            ]}
          />
          <p>
            この上昇分は、すべて現役世代の手取り減少に直結する。
            年収500万円の人は、毎月の手取りが追加で5,000円〜1万円減る計算になる。
          </p>
        </Section>

        <Section heading="③ 国債残高：1,400兆円へ">
          <p>
            社会保障費の自然増（毎年1兆円超）が続く限り、国債残高の増加は止まらない。
          </p>
          <DataBox
            items={[
              { label: "2024年（実績）",  value: "1,170兆円", color: "#06B6D4" },
              { label: "2030年（推計）",  value: "≒1,300兆円", note: "+130兆", color: "#ef4444" },
              { label: "2035年（推計）",  value: "≒1,400兆円", note: "+230兆", color: "#ef4444" },
            ]}
          />
          <p>
            ただし、これが直ちに「破綻」に結びつくわけではない（→<a href="/articles/fiscal-collapse-truth" style={{ color: "var(--link)" }}>財政破綻記事</a>を参照）。
            最大のリスクは「利上げによる利払い費の急増」。日銀が政策金利を1%上げるごとに、国の利払い費は約3兆円増加する。
          </p>
        </Section>

        <Section heading="④ 実質賃金：上昇のチャンスは2024〜2027">
          <p>
            実質賃金は今、転換点にいる可能性がある。
            2024年の春闘で平均賃上げ率5.10%が実現し、33年ぶりの高水準となった。
            この流れが続けば、実質賃金は<strong>2027年頃に1990年水準（100）を超える</strong>可能性がある。
          </p>
          <DataBox
            items={[
              { label: "2024年（実績）",  value: "99.2", color: "#4F8EF7" },
              { label: "2027年（楽観）",  value: "≒103", note: "1990年超え", color: "#22c55e" },
              { label: "2027年（悲観）",  value: "≒98",  note: "再下落",      color: "#ef4444" },
              { label: "2035年（楽観）",  value: "≒108", note: "本格回復",   color: "#22c55e" },
            ]}
          />
          <p>
            ただし、賃上げが物価上昇率を上回らない限り、実質賃金は伸びない。
            春闘の平均賃上げ率が3〜4%、物価上昇が2〜3%という構図が続けば、実質賃金は緩やかに回復する。
          </p>
        </Section>

        <Section heading="⑤ 為替（USD/JPY）：2つの可能性">
          <p>為替は最も予測が難しい指標だ。専門家の見方も大きく分かれている。</p>
          <div className="rounded-xl border p-4 space-y-3 my-4" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <div>
              <div className="font-semibold mb-1" style={{ color: "#22c55e" }}>シナリオA：円高方向（120〜130円）</div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                日米金利差の縮小（日銀利上げ + 米FRB利下げ）、対米貿易摩擦による円買い圧力で、徐々に円高方向へ。
              </p>
            </div>
            <div>
              <div className="font-semibold mb-1" style={{ color: "#ef4444" }}>シナリオB：超円安継続（160〜180円）</div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                日米金利差が残り、貿易赤字とエネルギー輸入で構造的な円売り圧力が続けば、170円台も視野に入る。
              </p>
            </div>
          </div>
        </Section>

        <Section heading="⑥ CPI：2%目標との戦い">
          <p>
            日銀のインフレ目標は2%だが、過去30年で達成できたのは数年のみ。
            2022〜2024年は資源高で4%近くまで上昇したが、これは一過性の輸入インフレだった。
          </p>
          <DataBox
            items={[
              { label: "2024年（実績）",  value: "119.9", note: "1990=100", color: "#D97706" },
              { label: "2030年（中位）",  value: "≒128",  note: "+6.8%",   color: "#D97706" },
              { label: "2035年（中位）",  value: "≒136",  note: "+13.4%",  color: "#D97706" },
            ]}
          />
          <p>
            年率1.5〜2%の物価上昇が定着すれば、10年で約20%の物価上昇となる。
            賃金がこれを上回ることが、実質賃金維持の前提条件だ。
          </p>
        </Section>

        <Section heading="⑦ 日経平均：株高は続くか">
          <p>
            2024年に過去最高値を更新した日経平均だが、企業収益の改善・自社株買いの増加・新NISAによる個人マネー流入が支えている。
          </p>
          <DataBox
            items={[
              { label: "2024年（実績）",  value: "155.4", note: "1990=100",     color: "#8B5CF6" },
              { label: "2030年（楽観）",  value: "≒200",  note: "5万円台",     color: "#22c55e" },
              { label: "2030年（中立）",  value: "≒170",  note: "4.3万円台",   color: "#8B5CF6" },
              { label: "2030年（悲観）",  value: "≒120",  note: "3万円割れ",   color: "#ef4444" },
            ]}
          />
        </Section>

        <Section heading="⑧ 税収：70兆円台で頭打ちか">
          <p>
            2023年に72兆円を記録した税収は、賃金上昇と物価上昇による所得税・消費税の自然増で、当面は70兆円台で推移すると見られる。
          </p>
        </Section>

        <Section heading="⑨ 住宅価格：都心と地方の二極化">
          <p>
            首都圏マンションは2025年時点でバブル期超え。日銀利上げで需要が冷え込めば一時的に調整局面に入る可能性もあるが、
            <strong>都心と地方の二極化</strong>は今後も拡大する。地方の空き家率は2030年に20%超えが予測されている。
          </p>
        </Section>

        <Section heading="3つの統合シナリオ">
          <div className="rounded-xl border p-4 space-y-4 my-4" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <div>
              <div className="font-bold mb-1" style={{ color: "#22c55e" }}>🟢 楽観シナリオ：「失われた30年」の終焉</div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                賃上げの定着・適度な円安維持・株高継続で、実質賃金は2027年に1990年水準を超える。
                少子化対策で出生数の減少ペースが緩み、若年層の経済参加が拡大する。
              </p>
            </div>
            <div>
              <div className="font-bold mb-1" style={{ color: "#D97706" }}>🟡 中位シナリオ：緩やかな後退</div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                賃金上昇と物価上昇が拮抗し、実質賃金はほぼ横ばい。社会保険料の上昇で手取りは緩やかに減少。
                円相場は130〜150円台で推移、株価は緩やかに上昇。
              </p>
            </div>
            <div>
              <div className="font-bold mb-1" style={{ color: "#ef4444" }}>🔴 悲観シナリオ：「失われた40年」</div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                賃上げが続かず、円安が170円超まで進む。海外モノが買えなくなり、海外投資への資金流出が加速。
                若年層の海外流出と社会保険料の急上昇で、財政が一段と悪化する。
              </p>
            </div>
          </div>
        </Section>

        <Section heading="読者ができること">
          <p>
            10年後の経済を変えられるのは個人ではないが、自分の家計を10年後に備えることはできる。
          </p>
          <ul className="list-disc pl-5 space-y-1 my-3 text-sm" style={{ color: "var(--text)" }}>
            <li>NISA 等で<strong>長期分散投資</strong>を始める（過去のデータから、長期投資の期待値は高い）</li>
            <li>給与収入だけでなく<strong>副業・複業</strong>でドル建て収入を確保する</li>
            <li>住宅は「都心 vs 地方」の二極化を意識して購入判断する</li>
            <li>社会保険料の上昇に備えて、固定費を圧縮しておく</li>
          </ul>
        </Section>

        <Section heading="まとめ">
          <ul className="list-disc pl-5 space-y-1 my-3 text-sm" style={{ color: "var(--text)" }}>
            <li>確定路線：出生数減少・社会保険料上昇・国債残高増加</li>
            <li>可変要因：賃金・為替・株価・物価</li>
            <li>3シナリオ：楽観（実質賃金回復）・中位（横ばい）・悲観（失われた40年）</li>
            <li>個人レベルでできるのは投資・副業・支出最適化</li>
          </ul>
          <p>
            KeizaiMap で各指標の30年トレンドを確認し、自分なりの「次の10年」シナリオを描いてほしい。
          </p>
        </Section>
        <Section heading="関連記事">
          <ul className="list-disc pl-5 space-y-1">
            <li><Link href="/articles/lost-decades" className="underline" style={{ color: "var(--link)" }}>「失われた30年」─ 数字で見る日本経済の停滞</Link></li>
            <li><Link href="/articles/declining-birthrate-economy" className="underline" style={{ color: "var(--link)" }}>少子化と経済の悪循環 ─ 出生数激減が家計と社会保障に与える影響</Link></li>
            <li><Link href="/articles/fiscal-collapse-truth" className="underline" style={{ color: "var(--link)" }}>財政破綻は本当に起きるのか ─ 国債・対外純資産からデータで考える</Link></li>
          </ul>
        </Section>
      </ArticleLayout>
    </>
  );
}
