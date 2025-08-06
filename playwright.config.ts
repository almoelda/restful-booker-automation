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

    use: {
    browserName: "chromium",
    baseURL: "https://automationintesting.online",
    bypassCSP: true,
    screenshot: "only-on-failure",
    video: "on",
    launchOptions: {
      args: ["--disable-web-security"],
    },
  },

  outputDir: "test-results/",
});
