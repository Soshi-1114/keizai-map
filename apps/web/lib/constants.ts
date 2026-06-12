/** UI カラートークン */
export const COLORS = {
  PRIMARY: "#4F8EF7",
  PRIMARY_BG: "#4F8EF720",
  SUCCESS: "#22c55e",
  ERROR: "#ef4444",
  WARNING: "#D97706",
  TWITTER: "#1DA1F2",
} as const;

/** グラフ設定 */
export const CHART = {
  MOBILE_AXIS_WIDTH: 38,
  DESKTOP_AXIS_WIDTH: 55,
  MOBILE_HEIGHT: 260,
  DESKTOP_HEIGHT: 360,
  Y_LEFT_DOMAIN: [85, 140] as [number, number],
  Y_RIGHT_DOMAIN: [30, 170] as [number, number],
} as const;

/** データ年範囲 */
export const DATA_YEARS = {
  MIN: 1990,
  MAX: 2025,
} as const;
