"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 本番では監視サービスへ送りたいが、現状は console
    console.error("KeizaiMap error boundary:", error);
  }, [error]);

  return (
    <main
      role="alert"
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="max-w-md w-full rounded-xl border p-6 text-center space-y-4"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
        <p className="text-3xl" aria-hidden>⚠️</p>
        <h1 className="text-lg font-bold">予期しないエラーが発生しました</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          ページの表示中に問題が発生しました。ネットワーク状況をご確認のうえ、
          もう一度お試しください。
        </p>
        {error.digest && (
          <p className="text-xs font-mono" style={{ color: "var(--muted)" }}>
            エラーID: {error.digest}
          </p>
        )}
        <div className="flex gap-2 justify-center pt-2">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            style={{ backgroundColor: "var(--accent-btn)", color: "#fff" }}
          >
            再試行
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg text-sm font-medium border transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            トップへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
