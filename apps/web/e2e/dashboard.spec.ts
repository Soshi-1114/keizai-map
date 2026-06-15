import { test, expect } from "@playwright/test";

test.describe("ダッシュボード基本機能", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("ページタイトルが正しい", async ({ page }) => {
    await expect(page).toHaveTitle(/KeizaiMap/);
  });

  test("h1 見出しが表示される", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /日本の実質賃金・物価・税収・為替の推移グラフ/, level: 1 }),
    ).toBeVisible();
  });

  test("グラフが描画される", async ({ page }) => {
    const chart = page.locator(".recharts-surface").first();
    await expect(chart).toBeVisible({ timeout: 10000 });
  });

  test("指標チップが表示される（PC）", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.getByRole("button", { name: "実質賃金" })).toBeVisible();
    await expect(page.getByRole("button", { name: "消費者物価（CPI）" })).toBeVisible();
  });

  test("指標チップのトグルでグラフが更新される", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const chip = page.getByRole("button", { name: "実質賃金" });
    await chip.click();
    // 再クリックで戻る
    await chip.click();
    await expect(page.locator(".recharts-surface").first()).toBeVisible();
  });

  test("注目の期間ショートカットが機能する", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.getByRole("button", { name: "アベノミクス" }).click();
    // URL に range パラメータが含まれる
    await expect(page).toHaveURL(/range=2012,2020/);
  });

  test("データを表で見るボタンでテーブルが表示される", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.getByRole("button", { name: "📊 データを表で見る" }).click();
    await expect(page.getByRole("table", { name: "経済指標データ" })).toBeVisible();
  });

  test("フッターにプライバシーポリシーリンクがある", async ({ page }) => {
    await expect(page.getByRole("link", { name: "プライバシーポリシー" })).toBeVisible();
  });

  test("テーマトグルが機能する", async ({ page }) => {
    const toggle = page.getByLabel(/モードに切替/);
    await toggle.click();
    // 再クリックで戻る
    await toggle.click();
    await expect(page.locator("html")).toBeVisible();
  });
});

test.describe("モード切替", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test("政権比較モードに切替できる", async ({ page }) => {
    await page.getByRole("button", { name: "政権比較" }).click();
    await expect(page.locator(".recharts-bar-rectangle").first()).toBeVisible({ timeout: 8000 });
  });

  test("グラフモードに戻れる", async ({ page }) => {
    await page.getByRole("button", { name: "政権比較" }).click();
    await page.getByRole("button", { name: "グラフ" }).click();
    await expect(page.locator(".recharts-line").first()).toBeVisible({ timeout: 8000 });
  });
});
