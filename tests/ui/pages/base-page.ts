import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../../../utils/logger';

export class BasePage {
  protected page: Page;
  protected logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.logger = new Logger(this.constructor.name);
  }

  /**
   * Navigate to a specific URL with better React support
   */
  async navigate(url: string): Promise<void> {
    this.logger.info(`Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: 'networkidle' });
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to load completely including React components
   */
  async waitForPageLoad(): Promise<void> {
    // Wait for network to be idle
    await this.page.waitForLoadState('networkidle');
    
    // Wait for React to be ready (if present)
    await this.page.waitForFunction(() => {
      return document.readyState === 'complete';
    }, { timeout: 10000 });
    
    // Additional wait for React components to stabilize
    await this.page.waitForTimeout(500);
    
    this.logger.info('Page loaded successfully');
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotName = `${name}-${timestamp}`;
    await this.page.screenshot({ 
      path: `test-results/screenshots/${screenshotName}.png`, 
      fullPage: true 
    });
    this.logger.info(`Screenshot taken: ${screenshotName}.png`);
  }

  /**
   * Wait for element to be visible with better error handling
   */
  async waitForElement(selector: string, timeout: number = 10000): Promise<Locator> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible', timeout });
      return element;
    } catch (error) {
      this.logger.error(`Element not found: ${selector}`, error);
      // Take screenshot for debugging
      await this.takeScreenshot(`element-not-found-${selector.replace(/[^a-zA-Z0-9]/g, '_')}`);
      throw error;
    }
  }

  /**
   * Click element with React support
   */
  async clickElement(selector: string): Promise<void> {
    try {
      const element = await this.waitForElement(selector);
      
      // Scroll into view and ensure it's stable
      await element.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(100);
      
      // Click the element
      await element.click();
      
      // Wait for React to process the click
      await this.page.waitForTimeout(100);
      
      this.logger.info(`Clicked element: ${selector}`);
    } catch (error) {
      this.logger.error(`Failed to click element: ${selector}`, error);
      await this.takeScreenshot(`click-failed-${selector.replace(/[^a-zA-Z0-9]/g, '_')}`);
      throw error;
    }
  }

  /**
   * Fill input field with React support
   */
  async fillInput(selector: string, value: string): Promise<void> {
    try {
      const element = await this.waitForElement(selector);
      
      // Focus the element first
      await element.focus();
      
      // Clear the field
      await element.fill('');
      await this.page.waitForTimeout(100);
      
      // Fill with the new value
      await element.fill(value);
      
      // Trigger React events
      await element.dispatchEvent('change');
      await element.dispatchEvent('blur');
      
      this.logger.info(`Filled input ${selector} with: ${value}`);
    } catch (error) {
      this.logger.error(`Failed to fill input: ${selector}`, error);
      await this.takeScreenshot(`fill-failed-${selector.replace(/[^a-zA-Z0-9]/g, '_')}`);
      throw error;
    }
  }

  /**
   * Get text content of element
   */
  async getElementText(selector: string): Promise<string> {
    const element = await this.waitForElement(selector);
    const text = await element.textContent();
    return text || '';
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector: string, timeout: number = 5000): Promise<boolean> {
    try {
      await this.page.locator(selector).waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if element is enabled
   */
  async isElementEnabled(selector: string): Promise<boolean> {
    const element = this.page.locator(selector);
    return await element.isEnabled();
  }

  /**
   * Select option from dropdown
   */
  async selectOption(selector: string, option: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.selectOption(option);
    this.logger.info(`Selected option "${option}" from dropdown: ${selector}`);
  }

  /**
   * Wait for text to appear in element
   */
  async waitForText(selector: string, expectedText: string, timeout: number = 10000): Promise<void> {
    await expect(this.page.locator(selector)).toContainText(expectedText, { timeout });
    this.logger.info(`Text "${expectedText}" appeared in element: ${selector}`);
  }

  /**
   * Scroll element into view
   */
  async scrollToElement(selector: string): Promise<void> {
    const element = this.page.locator(selector);
    await element.scrollIntoViewIfNeeded();
    // Wait for scroll to complete
    await this.page.waitForTimeout(300);
    this.logger.info(`Scrolled to element: ${selector}`);
  }

  /**
   * Handle alert/confirm dialogs
   */
  async handleDialog(accept: boolean = true): Promise<void> {
    this.page.on('dialog', async dialog => {
      this.logger.info(`Dialog appeared: ${dialog.message()}`);
      if (accept) {
        await dialog.accept();
        this.logger.info('Dialog accepted');
      } else {
        await dialog.dismiss();
        this.logger.info('Dialog dismissed');
      }
    });
  }

  /**
   * Wait for URL to contain specific text
   */
  async waitForURLContains(text: string, timeout: number = 10000): Promise<void> {
    await this.page.waitForURL(url => url.href.includes(text), { timeout });
    this.logger.info(`URL now contains: ${text}`);
  }

  /**
   * Get current URL
   */
  getCurrentURL(): string {
    return this.page.url();
  }

  /**
   * Refresh the page
   */
  async refresh(): Promise<void> {
    await this.page.reload();
    await this.waitForPageLoad();
    this.logger.info('Page refreshed');
  }

  /**
   * Go back in browser history
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
    await this.waitForPageLoad();
    this.logger.info('Navigated back');
  }

  /**
   * Hover over element
   */
  async hoverElement(selector: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.hover();
    this.logger.info(`Hovered over element: ${selector}`);
  }

  /**
   * Double click element
   */
  async doubleClickElement(selector: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.dblclick();
    this.logger.info(`Double clicked element: ${selector}`);
  }

  /**
   * Right click element
   */
  async rightClickElement(selector: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.click({ button: 'right' });
    this.logger.info(`Right clicked element: ${selector}`);
  }

  /**
   * Press key
   */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
    this.logger.info(`Pressed key: ${key}`);
  }

  /**
   * Type text with delay
   */
  async typeText(text: string, delay: number = 100): Promise<void> {
    await this.page.keyboard.type(text, { delay });
    this.logger.info(`Typed text: ${text}`);
  }

  /**
   * Upload file
   */
  async uploadFile(selector: string, filePath: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.setInputFiles(filePath);
    this.logger.info(`Uploaded file: ${filePath} to ${selector}`);
  }

  /**
   * Switch to frame
   */
  async switchToFrame(frameSelector: string): Promise<any> {
    const frame = this.page.frameLocator(frameSelector);
    this.logger.info(`Switched to frame: ${frameSelector}`);
    return frame;
  }

  /**
   * Get element count
   */
  async getElementCount(selector: string): Promise<number> {
    const elements = this.page.locator(selector);
    const count = await elements.count();
    this.logger.info(`Element count for ${selector}: ${count}`);
    return count;
  }

  /**
   * Wait and click element by text
   */
  async clickElementByText(text: string, tag: string = '*'): Promise<void> {
    const element = this.page.locator(`${tag}:has-text("${text}")`);
    await element.waitFor({ state: 'visible' });
    await element.click();
    this.logger.info(`Clicked element with text: ${text}`);
  }

  /**
   * Assert element text
   */
  async assertElementText(selector: string, expectedText: string): Promise<void> {
    const element = this.page.locator(selector);
    await expect(element).toContainText(expectedText);
    this.logger.info(`Verified element ${selector} contains text: ${expectedText}`);
  }

  /**
   * Assert element visibility
   */
  async assertElementVisible(selector: string): Promise<void> {
    const element = this.page.locator(selector);
    await expect(element).toBeVisible();
    this.logger.info(`Verified element is visible: ${selector}`);
  }

  /**
   * Assert element not visible
   */
  async assertElementNotVisible(selector: string): Promise<void> {
    const element = this.page.locator(selector);
    await expect(element).not.toBeVisible();
    this.logger.info(`Verified element is not visible: ${selector}`);
  }

  /**
   * Assert element enabled
   */
  async assertElementEnabled(selector: string): Promise<void> {
    const element = this.page.locator(selector);
    await expect(element).toBeEnabled();
    this.logger.info(`Verified element is enabled: ${selector}`);
  }

  /**
   * Assert element disabled
   */
  async assertElementDisabled(selector: string): Promise<void> {
    const element = this.page.locator(selector);
    await expect(element).toBeDisabled();
    this.logger.info(`Verified element is disabled: ${selector}`);
  }
}