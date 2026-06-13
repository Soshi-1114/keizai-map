import { test } from "@playwright/test";

// 各タブの「タブ + チャート上部」だけを切り出してUI改善を視認しやすくする
test.describe("SP UI improvements zoom (390px)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("zoom: 推移タブ - タブ + 指標セレクタ + チャート上部", async ({ page }) => {
    await page.locator("#chart-container").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: "test-results/sp-zoom-chart-tab.png",
      clip: { x: 0, y: 0, width: 390, height: 844 },
    });
  });

  test("zoom: 政権タブ - 凡例 + N/A表示", async ({ page }) => {
    await page.getByRole("tab", { name: /政権別の変化率/ }).click();
    await page.waitForTimeout(800);
    await page.locator("#chart-container").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: "test-results/sp-zoom-admin-tab.png",
      clip: { x: 0, y: 0, width: 390, height: 844 },
    });
  });

  test("zoom: ショックタブ - 自動Y軸", async ({ page }) => {
    await page.getByRole("tab", { name: /経済危機の影響/ }).click();
    await page.waitForTimeout(800);
    await page.locator("#chart-container").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: "test-results/sp-zoom-shock-tab.png",
      clip: { x: 0, y: 0, width: 390, height: 844 },
    });
  });

  test("zoom: もっと見る展開時", async ({ page }) => {
    await page.locator("#chart-container").scrollIntoViewIfNeeded();
    const moreBtn = page
      .getByRole("tabpanel")
      .getByRole("button", { name: /もっと見る/ });
    await moreBtn.click();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: "test-results/sp-zoom-more-expanded.png",
      clip: { x: 0, y: 0, width: 390, height: 844 },
    });
  });
});
