import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUploadSlot, listBatches, processUploadedFile } from './batches';

const mockApiFetch = vi.fn();
vi.mock('./client', () => ({
  apiFetch: (path: string, init?: RequestInit) => mockApiFetch(path, init),
  ApiError: class ApiError extends Error {},
}));

describe('listBatches', () => {
  beforeEach(() => vi.clearAllMocks());

  it('GETs /api/batches with no params when query is empty', async () => {
    mockApiFetch.mockResolvedValueOnce({ data: [], total: 0, limit: 50, offset: 0 });
    await listBatches();
    expect(mockApiFetch).toHaveBeenCalledWith('/api/batches', { method: 'GET' });
  });

  it('appends query params when provided', async () => {
    mockApiFetch.mockResolvedValueOnce({ data: [], total: 0, limit: 50, offset: 0 });
    await listBatches({ limit: 50, offset: 0, status: 'imported' });
    expect(mockApiFetch).toHaveBeenCalledWith('/api/batches?limit=50&offset=0&status=imported', {
      method: 'GET',
    });
  });

  it('returns the parsed response', async () => {
    const expected = { data: [{ id: '1' }], total: 1, limit: 50, offset: 0 };
    mockApiFetch.mockResolvedValueOnce(expected);
    const result = await listBatches();
    expect(result).toEqual(expected);
  });
});

describe('getUploadSlot', () => {
  beforeEach(() => vi.clearAllMocks());

  it('POSTs /api/batches/upload-url and returns the slot', async () => {
    mockApiFetch.mockResolvedValueOnce({
      storage_path: 'abc.xlsx',
      signed_upload_url: 'https://s.example/x',
      signed_upload_token: 't0k',
    });
    const slot = await getUploadSlot();
    expect(mockApiFetch).toHaveBeenCalledWith('/api/batches/upload-url', { method: 'POST' });
    expect(slot.storage_path).toBe('abc.xlsx');
    expect(slot.signed_upload_token).toBe('t0k');
  });
});

describe('processUploadedFile', () => {
  beforeEach(() => vi.clearAllMocks());

  it('POSTs /api/batches/from-storage with the slot id and filename', async () => {
    mockApiFetch.mockResolvedValueOnce({ external_code: 'B-1', rows_imported: 10 });
    const result = await processUploadedFile({ storage_path: 'abc.xlsx', filename: 'lote.xlsx' });
    expect(result).toEqual({ code: 'B-1', rows_imported: 10 });
    const [path, init] = mockApiFetch.mock.calls[0];
    expect(path).toBe('/api/batches/from-storage');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string)).toEqual({
      storage_path: 'abc.xlsx',
      filename: 'lote.xlsx',
    });
  });
});
