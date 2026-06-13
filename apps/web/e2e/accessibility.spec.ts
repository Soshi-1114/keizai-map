import { test, expect } from "@playwright/test";

/**
 * アクセシビリティ・構造化データの最低保証ライン。
 * 大規模な axe ベースの監査ではなく「壊したら絶対に気付くべき」項目を厳選。
 */

test.describe("各ページに <main id='main'> と h1 がある", () => {
  const pages = ["/", "/articles", "/about", "/privacy", "/contact"];
  for (const path of pages) {
    test(`${path}: main#main と h1`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("main#main")).toBeVisible();
      await expect(page.locator("h1").first()).toBeVisible();
    });
  }
});

test.describe("構造化データ（JSON-LD）", () => {
  test("トップページ: WebSite/Organization/FAQPage を含む", async ({ page }) => {
    await page.goto("/");
    const types = await page.locator('script[type="application/ld+json"]').evaluateAll(
      (els) => els.map((el) => {
        try {
          return JSON.parse(el.textContent || "{}")["@type"];
        } catch {
          return null;
        }
      }),
    );
    // FAQPage は AboutAndFAQ から、Organization/Person/WebSite は about/page から
    expect(types).toContain("FAQPage");
  });

  test("About ページ: Organization / Person / WebSite / BreadcrumbList を含む", async ({ page }) => {
    await page.goto("/about");
    const types = await page.locator('script[type="application/ld+json"]').evaluateAll(
      (els) => els.map((el) => {
        try {
          return JSON.parse(el.textContent || "{}")["@type"];
        } catch {
          return null;
        }
      }),
    );
    expect(types).toContain("Organization");
    expect(types).toContain("Person");
    expect(types).toContain("WebSite");
    expect(types).toContain("BreadcrumbList");
  });

  test("記事ページ: Article + BreadcrumbList + FAQPage を含む", async ({ page }) => {
    await page.goto("/articles/real-wages");
    const types = await page.locator('script[type="application/ld+json"]').evaluateAll(
      (els) => els.map((el) => {
        try {
          return JSON.parse(el.textContent || "{}")["@type"];
        } catch {
          return null;
        }
      }),
    );
    expect(types).toContain("Article");
    expect(types).toContain("BreadcrumbList");
    expect(types).toContain("FAQPage");
  });

  test("記事の Article JSON-LD の headline がページ h1 と一致", async ({ page }) => {
    await page.goto("/articles/real-wages");
    const articleJson = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((els) =>
        els
          .map((el) => {
            try {
              return JSON.parse(el.textContent || "{}");
            } catch {
              return null;
            }
          })
          .find((j) => j?.["@type"] === "Article"),
      );
    expect(articleJson).toBeTruthy();
    const h1 = await page.locator("h1").first().textContent();
    expect(articleJson.headline).toBe(h1?.trim());
  });
});

test.describe("canonical URL", () => {
  const pages = [
    { path: "/", canonical: "https://keizaimap.jp/" },
    { path: "/about", canonical: "https://keizaimap.jp/about" },
    { path: "/articles/real-wages", canonical: "https://keizaimap.jp/articles/real-wages" },
  ];
  for (const { path, canonical } of pages) {
    test(`${path}: <link rel=canonical> が ${canonical}`, async ({ page }) => {
      await page.goto(path);
      const href = await page.locator('link[rel="canonical"]').getAttribute("href");
      // metadataBase + alternates.canonical の絶対 URL（末尾スラッシュ揺れは許容）
      expect(href?.replace(/\/$/, "")).toBe(canonical.replace(/\/$/, ""));
    });
  }
});

test.describe("ARIA 基本", () => {
  test("ダッシュボード: tablist と tabpanel が紐付く", async ({ page }) => {
    await page.goto("/");
    const tablist = page.getByRole("tablist", { name: /分析モード/ });
    await expect(tablist).toBeVisible();
    // tabpanel が存在し、role/aria-label が付与されている
    const panel = page.getByRole("tabpanel");
    await expect(panel.first()).toBeVisible();
  });

  test("チャートカードに aria-label が付与されている", async ({ page }) => {
    await page.goto("/");
    const chartCard = page.locator('[role="tabpanel"][aria-label]').first();
    await expect(chartCard).toBeVisible();
    const label = await chartCard.getAttribute("aria-label");
    expect(label).toBeTruthy();
    expect(label!.length).toBeGreaterThan(0);
  });
});
