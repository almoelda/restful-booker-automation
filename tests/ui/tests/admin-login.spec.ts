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

  test("Admin Login page should load successfully with all form elements", async () => {
    // Verify the login form header
    await expect(loginPage.cardHeader).toHaveText("Login");
    
    // Verify all form elements are present and visible
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.loginForm).toBeVisible();
    
    // Verify form elements have correct attributes
    await expect(loginPage.usernameInput).toHaveAttribute("type", "text");
    await expect(loginPage.usernameInput).toHaveAttribute("placeholder", "Enter username");
    await expect(loginPage.passwordInput).toHaveAttribute("type", "password");
    await expect(loginPage.passwordInput).toHaveAttribute("placeholder", "Password");
    await expect(loginPage.loginButton).toHaveAttribute("type", "submit");
    await expect(loginPage.loginButton).toHaveText("Login");
  });

  test("Should successfully login with valid credentials", async () => {
    // Use the page object method for login
    await loginPage.login("admin", "password");
    
    // Verify successful login by checking for admin dashboard elements
    await expect(
      loginPage.page.getByRole("link", { name: "Restful Booker Platform Demo" })
    ).toBeVisible();
    await expect(
      loginPage.page.locator('[data-testid="roomlisting"]').nth(0)
    ).toBeVisible();
  });

  test("Should show error message with invalid credentials", async () => {
    // Attempt login with invalid credentials
    await loginPage.login("invalid", "wrongpassword");
    
    // Verify error message appears
    await loginPage.expectErrorAlertToBeVisible();
  });
});
