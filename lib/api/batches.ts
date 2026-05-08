'use server';

import { apiFetch } from './client';
import type { BatchListResponse, BatchStatus, BatchSummary } from '@/lib/types/batch';

interface ListBatchesQuery {
  limit?: number;
  offset?: number;
  status?: BatchStatus;
}

export async function listBatches(query: ListBatchesQuery = {}): Promise<BatchListResponse> {
  const params = new URLSearchParams();
  if (query.limit !== undefined) params.set('limit', String(query.limit));
  if (query.offset !== undefined) params.set('offset', String(query.offset));
  if (query.status) params.set('status', query.status);
  const qs = params.toString();
  return apiFetch<BatchListResponse>(`/api/batches${qs ? '?' + qs : ''}`, { method: 'GET' });
}

/**
 * Server Action consumed by the upload mutation. Takes raw FormData (the
 * native Server-Action-friendly serializable type) instead of a custom
 * `{ file, externalCode }` shape — Server Action arguments must be
 * structurally cloneable, and FormData is the canonical multipart carrier.
 */
export async function uploadBatch(formData: FormData): Promise<BatchSummary> {
  const file = formData.get('file');
  if (!(file instanceof File)) {
    throw new Error('Missing file in FormData');
  }
  const externalCode = formData.get('external_code');
  const fd = new FormData();
  fd.set('file', file);
  if (typeof externalCode === 'string' && externalCode) {
    fd.set('external_code', externalCode);
  }
  return apiFetch<BatchSummary>('/api/batches', { method: 'POST', body: fd });
}
