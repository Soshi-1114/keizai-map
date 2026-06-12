import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

// 指標ラベル・色マップ（lib/data.ts に依存しない最小辞書 — edge runtime のため）
const INDICATORS: Record<string, { label: string; color: string; unit: string }> = {
  wage:      { label: "実質賃金",   color: "#4F8EF7", unit: "指数" },
  cpi:       { label: "消費者物価", color: "#D97706", unit: "指数" },
  tax:       { label: "税収",       color: "#9333EA", unit: "兆円" },
  fx:        { label: "USD/JPY",    color: "#4FD9A0", unit: "円" },
  nikkei:    { label: "日経平均",   color: "#8B5CF6", unit: "指数" },
  housing:   { label: "住宅価格",   color: "#EC4899", unit: "指数" },
  debt:      { label: "国債残高",   color: "#06B6D4", unit: "兆円" },
  births:    { label: "出生数",     color: "#F59E0B", unit: "万人" },
  insurance: { label: "社会保険料", color: "#10B981", unit: "%" },
};

// 2025 年確定値（OG はキャッシュ性重視のため軽量辞書を保持）
const LATEST_VALUES: Record<string, string> = {
  wage: "97.9", cpi: "123.7", tax: "80.7", fx: "149.7",
  nikkei: "196.1", housing: "68.8", debt: "1128.5", births: "70.6", insurance: "18.6",
};

const DEFAULT_INDICATORS = ["wage", "cpi", "tax", "fx"];

function parseIndicatorList(raw: string | null): string[] {
  if (!raw) return DEFAULT_INDICATORS;
  const list = raw.split(",").filter(k => INDICATORS[k]);
  return list.length > 0 ? list.slice(0, 4) : DEFAULT_INDICATORS;
}

function parseRangeTuple(raw: string | null): [number, number] | null {
  if (!raw) return null;
  const [s, e] = raw.split(",").map(Number);
  if (!isFinite(s) || !isFinite(e) || s >= e) return null;
  if (s < 1990 || e > 2025) return null;
  return [s, e];
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const keys = parseIndicatorList(searchParams.get("indicators"));
  const range = parseRangeTuple(searchParams.get("range"));

  const stats = keys.map(k => ({
    label: INDICATORS[k].label,
    color: INDICATORS[k].color,
    unit: INDICATORS[k].unit,
    value: LATEST_VALUES[k] ?? "—",
  }));

  const subtitle = range
    ? `${range[0]}〜${range[1]}年の経済指標を一画面で重ね見`
    : "賃金・物価・税収・為替の推移を政権帯とともに可視化";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#10121A",
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            background: "linear-gradient(to bottom, #4F8EF7, #4FD9A0)",
          }}
        />

        {/* Label */}
        <div style={{ fontSize: 16, color: "#4F8EF7", marginBottom: 20, letterSpacing: "0.2em", display: "flex" }}>
          JAPAN ECONOMIC INDICATORS
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 60,
            fontWeight: 800,
            color: "#E8EAF0",
            lineHeight: 1.15,
            marginBottom: 24,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>数字で見る、</span>
          <span>日本の30年</span>
        </div>

        {/* Subtitle (dynamic) */}
        <div style={{ fontSize: 22, color: "#6B7280", marginBottom: 48, display: "flex" }}>
          {subtitle}
        </div>

        {/* Stat cards (dynamic 1-4枚) */}
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", maxWidth: 1040 }}>
          {stats.map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                background: "#161921",
                border: `1px solid ${item.color}66`,
                borderRadius: 12,
                padding: "16px 24px",
                minWidth: 140,
              }}
            >
              <div style={{ fontSize: 13, color: item.color, display: "flex" }}>{item.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#E8EAF0", display: "flex", alignItems: "baseline", gap: 4 }}>
                {item.value}
                <span style={{ fontSize: 13, color: "#6B7280" }}>{item.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer URL */}
        <div style={{ position: "absolute", bottom: 40, right: 80, fontSize: 16, color: "#2E3245", display: "flex" }}>
          keizaimap.jp
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        // CDN で 24 時間キャッシュ、再検証可
        "Cache-Control": "public, immutable, max-age=86400, stale-while-revalidate=86400",
      },
    },
  );
}
