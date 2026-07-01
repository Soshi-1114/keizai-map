import type { Metadata } from "next";
import Script from "next/script";
import { IBM_Plex_Sans_JP, IBM_Plex_Mono, Shippori_Mincho } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { BASE_URL } from "@/lib/constants";

// 本文・UI: IBM Plex Sans JP（やや技術的で官製文書に通じる骨格）。CSS 変数 --font-sans
const plexSansJP = IBM_Plex_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
  preload: true,
});

// 見出し・元号: しっぽり明朝（統計年鑑の格式）。CSS 変数 --font-shippori → --font-display
const shippori = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
  variable: "--font-shippori",
  preload: false,
});

// データ・年号: IBM Plex Mono（数表の等幅）。CSS 変数 --font-plex-mono → --font-mono
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-plex-mono",
  preload: false,
});

const GA_ID = "G-L3881RG05D";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "実質賃金・物価・税収の推移グラフ｜日本経済35年を可視化 - KeizaiMap",
    template: "%s | KeizaiMap",
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": `${BASE_URL}/feed.xml`,
    },
  },
  description:
    "賃金・物価・税収・為替の推移を政権帯とともに一画面で可視化。なぜ生活が苦しくなったのかを数字で見る経済データダッシュボード。",
  verification: {
    google: "uylZUDo5JlY7OWcqFZwpnbS1dR5_J_9rWQCKwuwW9to",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KeizaiMap",
  },
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
    <html
      lang="ja"
      suppressHydrationWarning
      className={`${plexSansJP.variable} ${shippori.variable} ${plexMono.variable}`}
    >
      <head>
        <meta name="theme-color" content="#14151D" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased">
        <a href="#main" className="skip-link">
          メインコンテンツへスキップ
        </a>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        <ThemeProvider>{children}</ThemeProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
