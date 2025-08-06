import { Page, expect, Locator } from "@playwright/test";

export class BookingPage {
  readonly page: Page;

  // Navigation locators
  readonly bookNowButton: Locator;
  readonly checkAvailabilityButton: Locator;
  readonly roomsInNavbar: Locator;
  readonly bookingInNavbar: Locator;
  readonly amenitiesInNavbar: Locator;
  readonly locationInNavbar: Locator;
  readonly contactInNavbar: Locator;

  // Booking form locators
  readonly checkInInput: Locator;
  readonly checkOutInput: Locator;
  readonly reserveNowButton: Locator;
  readonly firstnameInput: Locator;
  readonly lastnameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;

  // Contact form locators
  readonly contactNameInput: Locator;
  readonly contactEmailInput: Locator;
  readonly contactPhoneInput: Locator;
  readonly contactSubjectInput: Locator;
  readonly contactDescriptionInput: Locator;
  readonly submitContactButton: Locator;

  // Section locators
  readonly amenitiesSection: Locator;
  readonly locationSection: Locator;
  readonly mapOverlay: Locator;
  readonly contactInformation: Locator;

  // Booking confirmation locators
  readonly bookingConfirmedText: Locator;
  readonly bookingDatesText: Locator;
  readonly priceText: Locator;
  readonly totalPriceText: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation locators - using specific CSS selectors to avoid duplicates
    this.bookNowButton = page.getByRole("link", { name: /book now/i });
    this.checkAvailabilityButton = page.getByRole("button", { name: "Check Availability" });
    this.roomsInNavbar = page.locator('a.nav-link[href="/#rooms"]');
    this.bookingInNavbar = page.locator('a.nav-link[href="/#booking"]');
    this.amenitiesInNavbar = page.locator('a.nav-link[href="/#amenities"]');
    this.locationInNavbar = page.locator('a.nav-link[href="/#location"]');
    this.contactInNavbar = page.locator('a.nav-link[href="/#contact"]');

    // Booking form locators - using test IDs and semantic selectors
    this.checkInInput = page.locator('input[placeholder*="Check-in"]');
    this.checkOutInput = page.locator('input[placeholder*="Check-out"]');
    this.reserveNowButton = page.getByRole("button", { name: "Reserve Now" });
    this.firstnameInput = page.locator('input[name="firstname"]');
    this.lastnameInput = page.locator('input[name="lastname"]');
    this.emailInput = page.locator('input[name="email"]');
    this.phoneInput = page.locator('input[name="phone"]');

    // Contact form locators - using test IDs
    this.contactNameInput = page.getByTestId("ContactName");
    this.contactEmailInput = page.getByTestId("ContactEmail");
    this.contactPhoneInput = page.getByTestId("ContactPhone");
    this.contactSubjectInput = page.getByTestId("ContactSubject");
    this.contactDescriptionInput = page.getByTestId("ContactDescription");
    this.submitContactButton = page.getByRole("button", { name: "Submit" });

    // Section locators - using semantic text
    this.amenitiesSection = page.getByText("Our Amenities");
    this.locationSection = page.getByText("Our Location");
    this.mapOverlay = page.locator('[data-testid="map-overlay"]').or(page.locator(".pigeon-overlays"));
    this.contactInformation = page.getByText("Contact Information");

    // Booking confirmation locators
    this.bookingConfirmedText = page.getByText("Booking Confirmed");
    this.bookingDatesText = page.getByText(/2025-08-08 - 2025-08-21/);
    this.priceText = page.getByText(/£\d+ x \d+ nights/);
    this.totalPriceText = page.getByText(/^\d{4}$/); // Matches 4-digit total price
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
    // Select check-in date
    await this.checkInInput.click();
    await this.page.locator('[data-testid="checkin-day-8"]').or(this.page.locator(".react-datepicker__day--008")).click();
    
    // Select check-out date
    await this.checkOutInput.click();
    await this.page.locator('[data-testid="checkout-day-21"]').or(this.page.locator(".react-datepicker__day--021")).click();

    await this.checkAvailabilityButton.click();
    
    // Select room type (1=Single, 2=Double, 3=Suite)
    await this.page.getByRole("link", { name: "Book now" }).nth(roomType - 1).click();
    
    // Fill reservation form
    await this.page.locator("#doReservation").click();
    await this.firstnameInput.fill("Israel");
    await this.lastnameInput.fill("Israeli");
    await this.emailInput.fill("israelisraeli@example.com");
    await this.phoneInput.fill("123456789022");
  }

  async submitContactForm(name: string, email: string, phone: string, subject: string, description: string): Promise<void> {
    await this.contactNameInput.fill(name);
    await this.contactEmailInput.fill(email);
    await this.contactPhoneInput.fill(phone);
    await this.contactSubjectInput.fill(subject);
    await this.contactDescriptionInput.fill(description);
    await this.submitContactButton.click();
  }

  async expectAmenitiesSectionToBeVisible(): Promise<void> {
    await expect(this.amenitiesSection).toBeVisible();
  }

  async expectLocationSectionToBeVisible(): Promise<void> {
    await expect(this.locationSection).toBeVisible();
    await expect(this.mapOverlay).toHaveCount(1);
    await expect(this.contactInformation).toBeVisible();
  }

  async expectBookingConfirmation(roomType: string, expectedPrice: string, expectedTotal: string): Promise<void> {
    await expect(this.bookingConfirmedText).toBeVisible();
    await expect(this.bookingDatesText).toBeVisible();
    await expect(this.page.getByText(expectedPrice)).toBeVisible();
    await expect(this.page.getByText(expectedTotal)).toBeVisible();
  }
}
