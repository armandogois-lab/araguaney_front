import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BatchRow } from './batch-row';
import type { BatchSummary } from '@/lib/types/batch';

const sampleBatch: BatchSummary = {
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
  uploaded_by: { id: 'u-1', email: 'maria@cashea.app', full_name: 'María Rodríguez' },
};

function renderInTable(row: React.ReactElement) {
  return render(
    <table>
      <tbody>{row}</tbody>
    </table>,
  );
}

describe('<BatchRow />', () => {
  it('renders external_code', () => {
    renderInTable(<BatchRow batch={sampleBatch} />);
    expect(screen.getByText('00086')).toBeInTheDocument();
  });

  it('renders the formatted upload date', () => {
    renderInTable(<BatchRow batch={sampleBatch} />);
    expect(screen.getByText('20/04/2026')).toBeInTheDocument();
  });

  it('renders the uploader full_name', () => {
    renderInTable(<BatchRow batch={sampleBatch} />);
    expect(screen.getByText('María Rodríguez')).toBeInTheDocument();
  });

  it('renders rows_imported with thousand separators', () => {
    renderInTable(<BatchRow batch={sampleBatch} />);
    expect(screen.getByText('45,389')).toBeInTheDocument();
  });

  it('renders total_orders_amount as money', () => {
    renderInTable(<BatchRow batch={sampleBatch} />);
    expect(screen.getByText('$1,132,418')).toBeInTheDocument();
  });

  it('renders the status pill', () => {
    renderInTable(<BatchRow batch={sampleBatch} />);
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('renders "—" when uploaded_by is null', () => {
    const noUser = { ...sampleBatch, uploaded_by: null };
    renderInTable(<BatchRow batch={noUser} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('renders "—" when uploaded_at is null', () => {
    const noDate = { ...sampleBatch, uploaded_at: null, uploaded_by: null };
    renderInTable(<BatchRow batch={noDate} />);
    expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(2);
  });
});
