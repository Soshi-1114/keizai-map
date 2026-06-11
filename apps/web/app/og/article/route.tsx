import { ImageResponse } from "next/og";
import { ARTICLES } from "@/lib/articles";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") ?? "";

  const article = ARTICLES.find((a) => a.slug === slug);
  const title = article?.title ?? "KeizaiMap 解説記事";
  const tags = article?.tags ?? [];

  const TAG_COLORS: Record<string, string> = {
    "賃金": "#4F8EF7", "実質賃金": "#4F8EF7", "手取り": "#4F8EF7",
    "物価": "#D97706", "消費税": "#D97706",
    "税収": "#E05C5C",
    "為替": "#4FD9A0", "円安": "#4FD9A0",
    "日経平均": "#8B5CF6", "株高": "#8B5CF6",
    "住宅価格": "#EC4899", "不動産": "#EC4899",
    "国債": "#06B6D4", "財政赤字": "#06B6D4", "財政破綻": "#06B6D4",
    "少子化": "#F59E0B", "出生数": "#F59E0B",
    "社会保険料": "#10B981",
    "格差": "#8B5CF6",
  };

  const accentColor = tags.map((t) => TAG_COLORS[t]).find(Boolean) ?? "#4F8EF7";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#10121A",
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 72px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Left accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            background: `linear-gradient(to bottom, ${accentColor}, ${accentColor}88)`,
          }}
        />

        {/* Top: site name */}
        <div style={{ fontSize: 18, color: accentColor, letterSpacing: "0.15em", display: "flex" }}>
          KEIZAIMAP
        </div>

        {/* Middle: title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, flex: 1, justifyContent: "center" }}>
          <div
            style={{
              fontSize: title.length > 28 ? 38 : 46,
              fontWeight: 800,
              color: "#E8EAF0",
              lineHeight: 1.4,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {title}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div style={{ display: "flex", gap: 12 }}>
              {tags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    fontSize: 16,
                    color: TAG_COLORS[tag] ?? "#6B7280",
                    background: `${TAG_COLORS[tag] ?? "#6B7280"}22`,
                    border: `1px solid ${TAG_COLORS[tag] ?? "#6B7280"}66`,
                    borderRadius: 20,
                    padding: "4px 14px",
                    display: "flex",
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom: URL */}
        <div style={{ fontSize: 16, color: "#3E4563", display: "flex" }}>
          keizai-map.vercel.app/articles
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
