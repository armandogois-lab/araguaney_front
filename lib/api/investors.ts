'use server';

import { apiFetch } from './client';
import { ApiError } from './error';
import type {
  InvestorCreate,
  InvestorSummary,
  InvestorsListResponse,
  InvestorUpdate,
} from '@/lib/types/investor';

function rethrowWithMessage(err: unknown): never {
  if (err instanceof ApiError) {
    const body = err.body as { message?: string } | null;
    throw new Error(body?.message ?? `Error del servidor (${err.status})`);
  }
  throw err;
}

export interface ListInvestorsQuery {
  limit?: number;
  offset?: number;
  q?: string;
  kind?: 'juridica' | 'natural' | 'internal';
  status?: 'active' | 'inactive';
  sort?: 'name_asc' | 'name_desc' | 'created_desc';
}

export async function listInvestors(
  query: ListInvestorsQuery = {},
): Promise<InvestorsListResponse> {
  const params = new URLSearchParams();
  if (query.limit !== undefined) params.set('limit', String(query.limit));
  if (query.offset !== undefined) params.set('offset', String(query.offset));
  if (query.q) params.set('q', query.q);
  if (query.kind) params.set('kind', query.kind);
  if (query.status) params.set('status', query.status);
  if (query.sort) params.set('sort', query.sort);
  const qs = params.toString();
  try {
    return await apiFetch<InvestorsListResponse>(`/api/investors${qs ? '?' + qs : ''}`, {
      method: 'GET',
    });
  } catch (err) {
    rethrowWithMessage(err);
  }
}

export async function createInvestor(body: InvestorCreate): Promise<InvestorSummary> {
  try {
    return await apiFetch<InvestorSummary>('/api/investors', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  } catch (err) {
    rethrowWithMessage(err);
  }
}

export async function updateInvestor(id: string, body: InvestorUpdate): Promise<InvestorSummary> {
  try {
    return await apiFetch<InvestorSummary>(`/api/investors/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  } catch (err) {
    rethrowWithMessage(err);
  }
}
