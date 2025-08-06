import { Page, expect, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;

  // Locators for login 
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorAlert: Locator;
  readonly loginForm: Locator;
  readonly cardHeader: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators 
    this.usernameInput = page.locator("#username");
    this.passwordInput = page.locator("#password");
    this.loginButton = page.locator("#doLogin");
    this.errorAlert = page.locator(".alert.alert-danger");
    this.loginForm = page.locator("form");
    this.cardHeader = page.locator(".card-header h2");
  }

  async goto(): Promise<void> {
    await this.page.goto("/admin", {
      waitUntil: "domcontentloaded",
    });
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectLoginFormToBeVisible(): Promise<void> {
    await expect(this.cardHeader).toHaveText("Login");
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    await expect(this.loginForm).toBeVisible();
  }

  async expectErrorAlertToBeVisible(): Promise<void> {
    await expect(this.errorAlert).toBeVisible();
    await expect(this.errorAlert).toHaveText("Invalid credentials");
  }
}
