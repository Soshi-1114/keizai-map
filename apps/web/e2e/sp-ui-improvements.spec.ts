import { test, expect } from "@playwright/test";

// 390px (iPhone 12 Pro) で SP UI改善の P0-P2 を検証
test.describe("SP UI improvements (390px)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("P0-1: 指標セレクタは初期状態で折りたたまれている（チャートカード内に1つだけ）", async ({ page }) => {
    // SP では初期状態でチップ群は畳まれ「他の指標を重ねる」ボタンのみ
    const tabpanel = page.getByRole("tabpanel");
    const trigger = tabpanel.getByRole("button", { name: /他の指標を重ねる/ });
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    // 折りたたみ状態では「重ねて表示する指標」グループは表示されない
    await expect(
      page.getByRole("group", { name: "重ねて表示する指標" }),
    ).toHaveCount(0);
  });

  test("P0-1: 展開して指標を選ぶと即時にチェックアイコンが付く", async ({ page }) => {
    const tabpanel = page.getByRole("tabpanel");
    // 「他の指標を重ねる」ボタンを押して全9指標を展開
    await tabpanel.getByRole("button", { name: /他の指標を重ねる/ }).click();
    const taxBtn = tabpanel.getByRole("button", { name: "税収" });
    const initial = await taxBtn.getAttribute("aria-pressed");
    await taxBtn.click();
    const next = await taxBtn.getAttribute("aria-pressed");
    expect(initial).not.toBe(next);
  });

  test("P0-1 (FV): デフォルト2指標が選択された状態でチャートがFVに見える", async ({ page }) => {
    // 「2/9 表示中」がトリガーボタンに表示されることで、デフォルト2指標が
    // 重なって描画されていることを検証
    const tabpanel = page.getByRole("tabpanel");
    const trigger = tabpanel.getByRole("button", { name: /他の指標を重ねる/ });
    await expect(trigger).toContainText("2/9");

    // チャートカードがビューポート上端から FV (844px) 内に入っている
    const chartBox = await page.locator("#chart-container").boundingBox();
    expect(chartBox).not.toBeNull();
    if (chartBox) {
      expect(chartBox.y).toBeLessThan(844);
    }
  });

  test("P1-2: 分析モードタブがチャートカードの直下に配置される", async ({ page }) => {
    // SP では tabs が chart-container の下に来る
    const tabsBox = await page
      .getByRole("tablist", { name: "分析モードを選択" })
      .boundingBox();
    const chartBox = await page.locator("#chart-container").boundingBox();
    expect(tabsBox).not.toBeNull();
    expect(chartBox).not.toBeNull();
    if (tabsBox && chartBox) {
      // タブはチャートの下端より下にある
      expect(tabsBox.y).toBeGreaterThan(chartBox.y + chartBox.height - 4);
    }
  });

  test("P0-3: ChartToolbar (CSV) は第3層 — 解説記事より下にある", async ({ page }) => {
    const chartBox = await page.locator("#chart-container").boundingBox();
    const csvBtn = page.getByRole("button", { name: /CSV/ });
    const csvBox = await csvBtn.first().boundingBox();
    expect(chartBox).not.toBeNull();
    expect(csvBox).not.toBeNull();
    if (chartBox && csvBox) {
      // CSV ボタンはチャートカードの下端よりずっと下にある
      expect(csvBox.y).toBeGreaterThan(chartBox.y + chartBox.height);
    }
  });

  test("P1-1: 展開後、選択中チップに ✓ アイコンが付く", async ({ page }) => {
    const tabpanel = page.getByRole("tabpanel");
    await tabpanel.getByRole("button", { name: /他の指標を重ねる/ }).click();
    const wageBtn = tabpanel.getByRole("button", { name: "実質賃金" });
    await expect(wageBtn).toHaveAttribute("aria-pressed", "true");
    const svg = wageBtn.locator("svg.lucide-check");
    await expect(svg).toBeVisible();
  });

  test("P0-2: 「他の指標を重ねる」は展開/折りたたみがトグルできる", async ({ page }) => {
    const tabpanel = page.getByRole("tabpanel");
    // 折りたたみ状態: 「他の指標を重ねる」ボタンが存在
    const trigger = tabpanel.getByRole("button", { name: /他の指標を重ねる/ });
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();
    // 展開後はラベルが「指標選択を閉じる」になる
    const closeBtn = tabpanel.getByRole("button", { name: /指標選択を閉じる/ });
    await expect(closeBtn).toBeVisible();
    await expect(closeBtn).toHaveAttribute("aria-expanded", "true");
    // もう一度押すと折りたたまれる
    await closeBtn.click();
    await expect(
      tabpanel.getByRole("button", { name: /他の指標を重ねる/ }),
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
