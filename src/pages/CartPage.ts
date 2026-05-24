import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly cartItems      = () => this.locator('.cart_item');
  private readonly checkoutButton = () => this.getByTestId('checkout');
  private readonly continueButton = () => this.getByTestId('continue-shopping');
  private readonly pageTitle      = () => this.locator('.title');

  async goto(): Promise<void> { await this.navigate('/cart.html'); }

  async checkout(): Promise<void> {
    await this.click(this.checkoutButton());
  }

  async continueShopping(): Promise<void> {
    await this.click(this.continueButton());
  }

  async assertOnCartPage(): Promise<void> {
    await this.assertURL(/\/cart/);
    await this.assertText(this.pageTitle(), 'Your Cart');
  }

  async assertItemInCart(itemName: string): Promise<void> {
    await this.assertVisible(this.cartItems().filter({ hasText: itemName }));
  }

  async assertCartEmpty(): Promise<void> {
    await expect(this.cartItems()).toHaveCount(0);
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems().count();
  }
}