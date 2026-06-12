"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body
        style={{
          margin: 0,
          padding: 24,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F7F8FC",
          color: "#1A1D2E",
          fontFamily: "'Hiragino Sans', 'Noto Sans JP', Arial, sans-serif",
        }}
      >
        <div
          role="alert"
          style={{
            maxWidth: 480,
            width: "100%",
            backgroundColor: "#fff",
            border: "1px solid #E1E4EF",
            borderRadius: 12,
            padding: 24,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 32, margin: 0 }}>⚠️</p>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: "12px 0" }}>
            アプリケーションエラー
          </h1>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 16px" }}>
            予期しないエラーが発生しました。ページを再読み込みしてください。
          </p>
          {error.digest && (
            <p style={{ fontSize: 11, color: "#6B7280", fontFamily: "monospace" }}>
              エラーID: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              marginTop: 8,
              padding: "8px 20px",
              fontSize: 14,
              backgroundColor: "#1d4ed8",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            再読み込み
          </button>
        </div>
      </body>
    </html>
  );
}
