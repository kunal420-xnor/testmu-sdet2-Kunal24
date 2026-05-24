import { APIRequestContext, APIResponse } from '@playwright/test';

export interface ApiResponse<T = unknown> {
  status: number;
  body: T;
  responseTimeMs: number;
}

export class BaseApiClient {
  protected readonly request: APIRequestContext;
  protected readonly baseUrl: string;

  constructor(request: APIRequestContext, baseUrl?: string) {
    this.request = request;
    this.baseUrl = baseUrl ?? process.env.API_BASE_URL ?? 'https://reqres.in/api';
  }

  protected headers(): Record<string, string> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (process.env.REQRES_API_KEY) {
      headers['x-api-key'] = process.env.REQRES_API_KEY;
    }
    return headers;
  }

  async get<T>(path: string): Promise<ApiResponse<T>> {
    const start = Date.now();
    const res = await this.request.get(`${this.baseUrl}${path}`, { headers: this.headers() });
    return { status: res.status(), body: await res.json().catch(() => ({} as T)), responseTimeMs: Date.now() - start };
  }

  async post<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
    const start = Date.now();
    const res = await this.request.post(`${this.baseUrl}${path}`, { headers: this.headers(), data: body });
    return { status: res.status(), body: await res.json().catch(() => ({} as T)), responseTimeMs: Date.now() - start };
  }

  async put<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
    const start = Date.now();
    const res = await this.request.put(`${this.baseUrl}${path}`, { headers: this.headers(), data: body });
    return { status: res.status(), body: await res.json().catch(() => ({} as T)), responseTimeMs: Date.now() - start };
  }

  async delete<T>(path: string): Promise<ApiResponse<T>> {
    const start = Date.now();
    const res = await this.request.delete(`${this.baseUrl}${path}`, { headers: this.headers() });
    const body = res.status() === 204 ? {} as T : await res.json().catch(() => ({} as T));
    return { status: res.status(), body, responseTimeMs: Date.now() - start };
  }

  assertStatus(res: ApiResponse, expected: number): void {
    if (res.status !== expected)
      throw new Error(`Expected ${expected}, got ${res.status}.\nBody: ${JSON.stringify(res.body, null, 2)}`);
  }

  assertResponseTime(res: ApiResponse, maxMs: number): void {
    if (res.responseTimeMs > maxMs)
      throw new Error(`Response time ${res.responseTimeMs}ms > limit ${maxMs}ms`);
  }
}