import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 4 : 2,
  timeout: 60_000,
  expect: { timeout: 10_000 },

  reporter: [
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['junit', { outputFile: 'reports/junit/results.xml' }],
    ['list'],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    screenshot: 'only-on-failure',
    video:      'retain-on-failure',
    trace:      'retain-on-failure',
    // SauceDemo uses data-test attribute, not data-testid
    testIdAttribute: 'data-test',
  },

  projects: [
    {
      name:      'setup',
      testDir:   './src/fixtures',
      testMatch: 'auth.setup.ts',
    },
    {
      name: 'chromium',
      use:  { ...devices['Desktop Chrome'], storageState: 'auth-state/user.json' },
      dependencies: ['setup'],
      testMatch: ['ui/**/*.spec.ts', 'integration/**/*.spec.ts'],
    },
    {
      name: 'firefox',
      use:  { ...devices['Desktop Firefox'], storageState: 'auth-state/user.json' },
      dependencies: ['setup'],
      testMatch: ['ui/**/*.spec.ts'],
    },
    {
      name: 'webkit',
      use:  { ...devices['Desktop Safari'], storageState: 'auth-state/user.json' },
      dependencies: ['setup'],
      testMatch: ['ui/**/*.spec.ts'],
    },
    {
      name: 'api',
      use:  { ...devices['Desktop Chrome'] },
      testMatch: ['api/**/*.spec.ts'],
    },
  ],

  outputDir: 'reports/test-results',
});