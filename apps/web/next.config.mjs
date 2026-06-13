/** @type {import('next').NextConfig} */
const nextConfig = {
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
