import Link from "next/link";
import type { Metadata } from "next";
import { Database } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { generatePageBreadcrumbJsonLd, generateOrganizationJsonLd, generatePersonJsonLd, generateWebSiteJsonLd } from "@/lib/jsonld";
import { BASE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "KeizaiMapについて — データソース・運営体制",
  description:
    "KeizaiMapのサービス概要・データ出典・政治的中立性に関する宣言。賃金・物価・税収・為替データの出典と取得方法を掲載。",
  alternates: { canonical: "/about" },
};

type AutoStatus = "auto" | "manual";
const SOURCES: {
  indicator: string;
  source: string;
  series: string;
  method: string;
  status: AutoStatus;
}[] = [
  { indicator: "実質賃金指数",          source: "厚生労働省 毎月勤労統計調査",      series: "実質賃金指数（現金給与総額）1990=100",         method: "手動更新（API非公開）",     status: "manual" },
  { indicator: "消費者物価指数（CPI）", source: "総務省統計局 消費者物価指数",       series: "総合指数 1990=100",                            method: "e-Stat API（自動）",         status: "auto" },
  { indicator: "税収（兆円）",          source: "財務省 一般会計税収決算",            series: "一般会計税収（国税）兆円",                       method: "MOF CSV（自動／fallback有）", status: "auto" },
  { indicator: "USD/JPY 為替",          source: "日本銀行 時系列統計データ",          series: "年平均レート 円/ドル",                          method: "BOJ CSV（自動／fallback有）", status: "auto" },
  { indicator: "日経平均株価",          source: "取引所公開資料 / 日本経済新聞社",    series: "日経平均株価 年末値（1990=100に基準化）",       method: "手動更新",                  status: "manual" },
  { indicator: "住宅価格指数",          source: "国土交通省 不動産価格指数",          series: "住宅地 1990=100",                              method: "手動更新",                  status: "manual" },
  { indicator: "国債残高（兆円）",      source: "財務省 国債統計年報",                series: "普通国債残高（年度末） 兆円",                    method: "MOF CSV（自動／fallback有）", status: "auto" },
  { indicator: "出生数（万人）",        source: "厚生労働省 人口動態調査",            series: "出生数 万人",                                  method: "e-Stat API（自動）",         status: "auto" },
  { indicator: "社会保険料負担率（%）", source: "厚生労働省 / 財務省 国民負担率推移", series: "社会保障負担率 ％",                              method: "手動更新（年1回）",         status: "manual" },
  { indicator: "【比較】G7平均 実質賃金", source: "OECD Real Average Wages",         series: "G7加盟国平均 1990=100",                          method: "手動更新",                  status: "manual" },
  { indicator: "【比較】G7平均 CPI",      source: "OECD Inflation (HICP)",            series: "G7加盟国平均 1990=100",                          method: "手動更新",                  status: "manual" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
      <h2 className="text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function AboutPage() {
  const breadcrumbJsonLd = generatePageBreadcrumbJsonLd([
    { name: "KeizaiMap", url: BASE_URL },
    { name: "KeizaiMapについて", url: `${BASE_URL}/about` },
  ]);
  const organizationJsonLd = generateOrganizationJsonLd();
  const personJsonLd = generatePersonJsonLd();
  const websiteJsonLd = generateWebSiteJsonLd();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
    <main id="main" className="min-h-screen p-6 overflow-x-hidden" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <div className="mx-auto space-y-0 min-w-0" style={{ maxWidth: 720 }}>

        {/* Header */}
        <div className="pb-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="text-sm hover:underline" style={{ color: "var(--link)" }}>
              ← KeizaiMap に戻る
            </Link>
            <ThemeToggle />
          </div>
          <h1 className="text-2xl font-bold">KeizaiMapについて</h1>
          <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>
            サービスの概要・データ出典・政治的中立性についての説明です。
          </p>
        </div>

        {/* サービス概要 */}
        <Section title="KeizaiMapとは">
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            実質賃金・物価・税収・為替・日経平均・住宅価格・国債残高・出生数・社会保険料という、
            日本経済を総合的に理解するための9つの経済指標の推移を
            一画面で重ねて見られる経済データダッシュボードです。
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            「なんとなく生活が苦しくなった気がする」という感覚を、
            データで確かめるためのツールとして作りました。
            政権帯を重ねることで、どの時期にどんな変化が起きたかを
            文脈とともに把握できます。
          </p>
        </Section>

        {/* データソーステーブル */}
        <Section title="指標と出典">
          <div className="rounded-xl border overflow-hidden overflow-x-auto" style={{ borderColor: "var(--border)" }}>
            <table className="min-w-full text-sm">
              <thead>
                <tr
                  className="border-b text-xs"
                  style={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "var(--muted)" }}
                >
                  <th className="text-left p-3 font-medium">指標</th>
                  <th className="text-left p-3 font-medium">出典</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">系列</th>
                  <th className="text-left p-3 font-medium">取得方法</th>
                  <th className="text-left p-3 font-medium hidden sm:table-cell">状態</th>
                </tr>
              </thead>
              <tbody>
                {SOURCES.map((row, i) => (
                  <tr
                    key={row.indicator}
                    className="border-b last:border-0"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: i % 2 === 0 ? "transparent" : "var(--card)",
                    }}
                  >
                    <td className="p-3 font-medium text-xs md:text-sm">{row.indicator}</td>
                    <td className="p-3 text-xs" style={{ color: "var(--muted)" }}>{row.source}</td>
                    <td className="p-3 text-xs hidden md:table-cell" style={{ color: "var(--muted)" }}>{row.series}</td>
                    <td className="p-3 text-xs" style={{ color: "var(--muted)" }}>{row.method}</td>
                    <td className="p-3 text-xs hidden sm:table-cell">
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-tiny font-semibold whitespace-nowrap"
                        style={{
                          backgroundColor: row.status === "auto" ? "#16653420" : "#92400e20",
                          color: row.status === "auto" ? "#166534" : "#92400e",
                        }}
                      >
                        {row.status === "auto" ? "🟢 自動" : "🟡 手動"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            ※ 1990〜2024年の<strong>年次</strong>データを掲載しています。
            🟢 自動指標は GitHub Actions により月次でデータソースから取得しています。
            🟡 手動指標は公開API非対応のため、四半期ごとに公開資料から人手で更新しています。
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            自動取得が失敗した場合は、コミット済みのフォールバック値を表示します（連続性確保のため）。
          </p>
        </Section>

        {/* 編集方針 */}
        <Section title="編集方針">
          <div
            className="rounded-xl p-4 text-sm leading-relaxed space-y-2"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
          >
            <p style={{ color: "var(--text)" }}>
              KeizaiMap は<strong>「公的統計の数字をそのまま見せる」</strong>ことを編集の原則としています。
            </p>
            <ul className="list-disc pl-5 space-y-1" style={{ color: "var(--muted)" }}>
              <li><strong>一次情報のみを採用</strong>：厚生労働省・総務省・財務省・日本銀行・国土交通省・OECD の公開統計が出典。二次的なまとめ記事・ニュース記事は数値ソースに使用しません。</li>
              <li><strong>計算式とロジックを公開</strong>：指数化（1990=100）や年平均化などの集計処理はすべて GitHub の <code>packages/data</code> に実装し、変更履歴を残しています。</li>
              <li><strong>記事は政治的中立</strong>：特定の政党・政権の評価を目的としません。「3本の矢で税収は43.9兆円から60.8兆円へ増加した」のように、評価ではなく事実を提示します。</li>
              <li><strong>誤りは即時訂正</strong>：データの誤り・記述ミスを発見した場合は GitHub のコミット履歴で訂正の事実を残し、記事末尾の出典欄に最終更新日を明記します。</li>
            </ul>
            <p style={{ color: "var(--muted)" }}>
              本サービスは投資助言・税務助言を提供するものではありません。掲載数値は投資判断・税務判断の根拠としての利用を意図したものではなく、利用は自己責任でお願いします。
            </p>
          </div>
        </Section>

        {/* 運営者 */}
        <Section title="運営者">
          <div
            id="operator"
            className="rounded-xl p-4 text-sm leading-relaxed space-y-2"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
          >
            <p style={{ color: "var(--text)" }}>
              <strong>KeizaiMap</strong> は個人開発のオープンソースプロジェクトです。
              開発・運営者は GitHub（<a href="https://github.com/Soshi-1114" target="_blank" rel="author noopener noreferrer" style={{ color: "var(--link)" }}>@Soshi-1114</a>）で活動するソフトウェアエンジニアです。
            </p>
            <p style={{ color: "var(--muted)" }}>
              本サービスは経済学者・専門家の監修を受けていません。掲載するすべての数値は
              公的統計機関（厚生労働省・総務省・財務省・日本銀行・国土交通省・OECD）の公開データを
              そのまま、あるいは決まった方法で集計したものです。
            </p>
            <p style={{ color: "var(--muted)" }}>
              ソースコードは GitHub で公開しており、データ集計ロジック・解説記事すべての変更履歴を
              <a
                href="https://github.com/Soshi-1114/keizai-map/commits/master"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--link)" }}
              >
                コミット履歴
              </a>
              から検証できます。
            </p>
          </div>
        </Section>

        {/* 更新ポリシー */}
        <Section title="データ更新ポリシー">
          <div
            className="rounded-xl p-4 text-sm leading-relaxed space-y-3"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div>
              <div className="font-semibold mb-1" style={{ color: "var(--text)" }}>🟢 自動指標（5系列）</div>
              <p style={{ color: "var(--muted)" }}>
                CPI・出生数・税収・USD/JPY・国債残高は GitHub Actions により<strong>毎月1日（09:00 JST）</strong>に
                公開APIから取得しています。差分があれば自動コミット・自動デプロイされます。
              </p>
            </div>
            <div>
              <div className="font-semibold mb-1" style={{ color: "var(--text)" }}>🟡 手動指標（4系列）</div>
              <p style={{ color: "var(--muted)" }}>
                実質賃金・日経平均・住宅価格・社会保険料負担率は公開APIが存在しないため、
                公的統計の確定値が発表されるタイミング（年4回程度）で人手更新します。
              </p>
            </div>
            <div>
              <div
                className="inline-flex items-center gap-1.5 font-semibold mb-1"
                style={{ color: "var(--text)" }}
              >
                <Database size={14} aria-hidden />
                データの集計範囲
              </div>
              <p style={{ color: "var(--muted)" }}>
                1990年（バブル絶頂期）〜直近確定値までの<strong>年次データ</strong>を表示します。
                月次・四半期データの追加は現在検討中です。
              </p>
            </div>
          </div>
        </Section>

        {/* 編集方針 */}
        <Section title="編集方針">
          <div
            className="rounded-xl p-4 text-sm leading-relaxed space-y-2"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
          >
            <ul className="space-y-1.5 list-disc pl-5" style={{ color: "var(--text)" }}>
              <li>すべての記述は<strong>公開統計の原典</strong>に基づきます。推測・伝聞を排除します。</li>
              <li>政治的中立を貫きます。特定の政党・政権を支持・批判する意図はありません。</li>
              <li>解説記事内のデータ引用は<strong>data.generated.json と一致</strong>させます（差異が出ないようコンポーネントで検証）。</li>
              <li>解釈の余地がある記述には「とされる」「みられる」等の表現を用い、断定を避けます。</li>
              <li>誤りが発覚した場合は<strong>速やかに修正</strong>し、コミット履歴で訂正履歴を残します。</li>
            </ul>
          </div>
        </Section>

        {/* 更新ログ */}
        <Section title="データ更新ログ">
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            データの更新・修正履歴を記録しています。透明性確保のため、主要な変更はこちらに掲載します。
          </p>
          <div className="space-y-2 mt-2">
            {[
              { date: "2026年06月", label: "自動取得", desc: "CPI・出生数・税収（72.1兆円）・USD/JPY（151.8円）・国債残高（1,170.3兆円）を更新（2024年確定値）" },
              { date: "2026年06月", label: "記事追加", desc: "SEO強化記事 第2弾9本追加（21本→30本）。内部リンク・FAQPage構造化データを全記事に整備" },
              { date: "2026年05月", label: "記事追加", desc: "SEO強化記事5本追加（16本→21本）" },
              { date: "2026年05月", label: "機能改善", desc: "パンくずリスト・BreadcrumbList JSON-LD を全ページに追加。/contact ページ新設" },
              { date: "2026年04月", label: "自動取得", desc: "自動更新パイプライン（GitHub Actions）が稼働開始。CPI・税収・USD/JPY・国債残高・出生数の月次自動取得を開始" },
              { date: "2026年03月", label: "初回公開", desc: "KeizaiMap v1.0 公開。実質賃金・CPI・税収・USD/JPY・日経平均・住宅価格・国債残高・出生数・社会保険料の9指標を搭載" },
            ].map(({ date, label, desc }) => (
              <div
                key={date + label}
                className="flex gap-3 rounded-lg px-3 py-2.5"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
              >
                <div className="shrink-0 text-xs tabular-nums pt-0.5" style={{ color: "var(--muted)", minWidth: 72 }}>{date}</div>
                <div className="flex-1 min-w-0">
                  <span
                    className="inline-block text-tiny font-semibold px-1.5 py-0.5 rounded mr-2"
                    style={{
                      backgroundColor: label === "自動取得" ? "#16653420" : label === "記事追加" ? "#1d4ed820" : "#92400e20",
                      color: label === "自動取得" ? "#166534" : label === "記事追加" ? "#1d4ed8" : "#92400e",
                    }}
                  >
                    {label}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text)" }}>{desc}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
            詳細な変更履歴は
            <a
              href="https://github.com/Soshi-1114/keizai-map/commits/master"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80 mx-1"
              style={{ color: "var(--link)" }}
            >
              GitHub コミット履歴
            </a>
            で確認できます。
          </p>
        </Section>

        {/* 政治的中立性 */}
        <Section title="データの解釈について">
          <div
            className="rounded-xl p-4 text-sm leading-relaxed space-y-2"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)", border: "1px solid" }}
          >
            <p style={{ color: "var(--text)" }}>
              このサービスは、公開されている統計データをそのまま表示するものです。
              特定の政党・政権・政治的立場を支持・批判する意図はありません。
            </p>
            <p style={{ color: "var(--muted)" }}>
              政権帯は「どの時期に誰が政権を担っていたか」という事実情報として表示しています。
              データの解釈はユーザー自身にお委ねします。
            </p>
          </div>
        </Section>

        {/* 免責事項 */}
        <Section title="免責事項">
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            本サービスは教育・情報提供を目的としています。数値の解釈や判断はユーザー自身の責任において行ってください。
            データの正確性には注意を払っていますが、公式統計機関の原典を必ず参照してください。
          </p>
        </Section>

        {/* 誤り報告 */}
        <Section title="誤り報告・お問い合わせ窓口">
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            数値の誤り・出典の誤り・表記揺れなど、お気づきの点があればぜひご連絡ください。
            お知らせいただいた内容は<strong>原則48時間以内</strong>に確認・対応します。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border transition-opacity hover:opacity-80"
              style={{ borderColor: "var(--border)", color: "var(--text)", backgroundColor: "var(--card)" }}
            >
              ✉ お問い合わせページ
            </Link>
            <a
              href="https://github.com/Soshi-1114/keizai-map/issues/new?title=%5B%E8%AA%A4%E3%82%8A%E5%A0%B1%E5%91%8A%5D&labels=data-error"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border transition-opacity hover:opacity-80"
              style={{ borderColor: "var(--border)", color: "var(--text)", backgroundColor: "var(--card)" }}
            >
              🐛 数値・データの誤りを報告
            </a>
            <a
              href="https://github.com/Soshi-1114/keizai-map/issues/new?title=%5B%E6%A9%9F%E8%83%BD%E6%8F%90%E6%A1%88%5D&labels=enhancement"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border transition-opacity hover:opacity-80"
              style={{ borderColor: "var(--border)", color: "var(--text)", backgroundColor: "var(--card)" }}
            >
              💡 機能の改善・追加を提案
            </a>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
            報告いただいた誤りは
            <a href="https://github.com/Soshi-1114/keizai-map/issues?q=label%3Adata-error" target="_blank" rel="noopener noreferrer" style={{ color: "var(--link)" }} className="mx-1">
              修正履歴
            </a>
            で公開し、訂正の透明性を担保します。
          </p>
        </Section>

        <div className="pt-6" />
      </div>
    </main>
    </>
  );
}
