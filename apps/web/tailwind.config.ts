import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      // 統一タイポスケール
      // micro (9px) は AdminBar の極小ラベルでのみ使う想定
      // tiny (11px) は脚注・補足テキスト用
      // それより大きいサイズは Tailwind 標準 xs(12), sm(14), base(16) を使う
      fontSize: {
        micro: ["9px", { lineHeight: "1.1" }],
        tiny: ["11px", { lineHeight: "1.4" }],
      },
    },
  },
  plugins: [],
};
export default config;
