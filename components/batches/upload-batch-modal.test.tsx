import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { UploadBatchModal } from './upload-batch-modal';

const { mockUploadBatch, mockListBatches, toastSuccess, FakeApiError } = vi.hoisted(() => {
  class FakeApiError extends Error {
    constructor(
      public status: number,
      public body: unknown,
    ) {
      super();
      this.name = 'ApiError';
    }
  }
  return {
    mockUploadBatch: vi.fn(),
    mockListBatches: vi.fn().mockResolvedValue({ data: [], total: 0, limit: 3, offset: 0 }),
    toastSuccess: vi.fn(),
    FakeApiError,
  };
});

vi.mock('@/lib/api/batches', () => ({
  uploadBatch: (...a: unknown[]) => mockUploadBatch(...a),
  listBatches: (...a: unknown[]) => mockListBatches(...a),
}));

vi.mock('sonner', () => ({
  toast: { success: (...a: unknown[]) => toastSuccess(...a) },
}));

vi.mock('@/lib/api/client', () => ({
  apiFetch: vi.fn(),
  ApiError: FakeApiError,
}));

describe('<UploadBatchModal />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the dropzone initially (idle stage)', () => {
    renderWithQuery(<UploadBatchModal onClose={vi.fn()} />);
    expect(screen.getByText(/arrastra el archivo/i)).toBeInTheDocument();
  });

  it('rejects a non-xlsx file with inline error and does not call uploadBatch', () => {
    renderWithQuery(<UploadBatchModal onClose={vi.fn()} />);
    const dropzone = screen.getByTestId('dropzone');
    const pdfFile = new File(['x'], 'test.pdf', { type: 'application/pdf' });
    fireEvent.drop(dropzone, { dataTransfer: { files: [pdfFile] } });
    expect(screen.getByText(/formato no soportado/i)).toBeInTheDocument();
    expect(mockUploadBatch).not.toHaveBeenCalled();
  });

  it('rejects a >10MB xlsx with inline error', () => {
    renderWithQuery(<UploadBatchModal onClose={vi.fn()} />);
    const dropzone = screen.getByTestId('dropzone');
    const big = new File([new Blob([new Uint8Array(11 * 1024 * 1024)])], 'big.xlsx');
    fireEvent.drop(dropzone, { dataTransfer: { files: [big] } });
    expect(screen.getByText(/excede 10 mb/i)).toBeInTheDocument();
    expect(mockUploadBatch).not.toHaveBeenCalled();
  });

  it('rejects an empty xlsx with inline error', () => {
    renderWithQuery(<UploadBatchModal onClose={vi.fn()} />);
    const dropzone = screen.getByTestId('dropzone');
    const empty = new File([], 'empty.xlsx');
    fireEvent.drop(dropzone, { dataTransfer: { files: [empty] } });
    expect(screen.getByText(/archivo vacío/i)).toBeInTheDocument();
    expect(mockUploadBatch).not.toHaveBeenCalled();
  });

  it('on valid file: calls uploadBatch, then on success toasts and closes', async () => {
    const onClose = vi.fn();
    mockUploadBatch.mockResolvedValueOnce({
      external_code: '00086',
      rows_imported: 45389,
    });
    renderWithQuery(<UploadBatchModal onClose={onClose} />);
    const dropzone = screen.getByTestId('dropzone');
    const file = new File([new Blob([new Uint8Array(100)])], 'lote.xlsx');
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

    await waitFor(() => expect(mockUploadBatch).toHaveBeenCalled());
    await waitFor(() => expect(toastSuccess).toHaveBeenCalled());
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it('shows the back error message on 4xx', async () => {
    mockUploadBatch.mockRejectedValueOnce(new FakeApiError(400, { message: 'Excel mal formado' }));
    renderWithQuery(<UploadBatchModal onClose={vi.fn()} />);
    const dropzone = screen.getByTestId('dropzone');
    const file = new File([new Blob([new Uint8Array(100)])], 'lote.xlsx');
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
    await waitFor(() => expect(screen.getByText('Excel mal formado')).toBeInTheDocument());
  });

  it('shows generic error when network error (no ApiError)', async () => {
    mockUploadBatch.mockRejectedValueOnce(new Error('Network down'));
    renderWithQuery(<UploadBatchModal onClose={vi.fn()} />);
    const dropzone = screen.getByTestId('dropzone');
    const file = new File([new Blob([new Uint8Array(100)])], 'lote.xlsx');
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
    await waitFor(() => expect(screen.getByText(/error de red/i)).toBeInTheDocument());
  });

  it('clicking the backdrop calls onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container } = renderWithQuery(<UploadBatchModal onClose={onClose} />);
    const backdrop = container.querySelector('[data-testid="modal-backdrop"]')!;
    await user.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
