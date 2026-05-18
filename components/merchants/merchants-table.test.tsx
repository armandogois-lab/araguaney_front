import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MerchantsTable } from './merchants-table';
import type { MerchantSummary } from '@/lib/types/merchant';

function m(over: Partial<MerchantSummary> = {}): MerchantSummary {
  return {
    id: 'm-1',
    rif: 'J-12345678-9',
    current_name: 'CENTRAL MADEIRENSE',
    first_seen_at: '2026-01-15T00:00:00Z',
    last_seen_at: '2026-05-10T12:00:00Z',
    order_count: 42,
    total_orders_amount: '12345.6789',
    ...over,
  };
}

describe('<MerchantsTable />', () => {
  it('renders rows with name, RIF, count localized, money formatted, last seen date', () => {
    render(
      <MerchantsTable rows={[m()]} isLoading={false} isError={false} onRowClick={vi.fn()} onRetry={vi.fn()} />,
    );
    expect(screen.getByText('CENTRAL MADEIRENSE')).toBeInTheDocument();
    expect(screen.getByText('J-12345678-9')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('$12,345.68')).toBeInTheDocument();
    expect(screen.getByText('10/05/2026')).toBeInTheDocument();
  });

  it('row click fires onRowClick with merchant id', () => {
    const onRowClick = vi.fn();
    render(
      <MerchantsTable rows={[m()]} isLoading={false} isError={false} onRowClick={onRowClick} onRetry={vi.fn()} />,
    );
    fireEvent.click(screen.getByText('CENTRAL MADEIRENSE'));
    expect(onRowClick).toHaveBeenCalledWith('m-1');
  });

  it('shows loading state', () => {
    render(
      <MerchantsTable rows={[]} isLoading={true} isError={false} onRowClick={vi.fn()} onRetry={vi.fn()} />,
    );
    expect(screen.getByText(/cargando comercios/i)).toBeInTheDocument();
  });

  it('shows error state with retry button', () => {
    const onRetry = vi.fn();
    render(
      <MerchantsTable rows={[]} isLoading={false} isError={true} onRowClick={vi.fn()} onRetry={onRetry} />,
    );
    expect(screen.getByText(/no se pudieron cargar/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /reintentar/i }));
    expect(onRetry).toHaveBeenCalled();
  });

  it('shows empty state', () => {
    render(
      <MerchantsTable rows={[]} isLoading={false} isError={false} onRowClick={vi.fn()} onRetry={vi.fn()} />,
    );
    expect(screen.getByText(/sin comercios que coincidan/i)).toBeInTheDocument();
  });
});
