import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/admin-login";

test.describe("Admin page tests", () => {
  let loginPage: LoginPage;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("Admin Login should load successfully", async () => {
    await expect(loginPage.page.getByText("Login")).toHaveCount(2);
  });

  test("Should successfully login the contact form", async () => {
    await loginPage.page.locator("#username").fill("admin");
    await loginPage.page.locator("#password").fill("password");
    await Promise.all([
      loginPage.page.getByRole("button", { name: "Login" }).click(),
    ]);
    await expect(
      loginPage.page.getByRole("link", { name: "Restful Booker Platform Demo" })
    ).toBeVisible();
    await expect(
      loginPage.page.locator('[data-testid="roomlisting"]').nth(0)
    ).toBeVisible();
  });
});
