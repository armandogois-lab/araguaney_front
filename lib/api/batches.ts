import { apiFetch } from './client';
import type {
  BatchListResponse,
  BatchStatus,
  BatchSummary,
  UploadBatchInput,
} from '@/lib/types/batch';

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

export async function uploadBatch(input: UploadBatchInput): Promise<BatchSummary> {
  const fd = new FormData();
  fd.set('file', input.file);
  if (input.externalCode) fd.set('external_code', input.externalCode);
  return apiFetch<BatchSummary>('/api/batches', { method: 'POST', body: fd });
}
