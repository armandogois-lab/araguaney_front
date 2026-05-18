'use server';

import { apiFetch } from './client';
import { ApiError } from './error';
import type { MerchantDetail, MerchantsListResponse } from '@/lib/types/merchant';

function rethrowWithMessage(err: unknown): never {
  if (err instanceof ApiError) {
    const body = err.body as { message?: string } | null;
    throw new Error(body?.message ?? `Error del servidor (${err.status})`);
  }
  throw err;
}

export interface ListMerchantsQuery {
  q?: string;
  sort?: 'name_asc' | 'name_desc' | 'last_seen_desc';
  limit?: number;
  offset?: number;
}

export async function listMerchants(
  query: ListMerchantsQuery = {},
): Promise<MerchantsListResponse> {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.sort) params.set('sort', query.sort);
  if (query.limit !== undefined) params.set('limit', String(query.limit));
  if (query.offset !== undefined) params.set('offset', String(query.offset));
  const qs = params.toString();
  try {
    return await apiFetch<MerchantsListResponse>(`/api/merchants${qs ? '?' + qs : ''}`, {
      method: 'GET',
    });
  } catch (err) {
    rethrowWithMessage(err);
  }
}

export async function getMerchantDetail(id: string): Promise<MerchantDetail> {
  try {
    return await apiFetch<MerchantDetail>(`/api/merchants/${id}`, { method: 'GET' });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) throw err;
    rethrowWithMessage(err);
  }
}
