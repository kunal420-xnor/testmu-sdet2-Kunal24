import { test, expect } from '../../src/fixtures/index';
import { SchemaValidator, userSchema, userListSchema } from '../../src/utils/SchemaValidator';

const SLA_MS = 3000;

test.describe('Users API (reqres.in)', () => {

  // ── Auth ──────────────────────────────────────────────────────────

  test('TC-API-AUTH-001: Login with valid credentials returns token', async ({ usersApi }) => {
    const res = await usersApi.loginUser('eve.holt@reqres.in', 'cityslicka');
    usersApi.assertStatus(res, 200);
    expect((res.body as { token: string }).token).toBeTruthy();
  });

  test('TC-API-AUTH-002: Login without password returns 400 error', async ({ usersApi }) => {
    const res = await usersApi.loginUser('eve.holt@reqres.in', '');
    usersApi.assertStatus(res, 400);
    expect((res.body as { error: string }).error).toBeTruthy();
  });

  // ── READ ──────────────────────────────────────────────────────────

  test('TC-API-READ-001: List users returns valid schema', async ({ usersApi }) => {
    const res = await usersApi.listUsers(1);
    usersApi.assertStatus(res, 200);
    usersApi.assertResponseTime(res, SLA_MS);
    SchemaValidator.validate(res.body, userListSchema, 'User List');
    expect((res.body as { total: number }).total).toBeGreaterThan(0);
  });

  test('TC-API-READ-002: Get single user returns valid schema', async ({ usersApi }) => {
    const res = await usersApi.getUser(2);
    usersApi.assertStatus(res, 200);
    usersApi.assertResponseTime(res, SLA_MS);
    SchemaValidator.validate(res.body, userSchema, 'Get User');
  });

  test('TC-API-READ-003: Get non-existent user returns 404', async ({ usersApi }) => {
    const res = await usersApi.getUser(999);
    usersApi.assertStatus(res, 404);
  });

  // ── CREATE ────────────────────────────────────────────────────────

  test('TC-API-CREATE-001: Create user returns 201 with id and createdAt', async ({ usersApi }) => {
    const res = await usersApi.createUser('Kunal Singh', 'SDET-2');
    usersApi.assertStatus(res, 201);
    usersApi.assertResponseTime(res, SLA_MS);
    const body = res.body as { id: string; createdAt: string };
    expect(body.id).toBeTruthy();
    expect(body.createdAt).toBeTruthy();
    console.log(`  ✅ Created user ID: ${body.id}`);
  });

  // ── UPDATE ────────────────────────────────────────────────────────

  test('TC-API-UPDATE-001: Update user returns 200 with updatedAt', async ({ usersApi }) => {
    const res = await usersApi.updateUser(2, 'Kunal Updated', 'Senior SDET');
    usersApi.assertStatus(res, 200);
    const body = res.body as { updatedAt: string };
    expect(body.updatedAt).toBeTruthy();
  });

  // ── DELETE ────────────────────────────────────────────────────────

  test('TC-API-DELETE-001: Delete user returns 204', async ({ usersApi }) => {
    const res = await usersApi.deleteUser(2);
    usersApi.assertStatus(res, 204);
  });

  // ── Performance ───────────────────────────────────────────────────

  test('TC-API-PERF-001: User list response within 3s SLA', async ({ usersApi }) => {
    const res = await usersApi.listUsers(1);
    usersApi.assertResponseTime(res, SLA_MS);
    console.log(`  ⏱ ${res.responseTimeMs}ms`);
  });
});