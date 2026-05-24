import { test, expect } from '../../src/fixtures/index';
import { TestDataLoader } from '../../src/utils/TestDataLoader';

const { checkoutInfo } = TestDataLoader.loadJson<{
  checkoutInfo: { firstName: string; lastName: string; postalCode: string };
}>('inventoryData.json');

/**
 * Integration Tests
 * Full end-to-end flows combining multiple page layers.
 */
test.describe('Integration: Full User Flows', () => {

  test('TC-INT-001: Complete purchase flow — login to order confirmation @smoke', async ({
    page, inventoryPage, cartPage, checkoutPage,
  }) => {
    // Step 1: Already logged in via storageState — go to inventory
    await inventoryPage.goto();
    await inventoryPage.assertOnInventoryPage();

    // Step 2: Add two items to cart
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    await inventoryPage.assertCartCount(2);
    console.log('  ✅ Added 2 items to cart');

    // Step 3: Go to cart and verify items
    await inventoryPage.goToCart();
    await cartPage.assertOnCartPage();
    await cartPage.assertItemInCart('Sauce Labs Backpack');
    await cartPage.assertItemInCart('Sauce Labs Bike Light');
    console.log('  ✅ Cart verified');

    // Step 4: Checkout
    await cartPage.checkout();
    await checkoutPage.fillShippingInfo(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);
    await checkoutPage.continue();

    // Step 5: Verify order summary
    await expect(page).toHaveURL(/\/checkout-step-two/);
    await expect(page.locator('.summary_total_label')).toBeVisible();
    console.log('  ✅ Order summary visible');

    // Step 6: Finish and confirm
    await checkoutPage.finish();
    await checkoutPage.assertOrderComplete();
    console.log('  ✅ Order complete!');
  });

  test('TC-INT-002: Cart persists items across page navigation', async ({
    inventoryPage, cartPage, page,
  }) => {
    // Add items
    await inventoryPage.goto();
    await inventoryPage.addItemToCart('Sauce Labs Fleece Jacket');
    await inventoryPage.assertCartCount(1);

    // Navigate away and back
    await page.goto('/about');
    await inventoryPage.goto();

    // Cart badge should still show 1
    await inventoryPage.assertCartCount(1);

    // Verify item still in cart
    await inventoryPage.goToCart();
    await cartPage.assertItemInCart('Sauce Labs Fleece Jacket');
    console.log('  ✅ Cart persisted across navigation');
  });
});