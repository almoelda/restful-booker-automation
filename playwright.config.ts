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
    video: 'retain-on-failure',
    
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
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    {
      name: 'UI Tests - Firefox',
      testMatch: /.*\/ui\/.*\.spec\.ts/,
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    {
      name: 'UI Tests - Safari',
      testMatch: /.*\/ui\/.*\.spec\.ts/,
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Mobile testing
    {
      name: 'Mobile Chrome',
      testMatch: /.*\/ui\/.*\.spec\.ts/,
      use: { ...devices['Pixel 5'] },
    },

    {
      name: 'Mobile Safari',
      testMatch: /.*\/ui\/.*\.spec\.ts/,
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Output directory for test artifacts
  outputDir: 'test-results/',
  
  // Global setup and teardown
  globalSetup: require.resolve('./utils/global-setup.ts'),
  globalTeardown: require.resolve('./utils/global-teardown.ts'),
});