// tests/ui/tests/booking-form.spec.ts
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

  test("Homepage should load successfully", async () => {
    await expect(
      bookingPage.page.locator("a.btn.btn-primary.btn-lg")
    ).toBeVisible();
    console.log("Homepage loaded successfully");
  });

  test("Should show rooms section when clicking Book Now", async () => {
    await bookingPage.bookNowButton.click();
    await bookingPage.showRooms();
    console.log("scrolled down to rooms successfully when clicking Book Now");
  });

  test("Should show rooms section when clicking Check Availability", async () => {
    await bookingPage.checkAvailabilityButton.click();
    await bookingPage.showRooms();
    console.log(
      "scrolled down to rooms successfully when clicking Check Availability"
    );
  });

  test("Should show rooms section when clicking  Rooms in nabar", async () => {
    await bookingPage.roomsInNavbar.click();
    await bookingPage.showRooms();
    console.log(
      "scrolled down to rooms successfully when clicking Rooms in nabar"
    );
  });

  test("Should show rooms section when clicking  Booking in navbar", async () => {
    await bookingPage.bookingInNavbar.click();
    await bookingPage.showRooms();
    console.log(
      "scrolled down to rooms successfully when clicking Booking in navbar"
    );
  });

  test("Should show amenities section when clicking amenities in navbar", async () => {
    await bookingPage.amenitiesInNavbar.click();
    await expect(bookingPage.page.getByText("Our Amenities")).toBeVisible();
    console.log(
      "scrolled down to amenities successfully when clicking Amenities in navbar"
    );
  });

  test("Should show location section when clicking  Location in navbar", async () => {
    await bookingPage.locationInNavbar.click();
    await expect(bookingPage.page.getByText("Our Location")).toBeVisible();
    await expect(bookingPage.page.locator("div.pigeon-overlays")).toHaveCount(
      1
    );
    await expect(
      bookingPage.page.locator("div.card-body >> text=Contact Information")
    ).toHaveCount(1);
    console.log(
      "scrolled down to location successfully when clicking Location in navbar"
    );
  });

  test.describe("Contact tests in booking page", () => {
    test("Should successfully submit the contact form", async () => {
      await bookingPage.contactInNavbar.click();
      await expect(
        bookingPage.page.getByText("Send Us a Message")
      ).toBeVisible();
      await bookingPage.page.getByTestId("ContactName").fill("Israel Israeli");
      await bookingPage.page
        .getByTestId("ContactEmail")
        .fill("israelisraeli@example.com");
      await bookingPage.page.getByTestId("ContactPhone").fill("0547878787888");
      await bookingPage.page
        .getByTestId("ContactSubject")
        .fill("i want to book a room");
      await bookingPage.page
        .getByTestId("ContactDescription")
        .fill(
          "i want to book a room, but im want to check whats your cancellation policy, please contact me as soon as possible."
        );
      await Promise.all([
        bookingPage.page.getByRole("button", { name: "Submit" }).click(),
      ]);
      await expect(
        bookingPage.page.getByText(
          "Thanks for getting in touch Israel Israeli!"
        )
      ).toBeVisible();
      await expect(
        bookingPage.page.getByText("i want to book a room")
      ).toBeVisible();
    });

    test("Should log in and then check messages", async ({ page }) => {
      await test.step("Log in as admin", async () => {
        await page.goto("https://automationintesting.online/admin");
        await page.fill("#username", "admin");
        await page.fill("#password", "password");
        await Promise.all([
          page.getByRole("button", { name: "Login" }).click(),
        ]);
      });
      await bookingPage.page.waitForLoadState("domcontentloaded");
      await test.step("Navigate to messages page", async () => {
        await page.click('a[href="/admin/message"]');
        await expect(page.getByText("Israel Israeli")).not.toBeNull();
        await expect(
          page.locator("span.badge.bg-danger.text-white")
        ).toBeVisible();
      });
    });
  });
});
