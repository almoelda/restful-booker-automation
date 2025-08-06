import { Page, expect, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(): Promise<void> {
    await this.page.goto("/admin", {
      waitUntil: "domcontentloaded",
    });
  }
}
