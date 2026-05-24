import { APIRequestContext } from '@playwright/test';
import { BaseApiClient, ApiResponse } from './BaseApiClient';

export interface User {
  id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
}

export interface UserListResponse {
  page: number;
  per_page: number;
  total: number;
  data: User[];
}

export class UsersApiClient extends BaseApiClient {
  constructor(request: APIRequestContext) { super(request); }

  async listUsers(page = 1): Promise<ApiResponse<UserListResponse>> {
    return this.get<UserListResponse>(`/users?page=${page}`);
  }

  async getUser(id: number): Promise<ApiResponse<{ data: User }>> {
    return this.get<{ data: User }>(`/users/${id}`);
  }

  async createUser(name: string, job: string): Promise<ApiResponse<{ id: string; name: string; job: string; createdAt: string }>> {
    return this.post(`/users`, { name, job });
  }

  async updateUser(id: number, name: string, job: string): Promise<ApiResponse<{ name: string; job: string; updatedAt: string }>> {
    return this.put(`/users/${id}`, { name, job });
  }

  async deleteUser(id: number): Promise<ApiResponse<unknown>> {
    return this.delete(`/users/${id}`);
  }

  async loginUser(email: string, password: string): Promise<ApiResponse<{ token?: string; error?: string }>> {
    return this.post('/login', { email, password });
  }
}