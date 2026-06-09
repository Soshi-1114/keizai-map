import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "データソースについて — KeizaiMap",
};

const SOURCES = [
  {
    indicator: "実質賃金（1990=100）",
    source: "厚生労働省 毎月勤労統計調査",
    method: "e-Stat API",
    note: "実質賃金指数、1990年を100として換算",
  },
  {
    indicator: "消費者物価指数（1990=100）",
    source: "総務省統計局 消費者物価指数",
    method: "e-Stat API",
    note: "総合指数、1990年を100として換算",
  },
  {
    indicator: "税収（兆円）",
    source: "財務省 租税及び印紙収入決算額調",
    method: "財務省公開CSV",
    note: "一般会計租税及び印紙収入、年次・兆円単位",
  },
  {
    indicator: "USD/JPY 為替（円）",
    source: "日本銀行 時系列統計データ",
    method: "日銀公開CSV",
    note: "インターバンク直物中心相場の年次平均値",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen p-6" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <div className="max-w-3xl mx-auto space-y-8">

        <div className="pb-4 border-b" style={{ borderColor: "var(--border)" }}>
          <Link href="/" className="text-sm hover:underline mb-3 block" style={{ color: "#4F8EF7" }}>
            ← KeizaiMap に戻る
          </Link>
          <h1 className="text-2xl font-bold">データソースについて</h1>
          <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>
            使用データはすべて公開統計です。政治的な解釈はユーザーに委ねる設計としています。
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">指標と出典</h2>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "var(--muted)" }}>
                  <th className="text-left p-3 font-medium">指標</th>
                  <th className="text-left p-3 font-medium">出典</th>
                  <th className="text-left p-3 font-medium">取得方法</th>
                  <th className="text-left p-3 font-medium">備考</th>
                </tr>
              </thead>
              <tbody>
                {SOURCES.map((row, i) => (
                  <tr
                    key={row.indicator}
                    className="border-b last:border-0"
                    style={{ borderColor: "var(--border)", backgroundColor: i % 2 === 0 ? "transparent" : "var(--card)" + "80" }}
                  >
                    <td className="p-3 font-medium">{row.indicator}</td>
                    <td className="p-3" style={{ color: "var(--muted)" }}>{row.source}</td>
                    <td className="p-3" style={{ color: "var(--muted)" }}>{row.method}</td>
                    <td className="p-3 text-xs" style={{ color: "var(--muted)" }}>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">現在のデータについて</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            MVP（v1）では 1990〜2024 年の隔年データをハードコードしています。
            v2 以降で e-Stat API・財務省CSV・日銀CSVからの自動取得に移行予定です。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">免責事項</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            本サービスは教育・情報提供を目的としています。数値の解釈や判断はユーザー自身の責任において行ってください。
            データの正確性には注意を払っていますが、公式統計機関の原典を必ず参照してください。
          </p>
        </section>
      </div>
    </main>
  );
}
