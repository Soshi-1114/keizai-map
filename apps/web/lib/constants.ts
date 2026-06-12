/** サイトの正規オリジン（canonical / sitemap / OG / JSON-LD で共通使用） */
export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://keizaimap.jp";

/** UI カラートークン */
export const COLORS = {
  PRIMARY: "#4F8EF7",
  PRIMARY_BG: "#4F8EF720",
  SUCCESS: "#22c55e",
  ERROR: "#ef4444",
  WARNING: "#D97706",
  TWITTER: "#1DA1F2",
} as const;

/** グラフ設定 — 全指標を 1990=100 正規化指数で 1 軸統一表示 */
export const CHART = {
  MOBILE_AXIS_WIDTH: 42,
  DESKTOP_AXIS_WIDTH: 60,
  MOBILE_HEIGHT: 260,
  DESKTOP_HEIGHT: 360,
} as const;

/** データ年範囲 */
export const DATA_YEARS = {
  MIN: 1990,
  MAX: 2025,
} as const;
