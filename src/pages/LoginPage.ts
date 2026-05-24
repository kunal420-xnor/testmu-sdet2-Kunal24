import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // SauceDemo uses data-test attribute (configured as testIdAttribute in playwright.config.ts)
  private readonly usernameInput = () => this.page.locator('#user-name');
  private readonly passwordInput = () => this.page.locator('#password');
  private readonly loginButton   = () => this.page.locator('#login-button');
  private readonly errorMessage  = () => this.page.locator('[data-test="error"]');

  async goto(): Promise<void> { await this.navigate('/'); }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput().waitFor({ state: 'visible', timeout: 15_000 });
    await this.fill(this.usernameInput(), username);
    await this.fill(this.passwordInput(), password);
    await this.click(this.loginButton());
  }

  async loginAsStandard(): Promise<void> {
    await this.login(
      process.env.STANDARD_USER     ?? 'standard_user',
      process.env.STANDARD_PASSWORD ?? 'secret_sauce'
    );
  }

  async assertOnLoginPage(): Promise<void> {
    await this.assertVisible(this.loginButton());
  }

  async assertLoginError(text: string): Promise<void> {
    await this.assertVisible(this.errorMessage());
    await this.assertText(this.errorMessage(), text);
  }

  async assertLoginSuccess(): Promise<void> {
    await this.assertURL(/\/inventory/);
  }
}