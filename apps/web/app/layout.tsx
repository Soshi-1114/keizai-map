import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KeizaiMap — 数字で見る、日本の30年",
  description: "賃金・物価・税収・為替の推移を政権帯とともに可視化する経済データダッシュボード",
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
