import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  private readonly inventoryItems  = () => this.locator('.inventory_item');
  private readonly cartBadge       = () => this.locator('.shopping_cart_badge');
  private readonly cartLink        = () => this.locator('.shopping_cart_link');
  private readonly sortDropdown    = () => this.locator('[data-test="product-sort-container"]');
  private readonly pageTitle       = () => this.locator('.title');
  private readonly burgerMenu      = () => this.getByRole('button', { name: 'Open Menu' });
  private readonly logoutLink      = () => this.locator('#logout_sidebar_link');

  async goto(): Promise<void> { await this.navigate('/inventory.html'); }

  async addItemToCart(itemName: string): Promise<void> {
    const item = this.inventoryItems().filter({ hasText: itemName });
    await item.getByRole('button', { name: /add to cart/i }).click();
  }

  async removeItemFromCart(itemName: string): Promise<void> {
    const item = this.inventoryItems().filter({ hasText: itemName });
    await item.getByRole('button', { name: /remove/i }).click();
  }

  async sortBy(option: string): Promise<void> {
    await this.sortDropdown().selectOption(option);
  }

  async goToCart(): Promise<void> {
    await this.click(this.cartLink());
  }

  async logout(): Promise<void> {
    await this.click(this.burgerMenu());
    await this.click(this.logoutLink());
  }

  async assertOnInventoryPage(): Promise<void> {
    await this.assertURL(/\/inventory/);
    await this.assertText(this.pageTitle(), 'Products');
  }

  async assertCartCount(count: number): Promise<void> {
    if (count === 0) {
      await expect(this.cartBadge()).not.toBeVisible();
    } else {
      await expect(this.cartBadge()).toHaveText(String(count));
    }
  }

  async getItemCount(): Promise<number> {
    return this.inventoryItems().count();
  }

  async getItemNames(): Promise<string[]> {
    return this.locator('.inventory_item_name').allTextContents();
  }

  async getItemPrices(): Promise<number[]> {
    const texts = await this.locator('.inventory_item_price').allTextContents();
    return texts.map(t => parseFloat(t.replace('$', '')));
  }
}