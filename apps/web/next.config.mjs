/**
 * 全レスポンスに付与するセキュリティヘッダ。
 *
 * CSP の許可先:
 * - GA / GTM: script-src + img-src + connect-src
 * - next/font (Noto Sans JP): 自己ホスト化されるため style-src 'self' で足りるが、
 *   fonts.googleapis.com / fonts.gstatic.com も保険で許可
 * - next/image: 現状 remotePatterns 未設定で自己ホスト画像のみ。data:/blob: は OG 画像用
 * - inline script/style: GA 初期化スニペットと Recharts/Next.js の style 属性多用のため 'unsafe-inline' 必須
 *   （将来的に nonce 化が望ましい）
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      {
        // 旧ドメイン keizai-map.vercel.app への全アクセスを正規ドメインへ
        // 永続リダイレクト (308)。SEO 評価の分散とユーザーのブックマーク切れを防ぐ。
        // クエリパラメータは Next.js が自動的に保持するため、
        // /articles/real-wages?indicators=wage,cpi のようなディープリンクも壊れない。
        source: "/:path*",
        has: [{ type: "host", value: "keizai-map.vercel.app" }],
        destination: "https://keizaimap.jp/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
