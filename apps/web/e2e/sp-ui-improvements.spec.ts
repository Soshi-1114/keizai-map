import { test, expect } from "@playwright/test";

// 390px (iPhone 12 Pro) で SP UI改善の P0-P2 を検証
test.describe("SP UI improvements (390px)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("P0-1: 指標セレクタは1箇所だけ（チャートカード内）", async ({ page }) => {
    // ページ上部の IndicatorToggleBar は SP では出さない (重複防止)
    // 「重ねて表示する指標」グループはチャートカード内に1つだけ存在
    const groups = page.getByRole("group", { name: "重ねて表示する指標" });
    await expect(groups).toHaveCount(1);

    // そのグループがチャートカード (tabpanel) の子孫であることを確認
    const groupInChart = page
      .getByRole("tabpanel")
      .getByRole("group", { name: "重ねて表示する指標" });
    await expect(groupInChart).toBeVisible();
  });

  test("P0-1: 指標を選ぶと即時にチェックアイコンが付く", async ({ page }) => {
    // tax (税収) を選択して aria-pressed=true になることを確認
    const taxBtn = page
      .getByRole("tabpanel")
      .getByRole("button", { name: "税収" });
    const initial = await taxBtn.getAttribute("aria-pressed");
    await taxBtn.click();
    const next = await taxBtn.getAttribute("aria-pressed");
    expect(initial).not.toBe(next);
  });

  test("P0-2: タブとグラフの距離 - チャートカードがタブ直下に来る", async ({ page }) => {
    // ViewModeTabs の bottom と chart-container の top が近い (1スクロール以内)
    const tabsBox = await page
      .getByRole("tablist", { name: "分析モードを選択" })
      .boundingBox();
    const chartBox = await page.locator("#chart-container").boundingBox();
    expect(tabsBox).not.toBeNull();
    expect(chartBox).not.toBeNull();
    if (tabsBox && chartBox) {
      // タブ下端からチャート上端までの距離
      const gap = chartBox.y - (tabsBox.y + tabsBox.height);
      // タブ説明文(1行)分の余白程度に収まるはず — 100px以下
      expect(gap).toBeLessThan(100);
    }
  });

  test("P0-2: ChartToolbar はチャートカードの後ろにある", async ({ page }) => {
    const chartBox = await page.locator("#chart-container").boundingBox();
    const csvBtn = page.getByRole("button", { name: /CSV/ });
    const csvBox = await csvBtn.first().boundingBox();
    expect(chartBox).not.toBeNull();
    expect(csvBox).not.toBeNull();
    if (chartBox && csvBox) {
      // CSV ボタンはチャートカードの下端より下にある
      expect(csvBox.y).toBeGreaterThan(chartBox.y + chartBox.height - 4);
    }
  });

  test("P1-1: 選択中チップに ✓ アイコンが付く", async ({ page }) => {
    // 「実質賃金」はデフォルト選択なのでチェックアイコンが見える
    const wageBtn = page
      .getByRole("tabpanel")
      .getByRole("button", { name: "実質賃金" });
    await expect(wageBtn).toHaveAttribute("aria-pressed", "true");
    // lucide-react の Check は <svg class="lucide-check">
    const svg = wageBtn.locator("svg.lucide-check");
    await expect(svg).toBeVisible();
  });

  test("P2-1: もっと見るは展開/折りたたみがトグルできる", async ({ page }) => {
    const tabpanel = page.getByRole("tabpanel");
    // 折りたたみ状態: 「もっと見る」ボタンが存在
    const moreBtn = tabpanel.getByRole("button", { name: /もっと見る/ });
    await expect(moreBtn).toBeVisible();
    await expect(moreBtn).toHaveAttribute("aria-expanded", "false");
    await moreBtn.click();
    // 展開後はラベルが「閉じる」になる
    const closeBtn = tabpanel.getByRole("button", { name: /閉じる/ });
    await expect(closeBtn).toBeVisible();
    await expect(closeBtn).toHaveAttribute("aria-expanded", "true");
    // もう一度押すと折りたたまれる
    await closeBtn.click();
    await expect(
      tabpanel.getByRole("button", { name: /もっと見る/ }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  test("P2-2: フィルターモーダルのプリセットに期間が併記される", async ({ page }) => {
    // フィルター開く (accessible name は 'フィルター 表示期間: ...年 ›' )
    await page
      .getByRole("button", { name: /フィルター 表示期間/ })
      .click();
    // 「バブル崩壊（1990〜1998年）」aria-label
    const bubble = page.getByRole("button", {
      name: /バブル崩壊（1990〜1998年）/,
    });
    await expect(bubble).toBeVisible();
    // 期間サブテキストもチップ内に存在
    await expect(bubble).toContainText("'90");
    await expect(bubble).toContainText("'98");
  });

  test("P1-3: ショックタブのY軸 - 100基準線が見える", async ({ page }) => {
    // ショックタブへ
    await page.getByRole("tab", { name: /経済危機の影響/ }).click();
    // 範囲を広げないとショックが表示されないので、フィルターで全期間に
    // (デフォルトは初期 range なので、ショックは普通に表示される想定)
    const tabpanel = page.getByRole("tabpanel");
    await expect(tabpanel).toBeVisible();
    // 「100」基準線のラベルが存在
    await expect(tabpanel.getByText(/^100$/).first()).toBeVisible();
  });

  test("P1-2: 政権タブでチャートが表示される", async ({ page }) => {
    await page.getByRole("tab", { name: /政権別の変化率/ }).click();
    const tabpanel = page.getByRole("tabpanel");
    await expect(tabpanel).toBeVisible();
    // 凡例 (Legend) 経由でindicator名が見える
    await expect(tabpanel.getByText("実質賃金").first()).toBeVisible();
  });

  // 各タブのスクリーンショットを撮って目視確認用に保存
  test("screenshot: 推移タブ全景", async ({ page }) => {
    await page.screenshot({
      path: "test-results/sp-390-chart.png",
      fullPage: true,
    });
  });

  test("screenshot: 政権タブ", async ({ page }) => {
    await page.getByRole("tab", { name: /政権別の変化率/ }).click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: "test-results/sp-390-admin.png",
      fullPage: true,
    });
  });

  test("screenshot: ショックタブ", async ({ page }) => {
    await page.getByRole("tab", { name: /経済危機の影響/ }).click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: "test-results/sp-390-shock.png",
      fullPage: true,
    });
  });

  test("screenshot: フィルターシート", async ({ page }) => {
    await page
      .getByRole("button", { name: /フィルター 表示期間/ })
      .click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: "test-results/sp-390-filter-sheet.png",
      fullPage: false,
    });
  });
});
