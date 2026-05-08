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
 * Step 1 of the direct-to-Storage upload flow. Vercel rejects Server Action
 * bodies > 4.5 MB at the platform edge, so we can't push the file through a
 * Server Action. Instead the back hands us a signed URL the browser can PUT
 * directly to Supabase Storage; the response is ~200 bytes either way.
 */
export async function getUploadSlot(): Promise<{
  storage_path: string;
  signed_upload_url: string;
  signed_upload_token: string;
}> {
  try {
    return await apiFetch('/api/batches/upload-url', { method: 'POST' });
  } catch (err) {
    rethrowWithMessage(err);
  }
}

/**
 * Step 2 of the direct-to-Storage upload flow. After the browser put the
 * file into Storage at `storage_path`, the back fetches it back, hashes it,
 * runs dedup + parse + ingest (same pipeline as the legacy multipart path)
 * and returns the BatchSummary. We strip to { code, rows_imported } here for
 * the same RSC deserialization reason as before.
 */
export async function processUploadedFile(input: {
  storage_path: string;
  filename: string;
}): Promise<{ code: string; rows_imported: number }> {
  try {
    const batch = await apiFetch<BatchSummary>('/api/batches/from-storage', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return { code: batch.external_code, rows_imported: batch.rows_imported };
  } catch (err) {
    rethrowWithMessage(err);
  }
}
