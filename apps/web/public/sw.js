/* KeizaiMap Service Worker — minimal app-shell + offline fallback */

const VERSION = "v1";
const APP_SHELL_CACHE = `keizaimap-shell-${VERSION}`;
const RUNTIME_CACHE = `keizaimap-runtime-${VERSION}`;

const SHELL_ASSETS = [
  "/",
  "/offline",
  "/manifest.json",
  "/icon.svg",
];

// インストール時にシェルをプリキャッシュ
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS)).then(() => self.skipWaiting()),
  );
});

// 古いキャッシュを削除
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== APP_SHELL_CACHE && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k)),
      ),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // 別オリジン (GA, fonts, etc.) はキャッシュしない
  if (url.origin !== self.location.origin) return;

  // HTML ナビゲーションはネットワーク優先、失敗時はキャッシュ→/offline
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then((cached) => cached || caches.match("/offline")),
        ),
    );
    return;
  }

  // 静的アセット (script/style/image/font) はキャッシュファースト
  const dest = req.destination;
  if (["script", "style", "image", "font"].includes(dest)) {
    event.respondWith(
      caches.match(req).then(
        (cached) =>
          cached ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(req, copy));
            return res;
          }),
      ),
    );
  }
});
