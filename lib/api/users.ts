'use server';

import { apiFetch } from './client';
import { ApiError } from './error';
import type { AppUser, UserUpdateInput, UsersListQuery, UsersListResponse } from '@/lib/types/user';

function rethrowWithMessage(err: unknown): never {
  if (err instanceof ApiError) {
    const body = err.body as { message?: string } | null;
    throw new Error(body?.message ?? `Error del servidor (${err.status})`);
  }
  throw err;
}

export async function listUsers(query: UsersListQuery = {}): Promise<UsersListResponse> {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.role) params.set('role', query.role);
  if (query.is_active !== undefined) params.set('is_active', String(query.is_active));
  const qs = params.toString();
  try {
    return await apiFetch<UsersListResponse>(`/api/users${qs ? '?' + qs : ''}`, {
      method: 'GET',
    });
  } catch (err) {
    rethrowWithMessage(err);
  }
}

export async function updateUser(id: string, body: UserUpdateInput): Promise<AppUser> {
  try {
    return await apiFetch<AppUser>(`/api/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  } catch (err) {
    rethrowWithMessage(err);
  }
}
