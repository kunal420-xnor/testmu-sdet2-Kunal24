# AI Usage Log

| Tool | Task | Output |
|---|---|---|
| Claude (claude.ai) | Architecture design | Folder structure, app selection, design decisions |
| Claude (claude.ai) | Page Object Model | BasePage, LoginPage, InventoryPage, CartPage, CheckoutPage |
| Claude (claude.ai) | API client layer | BaseApiClient, UsersApiClient (reqres.in) |
| Claude (claude.ai) | Utilities | SchemaValidator (AJV), TestDataLoader |
| Claude (claude.ai) | Test fixtures | auth.setup.ts, DI fixture with all page objects |
| Claude (claude.ai) | Test files | All UI, API, and integration specs |
| Claude (claude.ai) | CI pipeline | GitHub Actions with 2-shard parallel run |
| Claude (claude.ai) | Documentation | README, test-strategy, this file |

## Design Decisions I Owned
- Chose SauceDemo over OrangeHRM for UI (stable selectors, fast, purpose-built)
- Chose ReqRes for API (real CRUD API, no auth complexity, reliable)
- Per-layer test files (login/inventory/cart/checkout) instead of one big spec
- storageState for auth — login once, reuse across all tests
- data-testid selectors everywhere (SauceDemo provides them natively)
