import { test, expect } from "@playwright/test";
import { BookingPage } from "../pages/booking-page";

test.describe("Booking page tests", () => {
  let bookingPage: BookingPage;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    bookingPage = new BookingPage(page);
    await bookingPage.goto();
  });

  test("Should redirect to single room with the right date", async () => {
    await bookingPage.page.locator('input.form-control').nth(0).click();
    await bookingPage.page.locator('button[aria-label="Next Month"]').click();
    await bookingPage.page.locator('.react-datepicker__day--006').click();
    await bookingPage.page.locator('input.form-control').nth(1).click();
    await bookingPage.page.locator('button[aria-label="Next Month"]').click();
    await bookingPage.page.locator('.react-datepicker__day--019').click();
    await bookingPage.checkAvailabilityButton.click();
    await bookingPage.page.locator('a:has-text("Book now")').nth(1).click();
    await bookingPage.page.locator('#doReservation').click();
    await bookingPage.page.fill('input[name="firstname"]', 'Israel');
    await bookingPage.page.fill('input[name="lastname"]', 'Israeli');
    await bookingPage.page.fill('input[name="email"]', 'israelisraeli@example.com');
    await bookingPage.page.fill('input[name="phone"]', '1234567890');
    await expect(bookingPage.page.getByText("£100 x 13 nights")).toBeVisible();
    await expect(bookingPage.page.getByText("1340")).toBeVisible();
  });
});
