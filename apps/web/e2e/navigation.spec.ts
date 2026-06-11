import { test, expect } from "@playwright/test";

test.describe("ページナビゲーション", () => {
  test("トップ → about ページ遷移", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "データソースについて" }).first().click();
    await expect(page).toHaveURL("/about");
    await expect(page.getByRole("heading", { name: "KeizaiMapについて", level: 1 })).toBeVisible();
  });

  test("about → トップへ戻る", async ({ page }) => {
    await page.goto("/about");
    await page.getByRole("link", { name: /KeizaiMap に戻る/ }).click();
    await expect(page).toHaveURL("/");
  });

  test("トップ → articles 遷移", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "解説記事" }).click();
    await expect(page).toHaveURL("/articles");
  });

  test("privacy ページが表示される", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { name: "プライバシーポリシー", level: 1 })).toBeVisible();
  });

  test("sitemap.xml が返る", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
    const content = await page.content();
    expect(content).toContain("keizai-map.vercel.app");
  });

  test("robots.txt が返る", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);
    const content = await page.content();
    expect(content).toContain("User-agent");
  });

  test("feed.xml が返る", async ({ page }) => {
    const response = await page.goto("/feed.xml");
    expect(response?.status()).toBe(200);
    const content = await page.content();
    expect(content).toContain("<rss");
  });
});

test.describe("URL クエリパラメータ", () => {
  test("indicators パラメータでグラフが初期化される", async ({ page }) => {
    await page.goto("/?indicators=wage,cpi&range=2012,2020");
    await expect(page).toHaveURL(/indicators=wage,cpi/);
    await expect(page.locator(".recharts-surface").first()).toBeVisible({ timeout: 10000 });
  });

  test("存在しない記事は 404 になる", async ({ page }) => {
    const response = await page.goto("/articles/nonexistent-article-xyz");
    expect(response?.status()).toBe(404);
  });
});
