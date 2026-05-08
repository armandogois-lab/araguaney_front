import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listBatches, uploadBatch } from './batches';

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

describe('uploadBatch', () => {
  beforeEach(() => vi.clearAllMocks());

  it('POSTs FormData with the file to /api/batches', async () => {
    mockApiFetch.mockResolvedValueOnce({ id: 'b-1' });
    const file = new File(['content'], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    await uploadBatch({ file });

    const [path, init] = mockApiFetch.mock.calls[0];
    expect(path).toBe('/api/batches');
    expect(init.method).toBe('POST');
    expect(init.body).toBeInstanceOf(FormData);
    expect((init.body as FormData).get('file')).toBe(file);
    expect((init.body as FormData).get('external_code')).toBeNull();
  });

  it('includes external_code when provided', async () => {
    mockApiFetch.mockResolvedValueOnce({ id: 'b-1' });
    const file = new File(['x'], 'a.xlsx');
    await uploadBatch({ file, externalCode: 'BATCH-001' });

    const init = mockApiFetch.mock.calls[0][1] as RequestInit;
    expect((init.body as FormData).get('external_code')).toBe('BATCH-001');
  });
});
