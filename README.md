# testmu-sdet2-Kunal24

> SDET-2 Quality Engineering Assessment — Playwright + TypeScript

## Target Applications
- **UI Tests:** [SauceDemo](https://www.saucedemo.com) — purpose-built automation demo app
- **API Tests:** [ReqRes](https://reqres.in) — stable public REST API

## Quick Start

```bash
npm install
npx playwright install --with-deps
cp .env.example .env
npx playwright test
npx playwright show-report reports/html
```

## Architecture

```
src/pages/          BasePage, LoginPage, InventoryPage, CartPage, CheckoutPage
src/api/            BaseApiClient, UsersApiClient
src/utils/          SchemaValidator, TestDataLoader
src/fixtures/       auth.setup.ts, index.ts (DI fixture)
src/data/           loginData.json, inventoryData.json
tests/ui/           login, inventory, cart, checkout specs
tests/api/          users-api spec (CRUD, auth, schema, perf)
tests/integration/  Full checkout flow, cart persistence
.github/workflows/  GitHub Actions CI with sharding
```

## Test Coverage

| Layer | Tests | What's covered |
|---|---|---|
| UI — Login | 7 | Valid login, locked user, empty fields, cross-browser |
| UI — Inventory | 8 | Product count, add/remove cart, all 4 sort options |
| UI — Cart | 4 | Empty cart, add items, multiple items, continue shopping |
| UI — Checkout | 4 | Form validation, complete flow, order summary |
| API | 8 | Auth, CRUD, schema validation, 404, response time SLA |
| Integration | 2 | Full purchase flow, cart persistence |

## Run Commands

| Command | What it runs |
|---|---|
| `npm test` | All tests, all browsers |
| `npm run test:ui` | UI tests only |
| `npm run test:api` | API tests only |
| `npm run test:integration` | Integration tests only |
| `npm run test:smoke` | @smoke tagged tests |
| `npm run test:headed` | Watch tests run live |
| `npm run report` | Open HTML report |