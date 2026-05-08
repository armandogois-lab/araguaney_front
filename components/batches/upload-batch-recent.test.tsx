import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { UploadBatchRecent } from './upload-batch-recent';
import type { BatchListResponse } from '@/lib/types/batch';

const mockListBatches = vi.fn();
vi.mock('@/lib/api/batches', () => ({
  listBatches: (...a: unknown[]) => mockListBatches(...a),
}));

const sample: BatchListResponse = {
  data: [
    {
      id: 'b-1',
      external_code: '00086',
      status: 'imported',
      rows_imported: 45389,
      rows_rejected: 0,
      total_orders_amount: '0',
      total_installments_amount: '0',
      imported_at: null,
      rejection_reason: null,
      uploaded_at: '2026-04-20T00:00:00.000Z',
      uploaded_by: { id: 'u', email: 'a@b', full_name: 'María' },
    },
    {
      id: 'b-2',
      external_code: '00085',
      status: 'imported',
      rows_imported: 12140,
      rows_rejected: 0,
      total_orders_amount: '0',
      total_installments_amount: '0',
      imported_at: null,
      rejection_reason: null,
      uploaded_at: '2026-04-13T00:00:00.000Z',
      uploaded_by: { id: 'u', email: 'p@b', full_name: 'Pedro' },
    },
  ],
  total: 2,
  limit: 3,
  offset: 0,
};

describe('<UploadBatchRecent />', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders the section header and each batch', async () => {
    mockListBatches.mockResolvedValueOnce(sample);
    renderWithQuery(<UploadBatchRecent />);
    await waitFor(() => expect(screen.getByText('Lotes recientes')).toBeInTheDocument());
    expect(screen.getByText(/Lote 00086/)).toBeInTheDocument();
    expect(screen.getByText(/Lote 00085/)).toBeInTheDocument();
    expect(screen.getByText(/45,389 órdenes/)).toBeInTheDocument();
    expect(screen.getByText(/12,140 órdenes/)).toBeInTheDocument();
  });

  it('renders nothing when there are no batches', async () => {
    mockListBatches.mockResolvedValueOnce({ data: [], total: 0, limit: 3, offset: 0 });
    const { container } = renderWithQuery(<UploadBatchRecent />);
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it('queries with limit=3', async () => {
    mockListBatches.mockResolvedValueOnce(sample);
    renderWithQuery(<UploadBatchRecent />);
    await waitFor(() => {
      expect(mockListBatches).toHaveBeenCalledWith({ limit: 3, offset: 0 });
    });
  });
});
