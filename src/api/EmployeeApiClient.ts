import { APIRequestContext } from '@playwright/test';
import { BaseApiClient, ApiResponse } from './BaseApiClient';

export interface Employee {
  empNumber?: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  employeeId?: string;
}

export interface EmployeeListResponse {
  data: Employee[];
  meta: { total: number; offset: number; limit: number };
}

export class EmployeeApiClient extends BaseApiClient {
  private readonly basePath = '/pim/employees';

  constructor(request: APIRequestContext, authToken?: string) {
    super(request);
    if (authToken) this.setAuthToken(authToken);
  }

  async createEmployee(data: Employee): Promise<ApiResponse<{ data: Employee }>> {
    return this.post<{ data: Employee }>(this.basePath, {
      firstName: data.firstName,
      middleName: data.middleName ?? '',
      lastName: data.lastName,
      employeeId: data.employeeId ?? '',
    });
  }

  async getEmployee(empNumber: number): Promise<ApiResponse<{ data: Employee }>> {
    return this.get<{ data: Employee }>(`${this.basePath}/${empNumber}`);
  }

  async listEmployees(params?: { limit?: number; offset?: number }): Promise<ApiResponse<EmployeeListResponse>> {
    return this.get<EmployeeListResponse>(this.basePath, params as Record<string, number>);
  }

  // Correct endpoint: /pim/employees/count (not /employee/count)
  async getEmployeeCount(): Promise<ApiResponse<{ data: { count: number } }>> {
    return this.get<{ data: { count: number } }>('/pim/employees/count');
  }

  async deleteEmployees(empNumbers: number[]): Promise<ApiResponse<unknown>> {
    const start = Date.now();
    const response = await this.request.delete(`${this.baseUrl}${this.basePath}`, {
      headers: this.buildHeaders(),
      data: { ids: empNumbers },
    });
    const body = await response.json().catch(() => ({}));
    return { status: response.status(), body, headers: response.headers() as Record<string, string>, responseTimeMs: Date.now() - start };
  }
}