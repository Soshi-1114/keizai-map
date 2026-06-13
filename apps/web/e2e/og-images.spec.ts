import { test, expect } from "@playwright/test";

/**
 * OG 画像エンドポイント。/og（ダッシュボード用）と /og/article?slug=…
 * （記事個別用）が実際に PNG を返すことを実 HTTP で検証する。
 * SNS シェアプレビューの正常性は本サービスの集客導線の核なので、
 * デフォルト OG が壊れていないことは CI で必ず担保する。
 */

test.describe("OG 画像エンドポイント", () => {
  test("/og が PNG 画像を返す", async ({ request }) => {
    const res = await request.get("/og");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toMatch(/^image\/png/);
    // 画像は 5KB 以上はあるはず（フォントなしフォールバックでも）
    const buf = await res.body();
    expect(buf.byteLength).toBeGreaterThan(5_000);
  });

  test("/og は CDN キャッシュヘッダを返す", async ({ request }) => {
    const res = await request.get("/og");
    const cc = res.headers()["cache-control"] ?? "";
    expect(cc).toMatch(/public/);
    expect(cc).toMatch(/max-age=/);
  });

  test("/og?indicators=wage,cpi,tax,fx は 200 を返す（カスタム指標）", async ({ request }) => {
    const res = await request.get("/og?indicators=wage,cpi,tax,fx");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toMatch(/^image\/png/);
  });

  test("/og?indicators=invalid は 200（既定指標にフォールバック）", async ({ request }) => {
    const res = await request.get("/og?indicators=invalid");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toMatch(/^image\/png/);
  });

  test("/og/article?slug=real-wages が PNG 画像を返す", async ({ request }) => {
    const res = await request.get("/og/article?slug=real-wages");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toMatch(/^image\/png/);
    const buf = await res.body();
    expect(buf.byteLength).toBeGreaterThan(5_000);
  });

  test("/og/article?slug=unknown は 404 を返す（未知 slug への Edge 計算誘発を防止）", async ({ request }) => {
    const res = await request.get("/og/article?slug=zzz-no-such-slug");
    expect(res.status()).toBe(404);
  });
});

test.describe("OG 画像メタタグ", () => {
  test("トップページ: og:image が /og 系 URL を指す", async ({ page }) => {
    await page.goto("/");
    const og = await page.locator('meta[property="og:image"]').first().getAttribute("content");
    expect(og).toBeTruthy();
    expect(og).toMatch(/\/og(\?|$|\/)/);
  });

  test("記事ページ: og:image が /og/article?slug=… を指す", async ({ page }) => {
    await page.goto("/articles/real-wages");
    const og = await page.locator('meta[property="og:image"]').first().getAttribute("content");
    expect(og).toContain("/og/article");
    expect(og).toContain("slug=real-wages");
  });

  test("記事ページ: og:type=article、og:title が記事タイトルと一致", async ({ page }) => {
    await page.goto("/articles/real-wages");
    const type = await page.locator('meta[property="og:type"]').getAttribute("content");
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
    expect(type).toBe("article");
    expect(ogTitle).toContain("実質賃金とは？");
  });
});
