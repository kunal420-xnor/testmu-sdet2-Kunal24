import { test, expect } from '../../src/fixtures/index';
import { TestDataLoader } from '../../src/utils/TestDataLoader';

const { invalidUsers } = TestDataLoader.loadJson<{
  validUsers: { username: string; password: string; description: string }[];
  invalidUsers: { username: string; password: string; expectedError: string }[];
}>('loginData.json');

test.describe('Login', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#user-name').waitFor({ state: 'visible', timeout: 15_000 });
  });

  test('TC-LOGIN-001: Standard user can log in @smoke', async ({ loginPage }) => {
    await loginPage.loginAsStandard();
    await loginPage.assertLoginSuccess();
  });

  test('TC-LOGIN-002: Locked out user sees error message', async ({ loginPage }) => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    await loginPage.assertLoginError('Sorry, this user has been locked out');
  });

  for (const user of invalidUsers) {
    test(`TC-LOGIN-NEG: ${user.expectedError}`, async ({ loginPage }) => {
      await loginPage.login(user.username, user.password);
      await loginPage.assertLoginError(user.expectedError);
    });
  }

  test('TC-LOGIN-003: Login page loads on all browsers @smoke @cross-browser', async ({ page }) => {
    await expect(page.locator('#login-button')).toBeVisible();
    await expect(page).toHaveTitle(/Swag Labs/);
  });
});