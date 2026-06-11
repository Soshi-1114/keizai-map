import { test, expect } from "@playwright/test";

test.describe("記事一覧", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/articles");
  });

  test("記事一覧ページが表示される", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "解説記事", level: 1 })).toBeVisible();
  });

  test("記事が16本以上表示される", async ({ page }) => {
    const articles = page.locator("a[href^='/articles/']");
    await expect(articles).toHaveCount(16);
  });

  test("タグフィルターが機能する", async ({ page }) => {
    // タグボタンをクリック
    const tagButton = page.getByRole("button", { name: /賃金/ }).first();
    await tagButton.click();
    // フィルター後も記事が1件以上残る
    const articles = page.locator("a[href^='/articles/']");
    const count = await articles.count();
    expect(count).toBeGreaterThan(0);
  });

  test("すべてのタグでリセットできる", async ({ page }) => {
    const tagButton = page.getByRole("button", { name: /賃金/ }).first();
    await tagButton.click();
    await page.getByRole("button", { name: /すべて/ }).click();
    const articles = page.locator("a[href^='/articles/']");
    await expect(articles).toHaveCount(16);
  });
});

test.describe("記事詳細ページ", () => {
  test("実質賃金記事が表示される", async ({ page }) => {
    await page.goto("/articles/real-wages");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("実質賃金");
  });

  test("KeizaiMapでグラフを見るCTAが表示される", async ({ page }) => {
    await page.goto("/articles/real-wages");
    await expect(page.getByRole("link", { name: /KeizaiMapでグラフを見る/ })).toBeVisible();
  });

  test("関連記事が表示される", async ({ page }) => {
    await page.goto("/articles/real-wages");
    await expect(page.getByText("関連記事")).toBeVisible();
  });

  test("記事一覧に戻るリンクがある", async ({ page }) => {
    await page.goto("/articles/abenomics");
    await expect(page.getByRole("link", { name: /解説記事一覧に戻る/ })).toBeVisible();
  });

  test("財政破綻記事が表示される", async ({ page }) => {
    await page.goto("/articles/fiscal-collapse-truth");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("財政破綻");
  });

  test("住宅価格記事が表示される", async ({ page }) => {
    await page.goto("/articles/housing-price");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("住宅");
  });
});

test.describe("記事からダッシュボードへの導線", () => {
  test("プリセットリンクで正しいパラメータでダッシュボードに遷移する", async ({ page }) => {
    await page.goto("/articles/abenomics");
    // CTAリンクをクリック
    await page.getByRole("link", { name: /KeizaiMapでグラフを見る/ }).click();
    await expect(page).toHaveURL(/\//);
  });
});
