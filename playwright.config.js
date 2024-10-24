// @ts-check
import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  testDir: './test',
  fullyParallel: true,
  use: {
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: {
      'Authorization': `Basic ${process.env.API_TOKEN}`
    }
  },

  projects: [
    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop Chrome'] },
    // },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ]
});

