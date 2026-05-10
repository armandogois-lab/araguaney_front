'use server';

import { apiFetch } from './client';
import { ApiError } from './error';
import type { MerchantsListResponse } from '@/lib/types/merchant';

function rethrowWithMessage(err: unknown): never {
  if (err instanceof ApiError) {
    const body = err.body as { message?: string } | null;
    throw new Error(body?.message ?? `Error del servidor (${err.status})`);
  }
  throw err;
}

export interface ListMerchantsQuery {
  limit?: number;
  offset?: number;
  sort?: 'name_asc' | 'name_desc' | 'orders_desc';
}

export async function listMerchants(
  query: ListMerchantsQuery = {},
): Promise<MerchantsListResponse> {
  const params = new URLSearchParams();
  if (query.limit !== undefined) params.set('limit', String(query.limit));
  if (query.offset !== undefined) params.set('offset', String(query.offset));
  if (query.sort) params.set('sort', query.sort);
  const qs = params.toString();
  try {
    return await apiFetch<MerchantsListResponse>(`/api/merchants${qs ? '?' + qs : ''}`, {
      method: 'GET',
    });
  } catch (err) {
    rethrowWithMessage(err);
  }
}
