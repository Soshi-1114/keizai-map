import { test, expect } from "@playwright/test";

test.describe("モバイル表示", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("指標トグルバーが表示される", async ({ page }) => {
    // 「重ねて表示する指標」セクションが存在する
    await expect(page.getByRole("group", { name: "重ねて表示する指標" }).first()).toBeVisible();
  });

  test("フィルターボタンが表示される", async ({ page }) => {
    await expect(page.getByRole("button", { name: /フィルター/ })).toBeVisible();
  });

  test("フィルターボタンでボトムシートが開く", async ({ page }) => {
    await page.getByRole("button", { name: /^フィルター$/ }).click();
    await expect(page.getByRole("button", { name: "フィルターを閉じる" })).toBeVisible();
  });

  test("ボトムシートを閉じられる", async ({ page }) => {
    await page.getByRole("button", { name: /^フィルター$/ }).click();
    await page.getByRole("button", { name: "フィルターを閉じる" }).click();
    await expect(page.getByRole("button", { name: "フィルターを閉じる" })).not.toBeVisible();
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

  test("AdminBarに政権名が表示される（1990-2025）", async ({ page }) => {
    // 長期政権の名前のいくつかは aria-hidden span として描画されるため
    // テキストノードで包括的に確認する
    const adminBar = page.getByRole("group", { name: /政権の表示帯/ });
    await expect(adminBar).toBeVisible();
    // 長期政権の代表的な名前のうち少なくとも1つは見える（width > 6%の閾値を超える）
    const candidates = ["小泉", "安倍", "岸田", "民主"];
    const visibleCount = await Promise.all(
      candidates.map(async (name) =>
        adminBar.locator(`text=${name}`).first().isVisible().catch(() => false),
      ),
    ).then((arr) => arr.filter(Boolean).length);
    expect(visibleCount).toBeGreaterThan(0);
  });

  test("指標トグルの主要4指標が常に表示される", async ({ page }) => {
    const group = page.getByRole("group", { name: "重ねて表示する指標" }).first();
    await expect(group).toBeVisible();
    for (const label of ["実質賃金", "消費者物価（CPI）", "税収", "USD/JPY"]) {
      await expect(
        group.getByRole("button", { name: label }),
      ).toBeVisible();
    }
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
