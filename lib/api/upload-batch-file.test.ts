import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadBatchFile } from './upload-batch-file';

const { mockGetSlot, mockProcess, mockUploadToSignedUrl } = vi.hoisted(() => ({
  mockGetSlot: vi.fn(),
  mockProcess: vi.fn(),
  mockUploadToSignedUrl: vi.fn(),
}));

vi.mock('./batches', () => ({
  getUploadSlot: (...a: unknown[]) => mockGetSlot(...a),
  processUploadedFile: (...a: unknown[]) => mockProcess(...a),
}));

vi.mock('@/lib/supabase/browser', () => ({
  getBrowserSupabase: () => ({
    storage: {
      from: () => ({ uploadToSignedUrl: (...a: unknown[]) => mockUploadToSignedUrl(...a) }),
    },
  }),
}));

describe('uploadBatchFile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSlot.mockResolvedValue({
      storage_path: 'abc.xlsx',
      signed_upload_url: 'https://s.example/x',
      signed_upload_token: 't0k',
    });
    mockUploadToSignedUrl.mockResolvedValue({ data: { path: 'abc.xlsx' }, error: null });
    mockProcess.mockResolvedValue({ code: 'B-1', rows_imported: 42 });
  });

  it('chains slot → uploadToSignedUrl → process and returns the code', async () => {
    const file = new File(['x'], 'lote.xlsx');
    const result = await uploadBatchFile(file);
    expect(mockGetSlot).toHaveBeenCalledTimes(1);
    expect(mockUploadToSignedUrl).toHaveBeenCalledWith('abc.xlsx', 't0k', file, {
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    expect(mockProcess).toHaveBeenCalledWith({
      storage_path: 'abc.xlsx',
      filename: 'lote.xlsx',
    });
    expect(result).toEqual({ code: 'B-1', rows_imported: 42 });
  });

  it('throws with the storage error message if upload fails', async () => {
    mockUploadToSignedUrl.mockResolvedValueOnce({ data: null, error: { message: 'denied' } });
    await expect(uploadBatchFile(new File(['x'], 'lote.xlsx'))).rejects.toThrow(
      /No se pudo subir el archivo.*denied/i,
    );
    expect(mockProcess).not.toHaveBeenCalled();
  });
});
