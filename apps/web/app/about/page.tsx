import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KeizaiMapについて — データソース・サービス概要",
  description:
    "KeizaiMapのサービス概要・データ出典・政治的中立性に関する宣言。賃金・物価・税収・為替データの出典と取得方法を掲載。",
};

const SOURCES = [
  {
    indicator: "実質賃金指数",
    source: "厚生労働省 毎月勤労統計調査",
    series: "実質賃金指数（現金給与総額）1990年=100",
    method: "e-Stat API",
  },
  {
    indicator: "消費者物価指数（CPI）",
    source: "総務省統計局 消費者物価指数",
    series: "総合指数 1990年=100",
    method: "e-Stat API",
  },
  {
    indicator: "税収（兆円）",
    source: "財務省 租税及び印紙収入決算額調",
    series: "一般会計税収（国税）兆円",
    method: "財務省公開CSV",
  },
  {
    indicator: "USD/JPY 為替",
    source: "日本銀行 時系列統計データ",
    series: "年平均レート 円/ドル",
    method: "日銀公開CSV",
  },
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
  return (
    <main className="min-h-screen p-6" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <div className="mx-auto space-y-0" style={{ maxWidth: 720 }}>

        {/* Header */}
        <div className="pb-6">
          <Link href="/" className="text-sm hover:underline mb-4 block" style={{ color: "#4F8EF7" }}>
            ← KeizaiMap に戻る
          </Link>
          <h1 className="text-2xl font-bold">KeizaiMapについて</h1>
          <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>
            サービスの概要・データ出典・政治的中立性についての説明です。
          </p>
        </div>

        {/* サービス概要 */}
        <Section title="KeizaiMapとは">
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            賃金・物価・税収・為替という、生活に直結する4つの経済指標の推移を
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
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b text-xs"
                  style={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "var(--muted)" }}
                >
                  <th className="text-left p-3 font-medium">指標</th>
                  <th className="text-left p-3 font-medium">出典</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">系列</th>
                  <th className="text-left p-3 font-medium">取得方法</th>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            ※ 現在のデータ（1990〜2024年・隔年）はハードコードされています。
            今後 e-Stat API・財務省CSV・日銀CSVからの自動取得に移行予定です。
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

        {/* フィードバック */}
        <Section title="フィードバック・お問い合わせ">
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            データの誤りや改善提案は GitHub Issue からご連絡ください。
          </p>
          <a
            href="https://github.com/Soshi-1114/keizai-map/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-opacity hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--text)", backgroundColor: "var(--card)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--muted)" }}>
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            データの誤りを報告 / 機能を提案する
          </a>
        </Section>

        <div className="pt-6" />
      </div>
    </main>
  );
}
