import { test, expect } from '../../src/fixtures/index';
import { TestDataLoader } from '../../src/utils/TestDataLoader';

const { items, sortOptions } = TestDataLoader.loadJson<{
  items: string[];
  sortOptions: { value: string; description: string; expectAscending: boolean }[];
}>('inventoryData.json');

test.describe('Inventory', () => {

  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('TC-INV-001: Inventory page shows all 6 products @smoke', async ({ inventoryPage }) => {
    await inventoryPage.assertOnInventoryPage();
    expect(await inventoryPage.getItemCount()).toBe(6);
  });

  test('TC-INV-002: All expected products are listed', async ({ inventoryPage }) => {
    const names = await inventoryPage.getItemNames();
    for (const item of items) {
      expect(names).toContain(item);
    }
  });

  test('TC-INV-003: Add single item to cart updates badge', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.assertCartCount(1);
  });

  test('TC-INV-004: Add multiple items updates cart badge correctly', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    await inventoryPage.assertCartCount(2);
  });

  test('TC-INV-005: Remove item from cart updates badge', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.assertCartCount(1);
    await inventoryPage.removeItemFromCart('Sauce Labs Backpack');
    await inventoryPage.assertCartCount(0);
  });

  for (const sort of sortOptions) {
    test(`TC-INV-SORT: Sort by ${sort.description}`, async ({ inventoryPage }) => {
      await inventoryPage.sortBy(sort.value);

      if (sort.value === 'az' || sort.value === 'za') {
        const names = await inventoryPage.getItemNames();
        const sorted = [...names].sort();
        if (sort.expectAscending) {
          expect(names).toEqual(sorted);
        } else {
          expect(names).toEqual(sorted.reverse());
        }
      } else {
        const prices = await inventoryPage.getItemPrices();
        const sorted = [...prices].sort((a, b) => a - b);
        if (sort.expectAscending) {
          expect(prices).toEqual(sorted);
        } else {
          expect(prices).toEqual(sorted.reverse());
        }
      }
    });
  }
});