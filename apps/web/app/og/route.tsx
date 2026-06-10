import { ImageResponse } from "next/og";

export const runtime = "edge";
// Route Handler のため動的生成は自動的に適用される

const STATS = [
  { label: "実質賃金", value: "99.2", unit: "指数", color: "#4F8EF7" },
  { label: "消費者物価", value: "128.1", unit: "指数", color: "#F7C94F" },
  { label: "税収", value: "72.1兆", unit: "円", color: "#E05C5C" },
  { label: "USD/JPY", value: "151.8", unit: "円", color: "#4FD9A0" },
];

export async function GET() {
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

        {/* Subtitle */}
        <div style={{ fontSize: 22, color: "#6B7280", marginBottom: 48, display: "flex" }}>
          賃金・物価・税収・為替の推移を政権帯とともに可視化
        </div>

        {/* Stat cards */}
        <div style={{ display: "flex", gap: 36 }}>
          {STATS.map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                background: "#161921",
                border: "1px solid #2E3245",
                borderRadius: 12,
                padding: "16px 24px",
              }}
            >
              <div style={{ fontSize: 13, color: item.color, display: "flex" }}>{item.label}</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#E8EAF0", display: "flex", alignItems: "baseline", gap: 4 }}>
                {item.value}
                <span style={{ fontSize: 13, color: "#6B7280" }}>{item.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer URL */}
        <div style={{ position: "absolute", bottom: 40, right: 80, fontSize: 16, color: "#2E3245", display: "flex" }}>
          keizai-map.vercel.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
