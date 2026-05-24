import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  private readonly firstNameInput  = () => this.getByTestId('firstName');
  private readonly lastNameInput   = () => this.getByTestId('lastName');
  private readonly postalCodeInput = () => this.getByTestId('postalCode');
  private readonly continueButton  = () => this.getByTestId('continue');
  private readonly finishButton    = () => this.getByTestId('finish');
  private readonly confirmHeader   = () => this.locator('.complete-header');
  private readonly errorMessage    = () => this.locator('[data-test="error"]');
  private readonly summaryTotal    = () => this.locator('.summary_total_label');

  async fillShippingInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fill(this.firstNameInput(), firstName);
    await this.fill(this.lastNameInput(), lastName);
    await this.fill(this.postalCodeInput(), postalCode);
  }

  async continue(): Promise<void> { await this.click(this.continueButton()); }
  async finish(): Promise<void>   { await this.click(this.finishButton()); }

  async assertOrderComplete(): Promise<void> {
    await this.assertText(this.confirmHeader(), 'Thank you for your order');
  }

  async assertCheckoutError(text: string): Promise<void> {
    await this.assertText(this.errorMessage(), text);
  }

  async getOrderTotal(): Promise<string> {
    return (await this.summaryTotal().textContent()) ?? '';
  }
}