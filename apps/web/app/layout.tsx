import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://keizai-map.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "KeizaiMap — 数字で見る、日本の30年",
  description:
    "賃金・物価・税収・為替の推移を政権帯とともに一画面で可視化。なぜ生活が苦しくなったのかを数字で見る経済データダッシュボード。",
  openGraph: {
    title: "KeizaiMap — 数字で見る、日本の30年",
    description:
      "賃金・物価・税収・為替の推移を政権帯とともに一画面で可視化。なぜ生活が苦しくなったのかを数字で見る経済データダッシュボード。",
    url: BASE_URL,
    siteName: "KeizaiMap",
    images: [{ url: "/og", width: 1200, height: 630, alt: "KeizaiMap — 数字で見る、日本の30年" }],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KeizaiMap — 数字で見る、日本の30年",
    description:
      "賃金・物価・税収・為替の推移を政権帯とともに可視化。なぜ手取りが増えないのかを数字で見る。",
    images: ["/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
