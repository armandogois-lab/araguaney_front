'use server';

import { apiFetch } from './client';
import { ApiError } from './error';
import type { AuditEntityType, AuditListResponse } from '@/lib/types/audit';

function rethrowWithMessage(err: unknown): never {
  if (err instanceof ApiError) {
    const body = err.body as { message?: string } | null;
    throw new Error(body?.message ?? `Error del servidor (${err.status})`);
  }
  throw err;
}

export interface ListAuditQuery {
  limit?: number;
  offset?: number;
  entity_type?: AuditEntityType;
  action?: string;
  occurred_at_from?: string;
  occurred_at_to?: string;
}

export async function listAudit(query: ListAuditQuery = {}): Promise<AuditListResponse> {
  const params = new URLSearchParams();
  if (query.limit !== undefined) params.set('limit', String(query.limit));
  if (query.offset !== undefined) params.set('offset', String(query.offset));
  if (query.entity_type) params.set('entity_type', query.entity_type);
  if (query.action) params.set('action', query.action);
  if (query.occurred_at_from) params.set('occurred_at_from', query.occurred_at_from);
  if (query.occurred_at_to) params.set('occurred_at_to', query.occurred_at_to);
  const qs = params.toString();
  try {
    return await apiFetch<AuditListResponse>(`/api/audit${qs ? '?' + qs : ''}`, {
      method: 'GET',
    });
  } catch (err) {
    rethrowWithMessage(err);
  }
}
