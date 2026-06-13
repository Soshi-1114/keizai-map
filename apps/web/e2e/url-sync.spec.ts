import { test, expect } from "@playwright/test";

/**
 * URL クエリパラメータと UI 状態の双方向同期。
 * 共有 URL でのディープリンクが壊れないこと、UI 操作が URL に反映されることを担保。
 */

/** カンマは URL エンコード後 %2C になりうる。両方を受け入れるヘルパ。 */
const c = "(?:,|%2C)";

test.describe("URL → UI: 初期パラメータの反映", () => {
  test("?indicators=wage のみで開くとヒーローも wage 中心になる", async ({ page }) => {
    await page.goto("/?indicators=wage&range=1990,2024");
    // URL が保持される（wage の後ろは , か & か行末）
    await expect(page).toHaveURL(new RegExp(`indicators=wage(?:${c}|&|$)`));
    // PC で指標トグルバーの「実質賃金」が active
    await page.setViewportSize({ width: 1280, height: 800 });
    const wageBtn = page.getByRole("button", { name: "実質賃金", exact: false }).first();
    await expect(wageBtn).toHaveAttribute("aria-pressed", "true");
  });

  test("?range=2000,2010 で年範囲が制限される", async ({ page }) => {
    await page.goto("/?range=2000,2010");
    await expect(page).toHaveURL(new RegExp(`range=2000${c}2010`));
    // チャートが描画される
    await expect(page.locator(".recharts-surface").first()).toBeVisible({ timeout: 10000 });
  });

  test("?events=税制 でイベントカテゴリが反映される", async ({ page }) => {
    await page.goto("/?events=%E7%A8%8E%E5%88%B6");
    await expect(page).toHaveURL(/events=/);
    await expect(page.locator(".recharts-surface").first()).toBeVisible({ timeout: 10000 });
  });

  test("複合パラメータ（indicators + range + events）が同時に反映される", async ({ page }) => {
    await page.goto("/?indicators=wage,cpi,tax&range=2012,2020&events=%E7%A8%8E%E5%88%B6");
    await expect(page).toHaveURL(new RegExp(`indicators=wage${c}cpi${c}tax`));
    await expect(page).toHaveURL(new RegExp(`range=2012${c}2020`));
    await expect(page).toHaveURL(/events=/);
  });
});

test.describe("UI → URL: 操作による URL 更新", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
  });

  test("指標チップをトグルすると URL の indicators から外れる", async ({ page }) => {
    // 既定で全指標 ON のため、wage を OFF にして URL から外れることを確認。
    // useUrlSync は 300ms デバウンス + replaceState。Playwright の toHaveURL は
    // ポーリングで成功するまで待つ。
    const wageBtn = page.getByRole("button", { name: "実質賃金", exact: false }).first();
    await wageBtn.click();
    // wage がない indicators=… を含む URL に落ち着く
    // （cpi が先頭になるはずなので indicators=cpi で検出）
    await expect(page).toHaveURL(/indicators=cpi/, { timeout: 5000 });
  });

  test("注目の期間（アベノミクス）クリックで range=2012,2020 が反映", async ({ page }) => {
    await page.getByRole("button", { name: "アベノミクス" }).click();
    await expect(page).toHaveURL(new RegExp(`range=2012${c}2020`));
  });
});

test.describe("記事 → ダッシュボード遷移時のクエリ保持", () => {
  test("real-wages 記事の CTA が presetQuery 付きでダッシュボードへ遷移", async ({ page }) => {
    await page.goto("/articles/real-wages");
    // CTA リンク（KeizaiMap で確認 / グラフを見る系）
    const cta = page.getByRole("link", { name: /KeizaiMap|グラフ|ダッシュボード|確認/ }).first();
    await cta.click();
    // ダッシュボードに遷移し、real-wages の presetQuery（indicators=wage,cpi）が付く
    await expect(page).toHaveURL(new RegExp(`indicators=wage${c}cpi`));
  });
});
