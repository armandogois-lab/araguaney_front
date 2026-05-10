'use server';

import { apiFetch } from './client';
import { ApiError } from './error';
import type { OrdersListResponse, OrdersStats, OrderStatus } from '@/lib/types/order';

function rethrowWithMessage(err: unknown): never {
  if (err instanceof ApiError) {
    const body = err.body as { message?: string } | null;
    throw new Error(body?.message ?? `Error del servidor (${err.status})`);
  }
  throw err;
}

export interface ListOrdersQuery {
  limit?: number;
  offset?: number;
  status?: OrderStatus;
  merchant_id?: string;
  max_due_date_lte?: string;
  q?: string;
  sort?: 'purchase_date_desc' | 'purchase_date_asc' | 'max_due_date_asc' | 'max_due_date_desc';
}

export async function listOrders(query: ListOrdersQuery = {}): Promise<OrdersListResponse> {
  const params = new URLSearchParams();
  if (query.limit !== undefined) params.set('limit', String(query.limit));
  if (query.offset !== undefined) params.set('offset', String(query.offset));
  if (query.status) params.set('status', query.status);
  if (query.merchant_id) params.set('merchant_id', query.merchant_id);
  if (query.max_due_date_lte) params.set('max_due_date_lte', query.max_due_date_lte);
  if (query.q) params.set('q', query.q);
  if (query.sort) params.set('sort', query.sort);
  const qs = params.toString();
  try {
    return await apiFetch<OrdersListResponse>(`/api/orders${qs ? '?' + qs : ''}`, {
      method: 'GET',
    });
  } catch (err) {
    rethrowWithMessage(err);
  }
}

export async function getOrdersStats(): Promise<OrdersStats> {
  try {
    return await apiFetch<OrdersStats>('/api/orders/stats', { method: 'GET' });
  } catch (err) {
    rethrowWithMessage(err);
  }
}
