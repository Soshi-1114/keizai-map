import Link from "next/link";
import type { Metadata } from "next";
import { ThemeToggle } from "@/components/ThemeToggle";
import { generatePageBreadcrumbJsonLd } from "@/lib/jsonld";
import { BASE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "お問い合わせ — KeizaiMap",
  description:
    "KeizaiMapへのお問い合わせページ。データの誤り・機能改善のご提案・その他のご連絡はこちらからどうぞ。原則48時間以内に確認・回答します。",
  alternates: { canonical: "/contact" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
      <h2 className="text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function ContactPage() {
  const breadcrumbJsonLd = generatePageBreadcrumbJsonLd([
    { name: "KeizaiMap", url: BASE_URL },
    { name: "お問い合わせ", url: `${BASE_URL}/contact` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
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
          <h1 className="text-2xl font-bold">お問い合わせ</h1>
          <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>
            データの誤り・機能改善のご提案・その他のご連絡はこちらからお送りください。
          </p>
        </div>

        {/* 返答について */}
        <Section title="返答について">
          <div
            className="rounded-xl p-4 text-sm leading-relaxed space-y-2"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
          >
            <p style={{ color: "var(--text)" }}>
              いただいたご連絡には<strong>原則48時間以内</strong>に確認・回答します。
              データの誤りについてはご報告後、できる限り速やかに修正し、訂正履歴をコミット履歴で公開します。
            </p>
            <p style={{ color: "var(--muted)" }}>
              KeizaiMapは個人運営のプロジェクトです。返答が遅れる場合がございます。あらかじめご了承ください。
            </p>
          </div>
        </Section>

        {/* お問い合わせ方法 */}
        <Section title="お問い合わせ方法">
          <div className="space-y-3">

            {/* メール */}
            <div
              className="rounded-xl p-4 space-y-2"
              style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 font-semibold text-sm" style={{ color: "var(--text)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                メール
              </div>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                一般的なお問い合わせ・ご意見はメールでご連絡ください。
              </p>
              <a
                href="mailto:keizai.map@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-opacity hover:opacity-80"
                style={{ borderColor: "var(--border)", color: "var(--link)", backgroundColor: "var(--bg)" }}
              >
                keizai.map@gmail.com
              </a>
            </div>

            {/* データ誤り報告 */}
            <div
              className="rounded-xl p-4 space-y-2"
              style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 font-semibold text-sm" style={{ color: "var(--text)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                  <path d="M12 9v4"/>
                  <path d="M12 17h.01"/>
                </svg>
                データ・数値の誤りを報告する
              </div>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                統計数値の誤り・出典の誤記・表記揺れなどにお気づきの場合は GitHub Issue でご報告ください。
                修正履歴はすべて公開されます。
              </p>
              <a
                href="https://github.com/Soshi-1114/keizai-map/issues/new?title=%5B%E8%AA%A4%E3%82%8A%E5%A0%B1%E5%91%8A%5D&labels=data-error"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-opacity hover:opacity-80"
                style={{ borderColor: "var(--border)", color: "var(--text)", backgroundColor: "var(--bg)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub Issue でデータ誤りを報告
              </a>
            </div>

            {/* 機能改善提案 */}
            <div
              className="rounded-xl p-4 space-y-2"
              style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 font-semibold text-sm" style={{ color: "var(--text)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4"/>
                  <path d="M12 16h.01"/>
                </svg>
                機能改善・新機能の提案
              </div>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                KeizaiMapへの機能追加・改善のご提案をお待ちしています。
              </p>
              <a
                href="https://github.com/Soshi-1114/keizai-map/issues/new?title=%5B%E6%A9%9F%E8%83%BD%E6%8F%90%E6%A1%88%5D&labels=enhancement"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-opacity hover:opacity-80"
                style={{ borderColor: "var(--border)", color: "var(--text)", backgroundColor: "var(--bg)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub Issue で機能を提案
              </a>
            </div>
          </div>
        </Section>

        {/* お問い合わせの種類 */}
        <Section title="対応可能なお問い合わせ">
          <ul className="text-sm space-y-2 list-disc pl-5" style={{ color: "var(--muted)" }}>
            <li>記事内の数値・グラフの誤り指摘</li>
            <li>データ出典・参照元に関するご質問</li>
            <li>ダッシュボードの機能についてのご質問</li>
            <li>機能改善・新指標追加のご提案</li>
            <li>メディア・教育機関からの利用に関するお問い合わせ</li>
            <li>その他、サービスに関するご意見・ご感想</li>
          </ul>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            投資・資産運用に関する個別相談・アドバイスはお答えしておりません。
            経済指標の解釈は公開データに基づく参考情報としてご利用ください。
          </p>
        </Section>

        {/* サービス情報 */}
        <Section title="サービス情報">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl p-3 space-y-1" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="font-semibold" style={{ color: "var(--text)" }}>サービス名</div>
              <div style={{ color: "var(--muted)" }}>KeizaiMap</div>
            </div>
            <div className="rounded-xl p-3 space-y-1" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="font-semibold" style={{ color: "var(--text)" }}>運営形態</div>
              <div style={{ color: "var(--muted)" }}>個人運営・オープンソース</div>
            </div>
            <div className="rounded-xl p-3 space-y-1" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="font-semibold" style={{ color: "var(--text)" }}>メールアドレス</div>
              <div style={{ color: "var(--muted)" }}>keizai.map@gmail.com</div>
            </div>
            <div className="rounded-xl p-3 space-y-1" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="font-semibold" style={{ color: "var(--text)" }}>返答目安</div>
              <div style={{ color: "var(--muted)" }}>原則48時間以内</div>
            </div>
          </div>
        </Section>

        <div className="pt-6 text-xs text-center space-y-1" style={{ color: "var(--muted)" }}>
          <p>
            <Link href="/about" className="hover:underline" style={{ color: "var(--muted)" }}>KeizaiMapについて</Link>
            &nbsp;|&nbsp;
            <Link href="/privacy" className="hover:underline" style={{ color: "var(--muted)" }}>プライバシーポリシー</Link>
            &nbsp;|&nbsp;
            <Link href="/" className="hover:underline" style={{ color: "var(--muted)" }}>ダッシュボード</Link>
          </p>
        </div>

        <div className="pt-6" />
      </div>
    </main>
    </>
  );
}
