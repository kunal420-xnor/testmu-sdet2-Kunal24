import { test as setup } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const AUTH_FILE = path.resolve('auth-state/user.json');

setup('authenticate as standard user', async ({ page }) => {
  const dir = path.dirname(AUTH_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  await page.goto('https://www.saucedemo.com/', { timeout: 60_000 });

  // SauceDemo uses data-test (not data-testid) — use id selectors as fallback
  await page.locator('#user-name').waitFor({ state: 'visible', timeout: 60_000 });
  await page.locator('#user-name').fill(process.env.STANDARD_USER ?? 'standard_user');
  await page.locator('#password').fill(process.env.STANDARD_PASSWORD ?? 'secret_sauce');
  await page.locator('#login-button').click();
  await page.waitForURL(/\/inventory/, { timeout: 15_000 });

  await page.context().storageState({ path: AUTH_FILE });
  console.log('  ✅ Auth state saved');
});