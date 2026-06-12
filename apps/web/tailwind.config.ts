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
      // tiny (11px) は脚注・補足テキスト用。9px の micro は可読性に難があり削除
      // それより大きいサイズは Tailwind 標準 xs(12), sm(14), base(16) を使う
      fontSize: {
        tiny: ["11px", { lineHeight: "1.4" }],
      },
    },
  },
  plugins: [],
};
export default config;
