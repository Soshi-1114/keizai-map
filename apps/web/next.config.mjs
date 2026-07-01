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
 * - 'unsafe-eval': 本番では付与しない。`next dev` の Fast Refresh（HMR）が eval を使うため、
 *   開発時のみ許可する。これが無いと dev でクライアント JS がハイドレートできずグラフ/フィルターが固まる。
 */
const isDev = process.env.NODE_ENV !== "production";
const scriptSrc = [
  "script-src 'self' 'unsafe-inline'",
  isDev ? "'unsafe-eval'" : null,
  "https://www.googletagmanager.com https://www.google-analytics.com",
]
  .filter(Boolean)
  .join(" ");

const CSP = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  // 本番のみ http→https 昇格。dev で LAN の http://<IP>:3000 にスマホから繋ぐ際、
  // これが有ると https に強制昇格して接続不能になるため開発時は外す。
  isDev ? null : "upgrade-insecure-requests",
]
  .filter(Boolean)
  .join("; ");

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
