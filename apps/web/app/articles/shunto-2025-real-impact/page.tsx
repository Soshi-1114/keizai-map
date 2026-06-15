import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { articleOpenGraph, articleSeoTitle } from "@/lib/article-metadata";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd, generateFaqPageJsonLd } from "@/lib/jsonld";

const SLUG = "shunto-2025-real-impact";

export const metadata: Metadata = {
  alternates: { canonical: "/articles/shunto-2025-real-impact" },
  title: articleSeoTitle(SLUG),
  description:
    "2025年春闘の平均賃上げ率は5%超。33年ぶりの高水準だが、物価上昇と社会保険料増加でどれだけ手取りに反映されるのか。過去30年の賃上げ率と実質賃金の関係をデータで検証する。",
  openGraph: articleOpenGraph("shunto-2025-real-impact"),
};

export default function Shunto2025Page() {
  const articleJsonLd = generateArticleJsonLd({
    title: "2025年 春闘・賃上げの実態 ─ 過去30年で最高水準だが家計に届くか",
    description: "2025年春闘5%超は33年ぶり。物価・社保で手取りはどう変わるか検証。",
    slug: SLUG,
    readingTime: 6,
    tags: ["春闘", "賃上げ", "実質賃金"],
  });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(SLUG);
  const organizationJsonLd = generateOrganizationJsonLd();
  const faqJsonLd = generateFaqPageJsonLd([
    {
      question: "2025年春闘の賃上げ率はいくらですか？",
      answer: "連合がまとめた2025年春闘の平均賃上げ率は5.46%（5月最終集計、5,000円以上）で、前年（5.10%）に続き2年連続で5%超えを達成しました。これは1991年（5.66%）以来、約34年ぶりの高水準です。",
    },
    {
      question: "賃上げが実質賃金にどれだけ反映されますか？",
      answer: "2025年は春闘5.46%、CPI上昇率は約+2.5%予測のため、実質賃金ベースでは約+2.5%増の見込みです。ただし社会保険料率も毎年上昇しており、実際に家計に届く正味の手取り改善は1.5〜2%程度にとどまる可能性が高いです。",
    },
    {
      question: "中小企業や非正規労働者にも賃上げは波及していますか？",
      answer: "連合データは主に労組のある大企業（5.46%）の数字です。中小企業は約4.5%、非正規労働者は約3〜4%、公務員（人事院勧告）は約2.7%とされ、雇用者の約7割を占める中小企業や約4割の非正規労働者への満額反映が今後の焦点です。",
    },
    {
      question: "この賃上げの流れはいつまで続きますか？",
      answer: "3つの見方があります。楽観シナリオでは人手不足・労働分配率の見直しで今後5年は3〜4%台が定着、中立シナリオでは物価上昇が落ち着けば2〜3%台に、悲観シナリオでは資源高・円安が落ち着けば過去30年と同じ低水準に戻ります。",
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
        title="2025年 春闘・賃上げの実態 ─ 過去30年で最高水準だが家計に届くか"
        description="2025年春闘の平均賃上げ率は5%超。33年ぶりの高水準だが、物価上昇と社会保険料増加でどれだけ手取りに反映されるのか。過去30年の賃上げ率と実質賃金の関係をデータで検証する。"
        readingTime={6}
        tags={["春闘", "賃上げ", "実質賃金"]}
      >
        <Section heading="33年ぶりの大型賃上げ、その実態">
          <p>
            連合がまとめた2025年春闘の平均賃上げ率は<strong>5.46%</strong>（5月最終集計、5,000円以上）。
            前年（5.10%）に続き、<strong>2年連続で5%超え</strong>を達成した。
            これは1991年（5.66%）以来、約34年ぶりの高水準だ。
          </p>
          <p>
            一見、明るいニュースだが「実質的に家計に届くか」は別問題。
            物価上昇・社会保険料増・税負担増を差し引いた<strong>実質手取りベース</strong>で、本当に増えているのか検証する。
          </p>
        </Section>

        <Section heading="春闘賃上げ率の30年推移">
          <DataBox
            items={[
              { label: "1991年", value: "5.66%", note: "バブル末期",          color: "#22c55e" },
              { label: "2002年", value: "1.66%", note: "デフレ底",            color: "#ef4444" },
              { label: "2013年", value: "1.80%", note: "アベノミクス開始",    color: "#D97706" },
              { label: "2020年", value: "2.00%", note: "コロナ直前",          color: "#D97706" },
              { label: "2024年", value: "5.10%", note: "33年ぶり高水準",      color: "#22c55e" },
              { label: "2025年", value: "5.46%", note: "2年連続5%超え",       color: "#22c55e" },
            ]}
          />
          <p>
            注目すべきは、<strong>2022年まで20年間にわたり2%前後で停滞していた</strong>こと。
            2023年（3.58%）から本格的な転換が始まり、2024〜2025年で5%台に到達した。
          </p>
        </Section>

        <Section heading="名目賃上げ率 vs 実質賃金の関係">
          <p>
            「春闘で○%賃上げ」というのは<strong>名目値</strong>。
            これに対し、実質賃金は名目賃金から物価上昇を引いた指標。両者を並べると次のようになる。
          </p>
          <div className="rounded-xl border overflow-hidden overflow-x-auto my-4" style={{ borderColor: "var(--border)" }}>
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--card)", borderBottom: "1px solid var(--border)" }}>
                  <th className="text-left p-3 font-medium">年</th>
                  <th className="text-right p-3 font-medium">春闘賃上げ率</th>
                  <th className="text-right p-3 font-medium">CPI上昇率</th>
                  <th className="text-right p-3 font-medium">実質賃金推移</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--muted)" }}>
                {[
                  { y: 2021, sh: "1.86%", cpi: "▲0.2%", rw: "97.1（前年から+0.6）" },
                  { y: 2022, sh: "2.20%", cpi: "+2.5%", rw: "97.8（+0.7）" },
                  { y: 2023, sh: "3.58%", cpi: "+3.0%", rw: "98.5（+0.7）" },
                  { y: 2024, sh: "5.10%", cpi: "+2.7%", rw: "99.2（+0.7）" },
                  { y: 2025, sh: "5.46%", cpi: "+2.5%予測", rw: "≒100.0（+0.8予測）" },
                ].map((r) => (
                  <tr key={r.y} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                    <td className="p-3 font-medium" style={{ color: "var(--text)" }}>{r.y}年</td>
                    <td className="p-3 text-right tabular-nums">{r.sh}</td>
                    <td className="p-3 text-right tabular-nums">{r.cpi}</td>
                    <td className="p-3 text-right tabular-nums">{r.rw}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            5%の賃上げから2.5%の物価上昇を引いて、実質では+2.5%程度になる計算。
            しかし<strong>春闘の対象は大企業中心</strong>であり、中小企業や非正規労働者には満額反映されないことが多い。
          </p>
        </Section>

        <Section heading="社会保険料の上昇が手取りを削る">
          <p>
            賃金が増えれば、社会保険料の徴収額も同時に増える。さらに料率自体も毎年上昇している。
          </p>
          <DataBox
            items={[
              { label: "2021年 社保料率", value: "18.0%", color: "#10B981" },
              { label: "2025年 社保料率", value: "≒18.6%", note: "+0.6pt", color: "#ef4444" },
              { label: "年収500万への影響", value: "▲3万円", note: "料率上昇分のみ", color: "#ef4444" },
            ]}
          />
          <p>
            実質賃金で+2.5%増えても、社会保険料率の上昇分が約0.6%差し引かれる。
            <strong>家計に届く正味の改善は1.5〜2%程度</strong>にとどまる可能性が高い。
          </p>
        </Section>

        <Section heading="中小企業・非正規労働者への波及は？">
          <p>
            連合のデータは主に労組のある大企業の数字。日本の雇用者の約7割は中小企業で働き、
            約4割は非正規労働者。これらの層への波及がどれだけ起きるかが今後の焦点だ。
          </p>
          <div className="rounded-xl border p-4 space-y-3 my-4" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            {[
              { title: "大企業（労組あり）", val: "5.46%", note: "連合データ" },
              { title: "中小企業",          val: "≒4.5%",  note: "日商の見通し" },
              { title: "非正規労働者",      val: "≒3〜4%",  note: "最低賃金引上げと連動" },
              { title: "公務員（人事院勧告）", val: "≒2.7%", note: "やや低めに連動" },
            ].map(({ title, val, note }) => (
              <div key={title} className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>{title}</div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>{note}</div>
                </div>
                <div className="text-base font-bold tabular-nums" style={{ color: "var(--link)" }}>{val}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section heading="この賃上げの流れはいつまで続くか">
          <p>
            賃上げ持続性については、3つの見方がある。
          </p>
          <div className="rounded-xl border p-4 space-y-3 my-4" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <div>
              <div className="font-semibold" style={{ color: "#22c55e" }}>🟢 楽観：構造転換が始まった</div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                人手不足・労働分配率の見直しが本格化。今後5年は3〜4%台の賃上げが定着する。
              </p>
            </div>
            <div>
              <div className="font-semibold" style={{ color: "#D97706" }}>🟡 中立：物価次第</div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                物価上昇が落ち着けば賃上げ率も2〜3%台に落ち着く。実質賃金は緩やかに改善。
              </p>
            </div>
            <div>
              <div className="font-semibold" style={{ color: "#ef4444" }}>🔴 悲観：一過性</div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                資源高・円安が落ち着けば賃上げ圧力も消え、過去30年と同じ低水準に戻る。
              </p>
            </div>
          </div>
        </Section>

        <Section heading="まとめ">
          <ul className="list-disc pl-5 space-y-1 my-3 text-sm" style={{ color: "var(--text)" }}>
            <li>2025年春闘の賃上げ率5.46%は33年ぶりの高水準</li>
            <li>物価上昇分を引いた実質賃金は約2.5%増の見込み</li>
            <li>社会保険料の上昇で正味の手取り改善は1.5〜2%程度</li>
            <li>中小企業・非正規労働者への波及度合いが今後の焦点</li>
            <li>持続性は人手不足・物価動向によって変動する</li>
          </ul>
        </Section>
        <Section heading="関連記事">
          <ul className="list-disc pl-5 space-y-1">
            <li><Link href="/articles/real-wages" className="underline" style={{ color: "var(--link)" }}>実質賃金とは？なぜ日本人の生活は豊かになった実感がないのか</Link></li>
            <li><Link href="/articles/social-insurance-burden" className="underline" style={{ color: "var(--link)" }}>手取りが増えない本当の理由 ─ 社会保険料30年の増加</Link></li>
            <li><Link href="/articles/inflation-cycles-japan" className="underline" style={{ color: "var(--link)" }}>物価高はいつまで続く？─ 過去30年の4つのインフレ局面を分析</Link></li>
          </ul>
        </Section>
      </ArticleLayout>
    </>
  );
}
