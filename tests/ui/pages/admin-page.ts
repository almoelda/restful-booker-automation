import { Page, expect } from '@playwright/test';
import { BasePage } from './base-page';

export interface AdminCredentials {
  username: string;
  password: string;
}

export class AdminPage extends BasePage {
  // Selectors
  private readonly selectors = {
    // Login form
    loginSection: '.login-form',
    usernameInput: 'input[name="username"]',
    passwordInput: 'input[name="password"]',
    loginButton: 'button[type="submit"], .btn-login',
    loginError: '.alert-danger, .error-message',
    
    // Admin dashboard
    adminDashboard: '.admin-dashboard',
    logoutButton: '.btn-logout',
    adminTitle: 'h1, .admin-title',
    
    // Bookings management
    bookingsTable: '.bookings-table',
    bookingRows: '.booking-row',
    bookingId: '.booking-id',
    bookingCustomer: '.booking-customer',
    bookingDates: '.booking-dates',
    bookingStatus: '.booking-status',
    
    // Action buttons
    editBookingButton: '.btn-edit',
    deleteBookingButton: '.btn-delete',
    viewBookingButton: '.btn-view',
    addBookingButton: '.btn-add',
    
    // Filters and search
    searchInput: 'input[name="search"]',
    searchButton: '.btn-search',
    filterStatus: 'select[name="status"]',
    filterDate: 'input[name="date-filter"]',
    clearFiltersButton: '.btn-clear-filters',
    
    // Pagination
    paginationContainer: '.pagination',
    prevPageButton: '.pagination .prev',
    nextPageButton: '.pagination .next',
    pageNumbers: '.pagination .page-number',
    
    // Booking details modal
    bookingModal: '#bookingDetailsModal',
    modalTitle: '.modal-title',
    modalContent: '.modal-body',
    modalCloseButton: '.modal-close',
    
    // Edit booking form
    editForm: '.edit-booking-form',
    editFirstName: 'input[name="edit-firstname"]',
    editLastName: 'input[name="edit-lastname"]',
    editEmail: 'input[name="edit-email"]',
    editPhone: 'input[name="edit-phone"]',
    saveChangesButton: '.btn-save',
    cancelEditButton: '.btn-cancel',
    
    // Delete confirmation
    deleteModal: '#deleteConfirmModal',
    confirmDeleteButton: '.btn-confirm-delete',
    cancelDeleteButton: '.btn-cancel-delete',
    
    // Statistics/Summary
    totalBookings: '.total-bookings',
    activeBookings: '.active-bookings',
    completedBookings: '.completed-bookings',
    revenueTotal: '.revenue-total',
    
    // Messages
    successAlert: '.alert-success',
    errorAlert: '.alert-danger',
    infoAlert: '.alert-info',
  };

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to admin login page
   */
  async navigateToAdminLogin(): Promise<void> {
    await this.navigate('/#/admin');
    await this.waitForElement(this.selectors.loginSection);
    this.logger.info('Navigated to admin login page');
  }

  /**
   * Login with credentials
   */
  async login(credentials: AdminCredentials): Promise<void> {
    this.logger.info('Attempting admin login', { username: credentials.username });
    
    await this.fillInput(this.selectors.usernameInput, credentials.username);
    await this.fillInput(this.selectors.passwordInput, credentials.password);
    await this.clickElement(this.selectors.loginButton);
    
    // Wait for either dashboard or error message
    try {
      await Promise.race([
        this.waitForElement(this.selectors.adminDashboard, 10000),
        this.waitForElement(this.selectors.loginError, 5000)
      ]);
    } catch (error) {
      this.logger.error('Login timeout - neither dashboard nor error appeared');
      throw error;
    }
    
    this.logger.info('Login attempt completed');
  }

