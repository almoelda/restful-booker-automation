import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["json", { outputFile: "test-results/results.json" }],
    ["list"],
  ],

  projects: [
    // API Tests
    {
      name: "API Tests",
      testMatch: /.*\/api\/.*\.spec\.ts/,
      use: {
        baseURL:
          process.env.API_BASE_URL || "https://automationintesting.online",
      },
    },

    // UI Tests
    {
      name: "UI Tests - Chrome",
      testMatch: /.*\/ui\/.*\.spec\.ts/,
      use: {
        browserName: "chromium",
        bypassCSP: true,
        launchOptions: {
          args: ["--disable-web-security"],
        },
        baseURL:
          process.env.API_BASE_URL || "https://automationintesting.online",
        screenshot: "only-on-failure",
        video: "on",
      },
    },
  ],

  outputDir: "test-results/",
});
