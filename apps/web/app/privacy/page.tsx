import Link from "next/link";
import type { Metadata } from "next";
import Script from "next/script";
import { ThemeToggle } from "@/components/ThemeToggle";
import { generatePageBreadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "プライバシーポリシー — KeizaiMap",
  description:
    "KeizaiMapのプライバシーポリシー。Cookie・アクセス解析（Google Analytics）・広告配信・アフィリエイトリンクに関する取り扱いを説明します。",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
      <h2 className="text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://keizai-map.vercel.app";

export default function PrivacyPage() {
  const lastUpdated = "2026年6月11日";
  const breadcrumbJsonLd = generatePageBreadcrumbJsonLd([
    { name: "KeizaiMap", url: BASE_URL },
    { name: "プライバシーポリシー", url: `${BASE_URL}/privacy` },
  ]);

  return (
    <>
      <Script id="breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    <main id="main" className="min-h-screen p-6" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <div className="mx-auto space-y-0" style={{ maxWidth: 720 }}>

        {/* Header */}
        <div className="pb-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="text-sm hover:underline" style={{ color: "#4F8EF7" }}>
              ← KeizaiMap に戻る
            </Link>
            <ThemeToggle />
          </div>
          <h1 className="text-2xl font-bold">プライバシーポリシー</h1>
          <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>
            最終更新日：{lastUpdated}
          </p>
        </div>

        {/* 基本方針 */}
        <Section title="基本方針">
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            KeizaiMap（以下「当サイト」）は、ユーザーの個人情報の取り扱いを適切に行うため、
            本プライバシーポリシーを定めます。当サイトを利用することで、本ポリシーに同意したものとみなします。
          </p>
        </Section>

        {/* 収集する情報 */}
        <Section title="収集する情報">
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            当サイトは、以下の情報を自動的に収集する場合があります。
          </p>
          <ul className="text-sm space-y-2 list-disc pl-5" style={{ color: "var(--muted)" }}>
            <li>アクセスしたページのURL・タイトル</li>
            <li>参照元（リファラー）</li>
            <li>ブラウザの種類・OS・デバイス情報</li>
            <li>アクセス日時・滞在時間</li>
            <li>IPアドレス（匿名化して処理）</li>
          </ul>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            氏名・メールアドレスなどの個人を特定する情報は収集していません。
          </p>
        </Section>

        {/* アクセス解析 */}
        <Section title="アクセス解析ツールの利用（Google Analytics）">
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            当サイトは、Googleが提供するアクセス解析ツール「Google Analytics 4（GA4）」を使用しています。
            Google AnalyticsはCookieを使用してユーザーの行動データを収集しますが、
            収集されたデータはGoogleのプライバシーポリシーに基づいて管理されます。
          </p>
          <div
            className="rounded-xl p-4 text-sm space-y-2"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div className="flex gap-2">
              <span className="shrink-0 font-semibold" style={{ color: "var(--text)" }}>目的</span>
              <span style={{ color: "var(--muted)" }}>サイトの利用状況把握・コンテンツ改善</span>
            </div>
            <div className="flex gap-2">
              <span className="shrink-0 font-semibold" style={{ color: "var(--text)" }}>収集主体</span>
              <span style={{ color: "var(--muted)" }}>Google LLC</span>
            </div>
            <div className="flex gap-2">
              <span className="shrink-0 font-semibold" style={{ color: "var(--text)" }}>オプトアウト</span>
              <span style={{ color: "var(--muted)" }}>
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#4F8EF7" }}
                >
                  Google Analytics オプトアウトアドオン
                </a>
                でブラウザから無効化できます
              </span>
            </div>
          </div>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            詳細は
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline ml-1"
              style={{ color: "#4F8EF7" }}
            >
              Google プライバシーポリシー
            </a>
            をご覧ください。
          </p>
        </Section>

        {/* 広告 */}
        <Section title="広告の配信（Google AdSense）">
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            当サイトは、Googleが提供する広告配信サービス「Google AdSense」を利用しています（または将来的に利用する予定です）。
            Google AdSenseはCookieを使用して、ユーザーの興味に基づいた広告を表示します。
          </p>
          <ul className="text-sm space-y-1 list-disc pl-5" style={{ color: "var(--muted)" }}>
            <li>表示される広告はユーザーの閲覧履歴等をもとにパーソナライズされる場合があります</li>
            <li>広告のパーソナライズは
              <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="hover:underline ml-1" style={{ color: "#4F8EF7" }}>
                広告設定ページ
              </a>
              から無効化できます
            </li>
          </ul>
        </Section>

        {/* アフィリエイト */}
        <Section title="アフィリエイトプログラムへの参加">
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            当サイトは、以下のアフィリエイトプログラムに参加しています（または将来的に参加する予定です）。
            記事内のリンクから商品・サービスを購入された場合、当サイトが報酬を受け取ることがあります。
          </p>
          <div
            className="rounded-xl p-4 text-sm space-y-2"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div>
              <div className="font-semibold mb-0.5" style={{ color: "var(--text)" }}>Amazonアソシエイト</div>
              <div style={{ color: "var(--muted)" }}>
                Amazon.co.jpを宣伝しリンクすることによってサイトが紹介料を獲得できる手段を提供することを目的に設定されたアフィリエイトプログラムである、Amazonアソシエイト・プログラムの参加者です。
              </div>
            </div>
            <div>
              <div className="font-semibold mb-0.5" style={{ color: "var(--text)" }}>金融サービス系アフィリエイト</div>
              <div style={{ color: "var(--muted)" }}>
                FX・証券などの金融サービスに関するリンクを掲載する場合があります。
                いずれもASP（アフィリエイトサービスプロバイダ）を通じて掲載しています。
              </div>
            </div>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            アフィリエイトリンクを含むコンテンツは、当サイトの編集方針・中立性に基づいて作成しており、
            報酬の有無によってコンテンツの内容を意図的に変えることはありません。
          </p>
        </Section>

        {/* Cookie */}
        <Section title="Cookieについて">
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            当サイトはCookieを使用しています。Cookieとは、ウェブサイトがブラウザに保存する小さなテキストデータです。
            ブラウザの設定からCookieを無効にすることができますが、一部の機能が正常に動作しなくなる場合があります。
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            当サイトが使用するCookieの主な用途：
          </p>
          <ul className="text-sm space-y-1 list-disc pl-5" style={{ color: "var(--muted)" }}>
            <li>ダークモード設定の保存（テーマ設定）</li>
            <li>Google Analyticsによるアクセス計測</li>
            <li>Google AdSenseによる広告配信</li>
          </ul>
        </Section>

        {/* 外部リンク */}
        <Section title="外部リンクについて">
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            当サイトは外部サイトへのリンクを含む場合があります。
            リンク先のプライバシーポリシー・コンテンツについては当サイトの管理外であり、責任を負いません。
          </p>
        </Section>

        {/* 免責事項 */}
        <Section title="免責事項">
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            当サイトに掲載する情報の正確性には十分注意していますが、
            内容の完全性・最新性・有用性を保証するものではありません。
            当サイトの情報を利用したことによって生じたいかなる損害についても、
            当サイト運営者は責任を負いません。
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            経済指標のデータは公開統計に基づいていますが、投資・資産運用の判断に利用する場合は
            必ず一次ソース（各省庁・日本銀行）の原典を参照し、ご自身の判断と責任のもとで行ってください。
          </p>
        </Section>

        {/* お問い合わせ */}
        <Section title="プライバシーポリシーに関するお問い合わせ">
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            本ポリシーに関するご質問・ご意見は、GitHubのIssueよりご連絡ください。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-opacity hover:opacity-80"
              style={{ borderColor: "var(--border)", color: "var(--text)", backgroundColor: "var(--card)" }}
            >
              ✉ お問い合わせページ
            </Link>
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
              GitHub Issue でお問い合わせ
            </a>
          </div>
        </Section>

        {/* 改定 */}
        <Section title="プライバシーポリシーの改定">
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            本ポリシーは、法令の改正やサービス内容の変更に応じて予告なく改定することがあります。
            重要な変更を行った場合は、本ページの最終更新日を更新します。
          </p>
        </Section>

        <div className="pt-6" />
      </div>
    </main>
    </>
  );
}
