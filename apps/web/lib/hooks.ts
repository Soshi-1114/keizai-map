"use client";

import { useSyncExternalStore } from "react";

/**
 * matchMedia ベースのレスポンシブフック。
 * `useSyncExternalStore` を使うことで:
 *  - 複数コンポーネントで同じ media query を使っても matchMedia は OS が共有管理
 *  - SSR は常に false を返し、ハイドレーション後に正しい値へ更新される
 *  - resize ではなく matchMedia の change イベントを使うため再レンダが最小化される
 */
const subscribeFor = (query: string) => (cb: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia(query);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
};

const snapshotFor = (query: string) => () =>
  typeof window === "undefined" ? false : window.matchMedia(query).matches;

const serverSnapshot = () => false;

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(subscribeFor(query), snapshotFor(query), serverSnapshot);
}

/** 768px 未満をモバイルと判定 */
export function useIsMobile(breakpoint = 768): boolean {
  return useMediaQuery(`(max-width: ${breakpoint - 1}px)`);
}
