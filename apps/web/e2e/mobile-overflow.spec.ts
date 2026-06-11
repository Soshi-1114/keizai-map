import { test, expect } from "@playwright/test";

const URLS = ["/", "/about", "/articles", "/articles/real-wages", "/articles/abenomics"];
const VIEWPORTS = [
  { name: "iPhone-SE", width: 375, height: 667 },
  { name: "iPhone-12", width: 390, height: 844 },
];

for (const url of URLS) {
  for (const vp of VIEWPORTS) {
    test(`${url} on ${vp.name} has no horizontal overflow`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.goto(url);
      // JS が完全に読み込まれるまで少し待つ
      await page.waitForLoadState("networkidle");
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    });
  }
}
