import { test as base } from '@playwright/test';
import { LoginPage }     from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage }      from '../pages/CartPage';
import { CheckoutPage }  from '../pages/CheckoutPage';
import { UsersApiClient } from '../api/UsersApiClient';

type Fixtures = {
  loginPage:     LoginPage;
  inventoryPage: InventoryPage;
  cartPage:      CartPage;
  checkoutPage:  CheckoutPage;
  usersApi:      UsersApiClient;
};

export const test = base.extend<Fixtures>({
  loginPage:     async ({ page }, use) => { await use(new LoginPage(page)); },
  inventoryPage: async ({ page }, use) => { await use(new InventoryPage(page)); },
  cartPage:      async ({ page }, use) => { await use(new CartPage(page)); },
  checkoutPage:  async ({ page }, use) => { await use(new CheckoutPage(page)); },
  usersApi:      async ({ request }, use) => { await use(new UsersApiClient(request)); },
});

export { expect } from '@playwright/test';