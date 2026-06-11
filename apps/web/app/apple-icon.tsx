import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          borderRadius: 40,
        }}
      >
        <svg
          width="130"
          height="130"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
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
    { ...size }
  );
}
