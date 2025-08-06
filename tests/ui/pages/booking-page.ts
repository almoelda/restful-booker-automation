import { Page, expect, Locator } from "@playwright/test";

export class BookingPage {
  readonly page: Page;

  // Locators for booking form elements
  readonly bookNowButton: Locator;
  readonly checkAvailabilityButton: Locator;
  readonly roomsInNavbar: Locator;
  readonly bookingInNavbar: Locator;
  readonly amenitiesInNavbar: Locator;
  readonly locationInNavbar: Locator;
  readonly contactInNavbar: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators
    this.bookNowButton = page.locator("a.btn.btn-primary.btn-lg");
    this.checkAvailabilityButton = page.getByRole("button", {
      name: "Check Availability",
    });
    this.roomsInNavbar = page.locator('a.nav-link[href="/#rooms"]');
    this.bookingInNavbar = page.locator('a.nav-link[href="/#booking"]');
    this.amenitiesInNavbar = page.locator('a.nav-link[href="/#amenities"]');
    this.locationInNavbar = page.locator('a.nav-link[href="/#location"]');
    this.contactInNavbar = page.locator('a.nav-link[href="/#contact"]');
  }

  async goto(): Promise<void> {
    await this.page.goto("/", {
      waitUntil: "domcontentloaded",
    });
  }
  
  async expectRoomTypesToBeVisible(): Promise<void> {
    await expect(this.page.getByText("Single")).toBeVisible();
    await expect(this.page.getByText("Double")).toBeVisible();
    await expect(this.page.getByText("Suite")).toBeVisible();
  }

  async fillBookingForm(roomType: number): Promise<void> {
    await this.page.locator("input.form-control").nth(0).click();
    await this.page.locator(".react-datepicker__day--008").click();
    await this.page.locator("input.form-control").nth(1).click();
    await this.page.locator(".react-datepicker__day--021").click();
    await this.checkAvailabilityButton.click();
    await this.page.locator('a:has-text("Book now")').nth(roomType).click();
    await this.page.locator("#doReservation").click();
    await this.page.fill('input[name="firstname"]', "Israel");
    await this.page.fill('input[name="lastname"]', "Israeli");
    await this.page.fill('input[name="email"]', "israelisraeli@example.com");
    await this.page.fill('input[name="phone"]', "123456789022");
  }
}
