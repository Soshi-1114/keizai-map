import { test, expect } from "@playwright/test";

/**
 * fix/data-consistency で導入した「数値整合性ガード」をブラウザレンダリング
 * 経由で検証する。lib/consistency.test.ts はソースコード grep だが、こちらは
 * 実 HTML を読むので SSR/水和まで含めた regression を捕まえる。
 */

test.describe("数値整合性: ダッシュボード（FAQ・About本文・ヒーロー）", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // SSR レンダリング完了を待つ（FAQ や About 本文は server component なので即時）
    await page.waitForLoadState("domcontentloaded");
  });

  test("ヒーローの説明文が data.generated.json 由来になっている", async ({ page }) => {
    const hero = page.locator('section[aria-label="ファーストビューの解説"]');
    await expect(hero).toBeVisible();
    // "1990年=100で見る、日本の{span}年" を表示
    await expect(hero).toContainText(/1990年=100で見る、日本の\d+年/);
    // 主要3指標の文章: 実質賃金は…、税収は…、社会保険料は…
    await expect(hero).toContainText("実質賃金は");
    await expect(hero).toContainText("税収は");
    await expect(hero).toContainText("社会保険料は");
  });

  test("FAQ の指数化説明に誤記「+125%」「2.3倍」が含まれない", async ({ page }) => {
    const faq = page.locator('section[aria-labelledby="faq-keizaimap"]');
    await expect(faq).toBeVisible();
    const faqText = await faq.textContent();
    expect(faqText).not.toContain("+125%");
    expect(faqText).not.toContain("2.3倍");
  });

  test("FAQ の指数化説明に税収の正値（+34%）が含まれる", async ({ page }) => {
    const faq = page.locator('section[aria-labelledby="faq-keizaimap"]');
    // 「税収は+34.3%」のように derived 値が埋め込まれる
    await expect(faq).toContainText(/税収は\+3[0-9]\.\d%/);
  });

  test("About 本文（KeizaiMapとは）が data 由来の数値を表示", async ({ page }) => {
    const about = page.locator('section[aria-labelledby="about-keizaimap"]');
    await expect(about).toBeVisible();
    // 税収 1.3倍 のような ratio 表現
    await expect(about).toContainText(/税収は1\.\d倍/);
    // 社会保険料 10.8% → 18.X%
    await expect(about).toContainText(/10\.8%→1\d\.\d%へ上昇/);
    // 誤記が残っていないこと
    const text = await about.textContent();
    expect(text).not.toContain("約2.3倍");
  });
});

test.describe("数値整合性: About ページ（確定値定義・訂正ログ）", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about");
  });

  test("データ範囲注記が動的な最新年を反映", async ({ page }) => {
    // "※ 1990〜2025年の年次データを掲載しています" (latestYear=2025)
    // 旧 stale 表記「1990〜2024年の」は含まれないこと
    const body = page.locator("main");
    await expect(body).toContainText(/1990〜20\d\d年の.*年次.*データを掲載/);
    expect(await body.textContent()).not.toContain("1990〜2024年の年次データを掲載");
  });

  test("『📐 確定値の定義』段落が表示される", async ({ page }) => {
    await expect(page.getByText("📐 確定値の定義")).toBeVisible();
    // 段落内に「直近確定値」または「最新確定値」のような語が出る
    const section = page.locator("text=📐 確定値の定義").locator("..").locator("..");
    await expect(section).toContainText(/確定値/);
  });

  test("更新ログに『訂正』エントリが表示される", async ({ page }) => {
    // 訂正バッジ + 「派生統計モジュール」または「誤記」のテキスト
    const correction = page.locator('span', { hasText: "訂正" }).first();
    await expect(correction).toBeVisible();
    await expect(page.locator("main")).toContainText(/派生統計モジュール|誤記/);
  });

  test("更新ログに『データ拡張』エントリ（2025年確定値反映）が表示される", async ({ page }) => {
    const expansion = page.locator('span', { hasText: "データ拡張" }).first();
    await expect(expansion).toBeVisible();
    await expect(page.locator("main")).toContainText(/20\d\d年まで拡張/);
  });
});
