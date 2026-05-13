import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { CycleBatchesPanel } from './cycle-batches-panel';
import type { BatchListResponse, BatchSummary } from '@/lib/types/batch';

function batch(over: Partial<BatchSummary> = {}): BatchSummary {
  return {
    id: 'b-1',
    external_code: 'Lote_00118',
    status: 'imported',
    rows_imported: 12_345,
    rows_rejected: 0,
    total_orders_amount: '1000000.0000',
    total_installments_amount: '1100000.0000',
    imported_at: '2026-05-12T10:00:00Z',
    rejection_reason: null,
    uploaded_at: '2026-05-12T09:30:00Z',
    uploaded_by: { id: 'u-1', email: 'op@x.com', full_name: 'María R.' },
    ...over,
  };
}

function q(data?: BatchListResponse, over: Partial<UseQueryResult<BatchListResponse>> = {}) {
  return { data, isLoading: false, isError: false, ...over } as UseQueryResult<BatchListResponse>;
}

describe('<CycleBatchesPanel />', () => {
  it('renders rows with external_code + orders count + uploader', () => {
    const data: BatchListResponse = {
      data: [batch({ id: 'b-1', external_code: 'Lote_00118' })],
      total: 1,
      limit: 50,
      offset: 0,
    };
    render(<CycleBatchesPanel batchesQ={q(data)} />);
    expect(screen.getByText('Lote_00118')).toBeInTheDocument();
    expect(screen.getByText(/12,345 órdenes/)).toBeInTheDocument();
    expect(screen.getByText(/María R\./)).toBeInTheDocument();
  });

  it('shows empty state', () => {
    const empty: BatchListResponse = { data: [], total: 0, limit: 50, offset: 0 };
    render(<CycleBatchesPanel batchesQ={q(empty)} />);
    expect(screen.getByText(/sin lotes activos/i)).toBeInTheDocument();
  });

  it('shows error state', () => {
    render(<CycleBatchesPanel batchesQ={q(undefined, { isError: true })} />);
    expect(screen.getByText(/no se pudo cargar/i)).toBeInTheDocument();
  });

  it('caps visible rows at 5', () => {
    const many: BatchListResponse = {
      data: Array.from({ length: 8 }, (_, i) =>
        batch({ id: 'b-' + i, external_code: 'Lote_' + i }),
      ),
      total: 8,
      limit: 50,
      offset: 0,
    };
    render(<CycleBatchesPanel batchesQ={q(many)} />);
    expect(screen.getByText('Lote_0')).toBeInTheDocument();
    expect(screen.getByText('Lote_4')).toBeInTheDocument();
    expect(screen.queryByText('Lote_5')).not.toBeInTheDocument();
  });
});
