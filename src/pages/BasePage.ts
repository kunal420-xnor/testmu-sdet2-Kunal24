import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) { this.page = page; }

  async navigate(path = ''): Promise<void> {
    await this.page.goto(path);
  }

  protected locator(selector: string): Locator       { return this.page.locator(selector); }
  protected getByTestId(id: string): Locator          { return this.page.getByTestId(id); }
  protected getByRole(role: Parameters<Page['getByRole']>[0], opts?: Parameters<Page['getByRole']>[1]): Locator {
    return this.page.getByRole(role, opts);
  }

  async click(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async fill(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.clear();
    await locator.fill(value);
  }

  async retryAction<T>(action: () => Promise<T>, attempts = 3, delay = 500): Promise<T> {
    let last!: Error;
    for (let i = 0; i < attempts; i++) {
      try { return await action(); }
      catch (e) { last = e as Error; await this.page.waitForTimeout(delay); }
    }
    throw last;
  }

  async assertVisible(locator: Locator, msg?: string): Promise<void> {
    await expect(locator, msg).toBeVisible();
  }

  async assertText(locator: Locator, text: string): Promise<void> {
    await expect(locator).toContainText(text);
  }

  async assertURL(pattern: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(pattern);
  }
}