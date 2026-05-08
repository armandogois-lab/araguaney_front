'use server';

import { apiFetch } from './client';
import { ApiError } from './error';
import type { BatchListResponse, BatchStatus, BatchSummary } from '@/lib/types/batch';

/**
 * Server Actions can't propagate custom error classes across the RPC
 * boundary — the client receives a generic Error and `instanceof ApiError`
 * always returns false. Catch ApiError here and rethrow as a plain Error
 * carrying the back's message so it reaches the user.
 */
function rethrowWithMessage(err: unknown): never {
  if (err instanceof ApiError) {
    const body = err.body as { message?: string } | null;
    throw new Error(body?.message ?? `Error del servidor (${err.status})`);
  }
  throw err;
}

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
  try {
    return await apiFetch<BatchListResponse>(`/api/batches${qs ? '?' + qs : ''}`, {
      method: 'GET',
    });
  } catch (err) {
    rethrowWithMessage(err);
  }
}

/**
 * Server Action consumed by the upload mutation. Takes raw FormData (the
 * native Server-Action-friendly serializable type). The client builds the
 * FormData with `file` (and optionally `external_code`) and we pass it
 * straight through to the back — no rebuild, no `instanceof File` check
 * (in the Server Action runtime the File reference can be a different
 * realm's prototype, breaking instanceof).
 */
export async function uploadBatch(formData: FormData): Promise<BatchSummary> {
  if (!formData.has('file')) {
    throw new Error('Missing file in FormData');
  }
  try {
    return await apiFetch<BatchSummary>('/api/batches', { method: 'POST', body: formData });
  } catch (err) {
    rethrowWithMessage(err);
  }
}
