import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 192,
          height: 192,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          borderRadius: 44,
        }}
      >
        <svg width="136" height="136" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <line x1="4" y1="27" x2="28" y2="27" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
          <polyline
            points="4,22 9,16 14,19 20,11 27,7"
            fill="none"
            stroke="#4F8EF7"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="27" cy="7" r="2" fill="#60b4ff" />
        </svg>
      </div>
    ),
    { width: 192, height: 192 }
  );
}
