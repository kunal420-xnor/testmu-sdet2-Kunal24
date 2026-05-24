import { test, expect } from '../../src/fixtures/index';

test.describe('Cart', () => {

  test('TC-CART-001: Cart is empty by default @smoke', async ({ cartPage }) => {
    await cartPage.goto();
    await cartPage.assertOnCartPage();
    await cartPage.assertCartEmpty();
  });

  test('TC-CART-002: Item added from inventory appears in cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.assertItemInCart('Sauce Labs Backpack');
  });

  test('TC-CART-003: Multiple items appear in cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    await inventoryPage.goToCart();
    expect(await cartPage.getCartItemCount()).toBe(2);
  });

  test('TC-CART-004: Continue shopping returns to inventory', async ({ cartPage, page }) => {
    await cartPage.goto();
    await cartPage.continueShopping();
    await expect(page).toHaveURL(/\/inventory/);
  });
});