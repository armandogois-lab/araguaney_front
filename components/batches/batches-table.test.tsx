import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { BatchesTable } from './batches-table';
import type { BatchListResponse } from '@/lib/types/batch';

const mockListBatches = vi.fn();
vi.mock('@/lib/api/batches', () => ({
  listBatches: (...args: unknown[]) => mockListBatches(...args),
}));

const empty: BatchListResponse = { data: [], total: 0, limit: 50, offset: 0 };

const oneBatch: BatchListResponse = {
  data: [
    {
      id: 'b-1',
      external_code: '00086',
      status: 'imported',
      rows_imported: 45389,
      rows_rejected: 0,
      total_orders_amount: '1132418.0000',
      total_installments_amount: '1132418.0000',
      imported_at: '2026-04-20T14:30:00.000Z',
      rejection_reason: null,
      uploaded_at: '2026-04-20T14:00:00.000Z',
      uploaded_by: { id: 'u-1', email: 'm@b.com', full_name: 'María' },
    },
  ],
  total: 1,
  limit: 50,
  offset: 0,
};

describe('<BatchesTable />', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows the loading skeleton initially', () => {
    mockListBatches.mockReturnValueOnce(new Promise(() => {})); // never resolves
    renderWithQuery(<BatchesTable />);
    expect(screen.getByText(/cargando lotes/i)).toBeInTheDocument();
  });

  it('shows the empty state when data is empty', async () => {
    mockListBatches.mockResolvedValueOnce(empty);
    renderWithQuery(<BatchesTable />);
    await waitFor(() => {
      expect(screen.getByText(/sin lotes todavía/i)).toBeInTheDocument();
    });
  });

  it('shows error state when query fails', async () => {
    mockListBatches.mockRejectedValueOnce(new Error('boom'));
    renderWithQuery(<BatchesTable />);
    await waitFor(() => {
      expect(screen.getByText(/no se pudieron cargar/i)).toBeInTheDocument();
    });
  });

  it('renders rows when data is present', async () => {
    mockListBatches.mockResolvedValueOnce(oneBatch);
    renderWithQuery(<BatchesTable />);
    await waitFor(() => {
      expect(screen.getByText('00086')).toBeInTheDocument();
    });
    expect(screen.getByText('María')).toBeInTheDocument();
    expect(screen.getByText('45,389')).toBeInTheDocument();
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });
});