  /**
   * Check if login was successful
   */
  async isLoginSuccessful(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.adminDashboard);
  }

  /**
   * Get login error message
   */
  async getLoginError(): Promise<string> {
    const isVisible = await this.isElementVisible(this.selectors.loginError);
    if (!isVisible) {
      return '';
    }
    return await this.getElementText(this.selectors.loginError);
  }

  /**
   * Logout from admin panel
   */
  async logout(): Promise<void> {
    await this.clickElement(this.selectors.logoutButton);
    await this.waitForElement(this.selectors.loginSection);
    this.logger.info('Logged out from admin panel');
  }

  /**
   * Get admin dashboard title
   */
  async getDashboardTitle(): Promise<string> {
    return await this.getElementText(this.selectors.adminTitle);
  }

  /**
   * Get all bookings from table
   */
  async getAllBookings(): Promise<any[]> {
    await this.waitForElement(this.selectors.bookingsTable);
    
    const bookingRows = this.page.locator(this.selectors.bookingRows);
    const count = await bookingRows.count();
    const bookings = [];
    
    for (let i = 0; i < count; i++) {
      const row = bookingRows.nth(i);
      const booking = {
        id: await row.locator(this.selectors.bookingId).textContent(),
        customer: await row.locator(this.selectors.bookingCustomer).textContent(),
        dates: await row.locator(this.selectors.bookingDates).textContent(),
        status: await row.locator(this.selectors.bookingStatus).textContent(),
      };
      bookings.push(booking);
    }
    
    this.logger.info(`Retrieved ${bookings.length} bookings from table`);
    return bookings;
  }

  /**
   * Search for bookings
   */
  async searchBookings(searchTerm: string): Promise<void> {
    await this.fillInput(this.selectors.searchInput, searchTerm);
    await this.clickElement(this.selectors.searchButton);
    await this.page.waitForTimeout(1000); // Wait for search results
    this.logger.info(`Searched for bookings with term: ${searchTerm}`);
  }

  /**
   * Filter bookings by status
   */
  async filterByStatus(status: string): Promise<void> {
    await this.selectOption(this.selectors.filterStatus, status);
    await this.page.waitForTimeout(1000); // Wait for filter results
    this.logger.info(`Filtered bookings by status: ${status}`);
  }

  /**
   * Clear all filters
   */
  async clearFilters(): Promise<void> {
    await this.clickElement(this.selectors.clearFiltersButton);
    await this.page.waitForTimeout(1000); // Wait for results to reset
    this.logger.info('Cleared all filters');
  }

  /**
   * Edit booking by ID
   */
  async editBooking(bookingId: string, editData: any): Promise<void> {
    // Find and click edit button for specific booking
    const bookingRow = this.page.locator(`[data-booking-id="${bookingId}"]`);
    await bookingRow.locator(this.selectors.editBookingButton).click();
    
    // Wait for edit form
    await this.waitForElement(this.selectors.editForm);
    
    // Fill edit form
    if (editData.firstName) {
      await this.fillInput(this.selectors.editFirstName, editData.firstName);
    }
    if (editData.lastName) {
      await this.fillInput(this.selectors.editLastName, editData.lastName);
    }
    if (editData.email) {
      await this.fillInput(this.selectors.editEmail, editData.email);
    }
    if (editData.phone) {
      await this.fillInput(this.selectors.editPhone, editData.phone);
    }
    
    // Save changes
    await this.clickElement(this.selectors.saveChangesButton);
    
    this.logger.info(`Edited booking ${bookingId}`, editData);
  }

  /**
   * Delete booking by ID
   */
  async deleteBooking(bookingId: string): Promise<void> {
    // Find and click delete button for specific booking
    const bookingRow = this.page.locator(`[data-booking-id="${bookingId}"]`);
    await bookingRow.locator(this.selectors.deleteBookingButton).click();
    
    // Wait for confirmation modal
    await this.waitForElement(this.selectors.deleteModal);
    
    // Confirm deletion
    await this.clickElement(this.selectors.confirmDeleteButton);
    
    this.logger.info(`Deleted booking ${bookingId}`);
  }

  /**
   * View booking details
   */
  async viewBookingDetails(bookingId: string): Promise<string> {
    // Find and click view button for specific booking
    const bookingRow = this.page.locator(`[data-booking-id="${bookingId}"]`);
    await bookingRow.locator(this.selectors.viewBookingButton).click();
    
    // Wait for details modal
    await this.waitForElement(this.selectors.bookingModal);
    
    // Get modal content
    const details = await this.getElementText(this.selectors.modalContent);
    
    // Close modal
    await this.clickElement(this.selectors.modalCloseButton);
    
    this.logger.info(`Viewed details for booking ${bookingId}`);
    return details;
  }

  /**
   * Get booking statistics
   */
  async getBookingStats(): Promise<any> {
    const stats = {
      total: await this.getElementText(this.selectors.totalBookings),
      active: await this.getElementText(this.selectors.activeBookings),
      completed: await this.getElementText(this.selectors.completedBookings),
      revenue: await this.getElementText(this.selectors.revenueTotal),
    };
    
    this.logger.info('Retrieved booking statistics', stats);
    return stats;
  }

  /**
   * Navigate to next page
   */
  async goToNextPage(): Promise<void> {
    const isEnabled = await this.isElementEnabled(this.selectors.nextPageButton);
    if (isEnabled) {
      await this.clickElement(this.selectors.nextPageButton);
      await this.page.waitForTimeout(1000); // Wait for page load
      this.logger.info('Navigated to next page');
    } else {
      this.logger.warn('Next page button is disabled');
    }
  }

  /**
   * Navigate to previous page
   */
  async goToPreviousPage(): Promise<void> {
    const isEnabled = await this.isElementEnabled(this.selectors.prevPageButton);
    if (isEnabled) {
      await this.clickElement(this.selectors.prevPageButton);
      await this.page.waitForTimeout(1000); // Wait for page load
      this.logger.info('Navigated to previous page');
    } else {
      this.logger.warn('Previous page button is disabled');
    }
  }

  /**
   * Go to specific page number
   */
  async goToPage(pageNumber: number): Promise<void> {
    const pageButton = this.page.locator(`${this.selectors.pageNumbers}:has-text("${pageNumber}")`);
    await pageButton.click();
    await this.page.waitForTimeout(1000); // Wait for page load
    this.logger.info(`Navigated to page ${pageNumber}`);
  }

  /**
   * Get success message
   */
  async getSuccessMessage(): Promise<string> {
    const isVisible = await this.isElementVisible(this.selectors.successAlert);
    if (!isVisible) {
      return '';
    }
    return await this.getElementText(this.selectors.successAlert);
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string> {
    const isVisible = await this.isElementVisible(this.selectors.errorAlert);
    if (!isVisible) {
      return '';
    }
    return await this.getElementText(this.selectors.errorAlert);
  }

  /**
   * Check if bookings table is loaded
   */
  async isBookingsTableLoaded(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.bookingsTable);
  }

  /**
   * Get number of bookings displayed
   */
  async getBookingsCount(): Promise<number> {
    return await this.getElementCount(this.selectors.bookingRows);
  }

  /**
   * Assert admin dashboard is loaded
   */
  async assertAdminDashboardLoaded(): Promise<void> {
    await this.assertElementVisible(this.selectors.adminDashboard);
    await this.assertElementVisible(this.selectors.bookingsTable);
    await this.assertElementVisible(this.selectors.logoutButton);
    
    this.logger.info('Verified admin dashboard is loaded');
  }

  /**
   * Assert login failed
   */
  async assertLoginFailed(expectedErrorText?: string): Promise<void> {
    const errorMessage = await this.getLoginError();
    expect(errorMessage).toBeTruthy();
    
    if (expectedErrorText) {
      expect(errorMessage.toLowerCase()).toContain(expectedErrorText.toLowerCase());
    }
    
    this.logger.info('Verified login failed', { errorMessage });
  }

  /**
   * Assert booking operation success
   */
  async assertBookingOperationSuccess(): Promise<void> {
    const successMessage = await this.getSuccessMessage();
    expect(successMessage).toBeTruthy();
    
    this.logger.info('Verified booking operation was successful');
  }
}