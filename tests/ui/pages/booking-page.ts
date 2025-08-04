import { Page, expect } from '@playwright/test';
import { BasePage } from './base-page';

export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export class BookingPage extends BasePage {
  // Selectors
  private readonly selectors = {
    // Room booking section
    bookingSection: '[data-testid="booking-form"]',
    roomDisplay: '.room-booking',
    roomImage: '.room-image img',
    roomTitle: '.room-title',
    roomDescription: '.room-description',
    roomPrice: '.room-price',
    
    // Booking form
    firstNameInput: 'input[name="firstname"]',
    lastNameInput: 'input[name="lastname"]',
    emailInput: 'input[name="email"]',
    phoneInput: 'input[name="phone"]',
    
    // Date picker
    checkinDatePicker: 'input[name="checkin"]',
    checkoutDatePicker: 'input[name="checkout"]',
    datePickerCalendar: '.react-datepicker',
    
    // Booking buttons
    bookButton: 'button[type="submit"]',
    cancelButton: '.btn-cancel',
    
    // Contact form section
    contactSection: '.contact',
    contactForm: '.contact form',
    contactNameInput: 'input[name="name"]',
    contactEmailInput: 'input[name="email"]', 
    contactPhoneInput: 'input[name="phone"]',
    contactSubjectInput: 'input[name="subject"]',
    contactMessageTextarea: 'textarea[name="description"]',
    contactSubmitButton: '.contact form input[type="submit"]',
    
    // Messages and validation
    successMessage: '.alert-success',
    errorMessage: '.alert-danger',
    validationError: '.invalid-feedback',
    loadingSpinner: '.spinner-border',
    
    // Booking confirmation
    confirmationModal: '#bookingModal',
    confirmationTitle: '.modal-title',
    confirmationDetails: '.booking-details',
    confirmButton: '.btn-confirm',
    closeModalButton: '.close',
    
    // Calendar availability
    availableDates: '.available-date',
    unavailableDates: '.unavailable-date',
    calendarPrevButton: '.react-datepicker__navigation--previous',
    calendarNextButton: '.react-datepicker__navigation--next',
  };

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to main page (contains both booking and contact forms)
   */
  async navigateToMainPage(): Promise<void> {
    await this.navigate('/');
    await this.waitForElement(this.selectors.bookingSection);
    this.logger.info('Navigated to main page with booking and contact sections');
  }

  /**
   * Navigate to booking page (alias for main page)
   */
  async navigateToBookingPage(): Promise<void> {
    await this.navigateToMainPage();
  }

  // =========================
  // BOOKING FORM METHODS
  // =========================

  /**
   * Check if booking form is displayed
   */
  async isBookingFormDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.bookingSection);
  }

  /**
   * Fill booking form with customer details
   */
  async fillBookingForm(formData: BookingFormData): Promise<void> {
    this.logger.info('Filling booking form', formData);
    
    await this.fillInput(this.selectors.firstNameInput, formData.firstName);
    await this.fillInput(this.selectors.lastNameInput, formData.lastName);
    await this.fillInput(this.selectors.emailInput, formData.email);
    await this.fillInput(this.selectors.phoneInput, formData.phone);
    
    this.logger.info('Booking form filled successfully');
  }

  /**
   * Select check-in date
   */
  async selectCheckinDate(date: string): Promise<void> {
    await this.clickElement(this.selectors.checkinDatePicker);
    await this.fillInput(this.selectors.checkinDatePicker, date);
    await this.pressKey('Tab'); // Close date picker
    this.logger.info(`Selected check-in date: ${date}`);
  }

  /**
   * Select check-out date
   */
  async selectCheckoutDate(date: string): Promise<void> {
    await this.clickElement(this.selectors.checkoutDatePicker);
    await this.fillInput(this.selectors.checkoutDatePicker, date);
    await this.pressKey('Tab'); // Close date picker
    this.logger.info(`Selected check-out date: ${date}`);
  }

  /**
   * Select dates using date picker calendar
   */
  async selectDatesUsingCalendar(checkinDay: string, checkoutDay: string): Promise<void> {
    // Open check-in calendar
    await this.clickElement(this.selectors.checkinDatePicker);
    await this.waitForElement(this.selectors.datePickerCalendar);
    
    // Click on check-in date
    await this.clickElementByText(checkinDay, 'button');
    
    // Open check-out calendar
    await this.clickElement(this.selectors.checkoutDatePicker);
    await this.waitForElement(this.selectors.datePickerCalendar);
    
    // Click on check-out date
    await this.clickElementByText(checkoutDay, 'button');
    
    this.logger.info(`Selected dates using calendar: ${checkinDay} to ${checkoutDay}`);
  }

  /**
   * Click book button
   */
  async clickBookButton(): Promise<void> {
    await this.clickElement(this.selectors.bookButton);
    this.logger.info('Clicked book button');
  }

  /**
   * Submit booking form
   */
  async submitBooking(): Promise<void> {
    await this.clickBookButton();
    
    // Wait for either success message or error message
    try {
      await Promise.race([
        this.waitForElement(this.selectors.successMessage, 5000),
        this.waitForElement(this.selectors.errorMessage, 5000),
        this.waitForElement(this.selectors.confirmationModal, 5000)
      ]);
    } catch (error) {
      this.logger.warn('No success/error message appeared after booking submission');
    }
    
    this.logger.info('Booking form submitted');
  }

  /**
   * Complete booking process
   */
  async completeBooking(formData: BookingFormData, checkinDate: string, checkoutDate: string): Promise<void> {
    await this.fillBookingForm(formData);
    await this.selectCheckinDate(checkinDate);
    await this.selectCheckoutDate(checkoutDate);
    await this.submitBooking();
    
    this.logger.info('Completed booking process');
  }

  /**
   * Get success message text
   */
  async getSuccessMessage(): Promise<string> {
    const isVisible = await this.isElementVisible(this.selectors.successMessage);
    if (!isVisible) {
      return '';
    }
    return await this.getElementText(this.selectors.successMessage);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    const isVisible = await this.isElementVisible(this.selectors.errorMessage);
    if (!isVisible) {
      return '';
    }
    return await this.getElementText(this.selectors.errorMessage);
  }

  /**
   * Get validation error messages
   */
  async getValidationErrors(): Promise<string[]> {
    const errorElements = this.page.locator(this.selectors.validationError);
    const count = await errorElements.count();
    const errors: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const errorText = await errorElements.nth(i).textContent();
      if (errorText) {
        errors.push(errorText.trim());
      }
    }
    
    return errors;
  }

  /**
   * Check if booking button is enabled
   */
  async isBookButtonEnabled(): Promise<boolean> {
    return await this.isElementEnabled(this.selectors.bookButton);
  }

  /**
   * Check if loading spinner is visible
   */
  async isLoadingSpinnerVisible(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.loadingSpinner);
  }

  /**
   * Wait for booking confirmation modal
   */
  async waitForConfirmationModal(): Promise<void> {
    await this.waitForElement(this.selectors.confirmationModal);
    this.logger.info('Booking confirmation modal appeared');
  }

  /**
   * Get booking confirmation details
   */
  async getConfirmationDetails(): Promise<string> {
    await this.waitForConfirmationModal();
    return await this.getElementText(this.selectors.confirmationDetails);
  }

  /**
   * Confirm booking in modal
   */
  async confirmBookingInModal(): Promise<void> {
    await this.waitForConfirmationModal();
    await this.clickElement(this.selectors.confirmButton);
    this.logger.info('Confirmed booking in modal');
  }

  /**
   * Close booking confirmation modal
   */
  async closeConfirmationModal(): Promise<void> {
    await this.waitForConfirmationModal();
    await this.clickElement(this.selectors.closeModalButton);
    this.logger.info('Closed booking confirmation modal');
  }

  /**
   * Get room information
   */
  async getRoomInfo(): Promise<{title: string, description: string, price: string}> {
    const title = await this.getElementText(this.selectors.roomTitle);
    const description = await this.getElementText(this.selectors.roomDescription);
    const price = await this.getElementText(this.selectors.roomPrice);
    
    return { title, description, price };
  }

  /**
   * Check if room image is displayed
   */
  async isRoomImageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.roomImage);
  }

  /**
   * Clear form fields
   */
  async clearFormFields(): Promise<void> {
    await this.fillInput(this.selectors.firstNameInput, '');
    await this.fillInput(this.selectors.lastNameInput, '');
    await this.fillInput(this.selectors.emailInput, '');
    await this.fillInput(this.selectors.phoneInput, '');
    await this.fillInput(this.selectors.checkinDatePicker, '');
    await this.fillInput(this.selectors.checkoutDatePicker, '');
    
    this.logger.info('Cleared all form fields');
  }

  /**
   * Get form field values
   */
  async getFormFieldValues(): Promise<BookingFormData & {checkin: string, checkout: string}> {
    const firstName = await this.page.locator(this.selectors.firstNameInput).inputValue();
    const lastName = await this.page.locator(this.selectors.lastNameInput).inputValue();
    const email = await this.page.locator(this.selectors.emailInput).inputValue();
    const phone = await this.page.locator(this.selectors.phoneInput).inputValue();
    const checkin = await this.page.locator(this.selectors.checkinDatePicker).inputValue();
    const checkout = await this.page.locator(this.selectors.checkoutDatePicker).inputValue();
    
    return { firstName, lastName, email, phone, checkin, checkout };
  }

  /**
   * Check date availability
   */
  async checkDateAvailability(date: string): Promise<boolean> {
    await this.clickElement(this.selectors.checkinDatePicker);
    await this.waitForElement(this.selectors.datePickerCalendar);
    
    const dateElement = this.page.locator(`button:has-text("${date}")`);
    const isDisabled = await dateElement.getAttribute('disabled');
    
    // Close calendar
    await this.pressKey('Escape');
    
    return isDisabled === null;
  }

  /**
   * Navigate to next month in calendar
   */
  async navigateToNextMonth(): Promise<void> {
    await this.clickElement(this.selectors.calendarNextButton);
    this.logger.info('Navigated to next month in calendar');
  }

  /**
   * Navigate to previous month in calendar
   */
  async navigateToPreviousMonth(): Promise<void> {
    await this.clickElement(this.selectors.calendarPrevButton);
    this.logger.info('Navigated to previous month in calendar');
  }

  /**
   * Validate form field requirements
   */
  async validateFormFields(): Promise<{[key: string]: boolean}> {
    const validations = {
      firstName: await this.isElementVisible(`${this.selectors.firstNameInput}:invalid`),
      lastName: await this.isElementVisible(`${this.selectors.lastNameInput}:invalid`),
      email: await this.isElementVisible(`${this.selectors.emailInput}:invalid`),
      phone: await this.isElementVisible(`${this.selectors.phoneInput}:invalid`),
    };
    
    this.logger.info('Validated form field requirements', validations);
    return validations;
  }

  /**
   * Test form field character limits
   */
  async testFieldCharacterLimits(): Promise<{[key: string]: number}> {
    const longText = 'a'.repeat(1000);
    
    await this.fillInput(this.selectors.firstNameInput, longText);
    await this.fillInput(this.selectors.lastNameInput, longText);
    await this.fillInput(this.selectors.emailInput, `${longText}@example.com`);
    await this.fillInput(this.selectors.phoneInput, longText);
    
    const actualValues = await this.getFormFieldValues();
    
    const limits = {
      firstName: actualValues.firstName.length,
      lastName: actualValues.lastName.length,
      email: actualValues.email.length,
      phone: actualValues.phone.length,
    };
    
    this.logger.info('Tested field character limits', limits);
    return limits;
  }

  /**
   * Assert booking form is valid
   */
  async assertBookingFormValid(): Promise<void> {
    await this.assertElementVisible(this.selectors.bookingSection);
    await this.assertElementVisible(this.selectors.firstNameInput);
    await this.assertElementVisible(this.selectors.lastNameInput);
    await this.assertElementVisible(this.selectors.emailInput);
    await this.assertElementVisible(this.selectors.phoneInput);
    await this.assertElementVisible(this.selectors.checkinDatePicker);
    await this.assertElementVisible(this.selectors.checkoutDatePicker);
    await this.assertElementVisible(this.selectors.bookButton);
    
    this.logger.info('Verified booking form is valid and all elements are present');
  }

  /**
   * Assert booking success
   */
  async assertBookingSuccess(): Promise<void> {
    const successMessage = await this.getSuccessMessage();
    expect(successMessage).toBeTruthy();
    expect(successMessage.toLowerCase()).toContain('success');
    
    this.logger.info('Verified booking was successful');
  }

  /**
   * Assert booking error
   */
  async assertBookingError(expectedErrorText?: string): Promise<void> {
    const errorMessage = await this.getErrorMessage();
    expect(errorMessage).toBeTruthy();
    
    if (expectedErrorText) {
      expect(errorMessage.toLowerCase()).toContain(expectedErrorText.toLowerCase());
    }
    
    this.logger.info('Verified booking error occurred', { errorMessage });
  }

  // =========================
  // CONTACT FORM METHODS
  // =========================

  /**
   * Check if contact form is displayed
   */
  async isContactFormDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.contactSection);
  }

  /**
   * Fill contact form with provided data
   */
  async fillContactForm(formData: ContactFormData): Promise<void> {
    this.logger.info('Filling contact form', formData);
    
    await this.scrollToElement(this.selectors.contactSection);
    await this.fillInput(this.selectors.contactNameInput, formData.name);
    await this.fillInput(this.selectors.contactEmailInput, formData.email);
    await this.fillInput(this.selectors.contactPhoneInput, formData.phone);
    await this.fillInput(this.selectors.contactSubjectInput, formData.subject);
    await this.fillInput(this.selectors.contactMessageTextarea, formData.message);
    
    this.logger.info('Contact form filled successfully');
  }

  /**
   * Submit contact form
   */
  async submitContactForm(): Promise<void> {
    await this.scrollToElement(this.selectors.contactSubmitButton);
    await this.clickElement(this.selectors.contactSubmitButton);
    this.logger.info('Contact form submitted');
  }

  /**
   * Complete contact form submission
   */
  async completeContactForm(formData: ContactFormData): Promise<void> {
    await this.fillContactForm(formData);
    await this.submitContactForm();
    
    // Wait for response
    try {
      await Promise.race([
        this.waitForElement(this.selectors.successMessage, 5000),
        this.waitForElement(this.selectors.errorMessage, 5000)
      ]);
    } catch (error) {
      this.logger.warn('No success/error message appeared after contact form submission');
    }
    
    this.logger.info('Completed contact form submission');
  }

  /**
   * Get contact form field values
   */
  async getContactFormFieldValues(): Promise<ContactFormData> {
    const name = await this.page.locator(this.selectors.contactNameInput).inputValue();
    const email = await this.page.locator(this.selectors.contactEmailInput).inputValue();
    const phone = await this.page.locator(this.selectors.contactPhoneInput).inputValue();
    const subject = await this.page.locator(this.selectors.contactSubjectInput).inputValue();
    const message = await this.page.locator(this.selectors.contactMessageTextarea).inputValue();
    
    return { name, email, phone, subject, message };
  }

  /**
   * Clear contact form fields
   */
  async clearContactFormFields(): Promise<void> {
    await this.fillInput(this.selectors.contactNameInput, '');
    await this.fillInput(this.selectors.contactEmailInput, '');
    await this.fillInput(this.selectors.contactPhoneInput, '');
    await this.fillInput(this.selectors.contactSubjectInput, '');
    await this.fillInput(this.selectors.contactMessageTextarea, '');
    
    this.logger.info('Cleared all contact form fields');
  }

  /**
   * Check if contact submit button is enabled
   */
  async isContactSubmitButtonEnabled(): Promise<boolean> {
    return await this.isElementEnabled(this.selectors.contactSubmitButton);
  }

  /**
   * Assert contact form is valid and displayed
   */
  async assertContactFormValid(): Promise<void> {
    await this.assertElementVisible(this.selectors.contactSection);
    await this.assertElementVisible(this.selectors.contactNameInput);
    await this.assertElementVisible(this.selectors.contactEmailInput);
    await this.assertElementVisible(this.selectors.contactPhoneInput);
    await this.assertElementVisible(this.selectors.contactSubjectInput);
    await this.assertElementVisible(this.selectors.contactMessageTextarea);
    await this.assertElementVisible(this.selectors.contactSubmitButton);
    
    this.logger.info('Verified contact form is valid and all elements are present');
  }

  /**
   * Assert contact form submission success
   */
  async assertContactFormSuccess(): Promise<void> {
    const successMessage = await this.getSuccessMessage();
    expect(successMessage).toBeTruthy();
    expect(successMessage.toLowerCase()).toContain('thank');
    
    this.logger.info('Verified contact form submission was successful');
  }

  /**
   * Assert contact form submission error
   */
  async assertContactFormError(expectedErrorText?: string): Promise<void> {
    const errorMessage = await this.getErrorMessage();
    expect(errorMessage).toBeTruthy();
    
    if (expectedErrorText) {
      expect(errorMessage.toLowerCase()).toContain(expectedErrorText.toLowerCase());
    }
    
    this.logger.info('Verified contact form error occurred', { errorMessage });
  }

  // =========================
  // SHARED METHODS (Both Forms)
  // =========================

  /**
   * Assert both booking and contact sections are present on page
   */
  async assertMainPageLoaded(): Promise<void> {
    await this.assertElementVisible(this.selectors.bookingSection);
    await this.assertElementVisible(this.selectors.contactSection);
    
    this.logger.info('Verified main page loaded with both booking and contact sections');
  }

  /**
   * Scroll to booking section
   */
  async scrollToBookingSection(): Promise<void> {
    await this.scrollToElement(this.selectors.bookingSection);
    this.logger.info('Scrolled to booking section');
  }

  /**
   * Scroll to contact section
   */
  async scrollToContactSection(): Promise<void> {
    await this.scrollToElement(this.selectors.contactSection);
    this.logger.info('Scrolled to contact section');
  }
}