import { Page, expect, Locator } from '@playwright/test';

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
    this.bookNowButton = page.locator('a.btn.btn-primary.btn-lg');
    this.checkAvailabilityButton = page.getByRole('button', { name: 'Check Availability' });
    this.roomsInNavbar = page.locator('a.nav-link[href="/#rooms"]');
    this.bookingInNavbar = page.locator('a.nav-link[href="/#booking"]');
    this.amenitiesInNavbar = page.locator('a.nav-link[href="/#amenities"]');
    this.locationInNavbar = page.locator('a.nav-link[href="/#location"]');
    this.contactInNavbar = page.locator('a.nav-link[href="/#contact"]');
  }
 
  async goto(): Promise<void> {
    await this.page.goto('https://automationintesting.online/', {
      waitUntil: 'domcontentloaded',
    });
    await this.page.setViewportSize({ width: 1400, height: 800 });
    await this.page.waitForLoadState('networkidle');
  }

  async showRooms(): Promise<void> {
    await expect(this.page.getByText('Single')).toBeVisible();
    await expect(this.page.getByText('Double')).toBeVisible();
    await expect(this.page.getByText('Suite')).toBeVisible();
  }

}