# Test Strategy

## Why SauceDemo + ReqRes?

**SauceDemo** (`saucedemo.com`) is purpose-built for automation testing. It has `data-testid` attributes on every interactive element, stable selectors, fast page loads, and covers a realistic e-commerce flow. This lets the framework demonstrate POM, data-driven tests, and cross-browser coverage without fighting flaky selectors.

**ReqRes** (`reqres.in`) is a stable public REST API with full CRUD, authentication, and consistent response schemas. It lets the API layer demonstrate real assertions — status codes, schema validation, response time SLAs — without depending on a backend we don't control.

## Coverage Rationale

### UI Tests
- **Login** — Entry point to the app. Covers happy path, locked user (business rule), all empty-field permutations (data-driven), and cross-browser smoke.
- **Inventory** — Core product page. Covers item count, add/remove cart, and all 4 sort options (data-driven).
- **Cart** — Covers empty state, adding items, multiple items, and navigation.
- **Checkout** — Covers form validation, complete happy path, and order summary.

### API Tests
- Full CRUD on `/users` — Create, Read (list + single), Update, Delete
- Authentication — valid login returns token, missing password returns 400
- Schema validation — AJV validates response structure
- 404 error handling — non-existent resource
- Response time SLA — all endpoints asserted under 3000ms

### Integration Tests
- **Full purchase flow** — Login → add items → cart → checkout → order confirmation. The highest-value test.
- **Cart persistence** — Verifies cart state survives page navigation.

## Top 3 Risks

### Risk 1: SauceDemo resets between sessions
Cart state is stored in browser session. Tests that depend on previous state must set up their own state — each test is self-contained.
**Mitigation:** Every test navigates to the right page and adds items fresh. No cross-test dependencies.

### Risk 2: ReqRes rate limiting
ReqRes is a public API that may rate-limit heavy usage.
**Mitigation:** API tests are lean (one call per test). If rate-limited, tests fail with a clear 429 status rather than a confusing assertion error.

### Risk 3: storageState expiry in CI
The saved browser session (`auth-state/user.json`) is created fresh on every CI run. If setup fails, all dependent tests skip.
**Mitigation:** Setup has retries. The `dependencies: ['setup']` config in Playwright ensures tests never run without a valid session.

## What to Cover Next
1. Visual regression tests on the inventory page
2. Mobile viewport tests (Pixel 5, iPhone 12)
3. Network interception — mock slow API responses
4. Accessibility tests with axe-playwright
5. Performance — Lighthouse scores on key pages
