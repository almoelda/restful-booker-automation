import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default defineConfig({
  testDir: './tests',
  
  // Global timeout for each test
  timeout: 30 * 1000,
  
  // Global timeout for expect assertions
  expect: {
    timeout: 10 * 1000,
  },
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],
  
  // Global test configuration
  use: {
    // Base URL for UI tests
    baseURL: process.env.BASE_URL || 'https://automationintesting.online',
    
    // Capture screenshot on failure
    screenshot: 'only-on-failure',
    
    // Record video on retry
    video: 'on',
    
    // Record trace on retry
    trace: 'on-first-retry',
    
    // API testing configuration
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },

  // Test projects for different browsers and test types
  projects: [
    // API Tests - run on Chromium only for speed
    {
      name: 'API Tests',
      testMatch: /.*\/api\/.*\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: process.env.API_BASE_URL || 'https://automationintesting.online',
      },
      

    },

    // UI Tests - Multiple browsers
    {
      name: 'UI Tests - Chrome',
      testMatch: /.*\/ui\/.*\.spec\.ts/,
      use: {
        browserName: 'chromium',
        video: 'on',
        headless: true,
        viewport: { width: 1366, height: 768 },
        bypassCSP: true,
        launchOptions: {
            args: ['--disable-web-security'],
        },
        baseURL: process.env.API_BASE_URL || 'https://automationintesting.online',
      },
    },


  ],
  
  outputDir: 'test-results/',
  
  globalSetup: require.resolve('./utils/global-setup.ts'),
});