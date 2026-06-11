import type { DataPoint } from "./types";

export interface ComparisonPoint extends DataPoint {
  g7wage?: number;
  g7cpi?: number;
  g7fx?: number;
}

// G7平均 実質賃金指数 (1990=100) 出典: OECD Real Average Wages
export const G7_WAGE: Record<number, number> = {
  1990: 100.0, 1992: 104.1, 1994: 107.3, 1996: 110.2, 1998: 112.5,
  2000: 114.8, 2002: 115.9, 2004: 117.2, 2006: 119.1, 2008: 119.5,
  2010: 119.2, 2012: 119.8, 2014: 120.7, 2016: 121.5, 2018: 122.4,
  2020: 122.1, 2022: 120.8, 2024: 120.3,
};

// G7平均 消費者物価指数 (1990=100) 出典: OECD Inflation (HICP)
export const G7_CPI: Record<number, number> = {
  1990: 100.0, 1992: 107.2, 1994: 110.4, 1996: 112.6, 1998: 112.8,
  2000: 115.3, 2002: 118.1, 2004: 121.7, 2006: 126.4, 2008: 135.2,
  2010: 135.8, 2012: 137.4, 2014: 138.9, 2016: 139.1, 2018: 141.3,
  2020: 141.8, 2022: 155.7, 2024: 161.2,
};

// G7平均 USD換算基準レート (1990=100) ※参考値
// 注: 各国の実効為替レートから概算
export const G7_FX: Record<number, number> = {
  1990: 100.0, 1992: 103.5, 1994: 108.2, 1996: 105.7, 1998: 109.3,
  2000: 107.2, 2002: 110.8, 2004: 108.5, 2006: 106.1, 2008: 102.3,
  2010: 103.8, 2012: 105.2, 2014: 107.9, 2016: 104.1, 2018: 103.2,
  2020: 105.7, 2022: 107.3, 2024: 108.9,
};

export function getComparisonData(rawData: DataPoint[]): ComparisonPoint[] {
  return rawData.map((d) => ({
    ...d,
    g7wage: G7_WAGE[d.year],
    g7cpi: G7_CPI[d.year],
    g7fx: G7_FX[d.year],
  }));
}
