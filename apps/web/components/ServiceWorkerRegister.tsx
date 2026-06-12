"use client";

import { useEffect } from "react";

/**
 * 本番環境でのみ Service Worker を登録。
 * 開発時は HMR と衝突するので無効化。
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const register = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch (err) {
        // SW 登録失敗は致命的ではない
        console.warn("SW register failed", err);
      }
    };
    register();
  }, []);

  return null;
}
