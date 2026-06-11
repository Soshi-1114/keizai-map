import { test, expect } from "@playwright/test";

test.describe("モバイル表示", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("MobileIndicatorNav が表示される", async ({ page }) => {
    // モバイルナビの ‹ または › ボタンが存在する
    await expect(page.getByRole("button", { name: "前の指標" })).toBeVisible();
    await expect(page.getByRole("button", { name: "次の指標" })).toBeVisible();
  });

  test("指標を次へ切り替えられる", async ({ page }) => {
    await page.getByRole("button", { name: "次の指標" }).click();
    // グラフが再描画される
    await expect(page.locator(".recharts-surface").first()).toBeVisible();
  });

  test("フィルターボタンが表示される", async ({ page }) => {
    await expect(page.getByRole("button", { name: /フィルター/ })).toBeVisible();
  });

  test("フィルターボタンでボトムシートが開く", async ({ page }) => {
    await page.getByRole("button", { name: /フィルター/ }).click();
    await expect(page.getByRole("button", { name: "閉じる" })).toBeVisible();
  });

  test("ボトムシートを閉じられる", async ({ page }) => {
    await page.getByRole("button", { name: /フィルター/ }).click();
    await page.getByRole("button", { name: "閉じる" }).click();
    await expect(page.getByRole("button", { name: "閉じる" })).not.toBeVisible();
  });

  test("Xシェアボタンがフッターに表示される", async ({ page }) => {
    const shareBtn = page.getByRole("button", { name: "Xでシェア" });
    await expect(shareBtn).toBeVisible();
  });

  test("横スクロールが発生しない", async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(windowWidth + 2); // 2px の誤差許容
  });
});

test.describe("モバイル記事表示", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("記事一覧が正しく表示される", async ({ page }) => {
    await page.goto("/articles");
    await expect(page.getByRole("heading", { name: "解説記事", level: 1 })).toBeVisible();
    // 横スクロール確認
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(windowWidth + 2);
  });

  test("記事詳細が正しく表示される", async ({ page }) => {
    await page.goto("/articles/real-wages");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(windowWidth + 2);
  });
});
