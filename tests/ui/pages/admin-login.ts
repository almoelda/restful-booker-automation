import { Page, expect, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(): Promise<void> {
    await this.page.goto("https://automationintesting.online/admin", {
      waitUntil: "domcontentloaded",
    });
    await this.page.setViewportSize({ width: 1400, height: 800 });
    await this.page.waitForLoadState("networkidle");
  }
}
