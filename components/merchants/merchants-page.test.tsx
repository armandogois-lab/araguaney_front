import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { MerchantsPage } from './merchants-page';

const { mockList, mockPush } = vi.hoisted(() => ({
  mockList: vi.fn(),
  mockPush: vi.fn(),
}));
vi.mock('@/lib/api/merchants', () => ({ listMerchants: (...a: unknown[]) => mockList(...a) }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }));

describe('<MerchantsPage />', () => {
  beforeEach(() => {
    mockList.mockReset();
    mockPush.mockReset();
  });

  it('smoke: header + toolbar + table', async () => {
    mockList.mockResolvedValue({
      data: [
        {
          id: 'm-1',
          rif: 'J-1',
          current_name: 'ACME',
          first_seen_at: '2026-01-01T00:00:00Z',
          last_seen_at: '2026-05-01T00:00:00Z',
          order_count: 3,
          total_orders_amount: '100.0000',
        },
      ],
      total: 1,
      limit: 25,
      offset: 0,
    });
    renderWithQuery(<MerchantsPage />);
    expect(screen.getByRole('heading', { level: 1, name: /comercios/i })).toBeInTheDocument();
    await waitFor(() => expect(mockList).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByText('ACME')).toBeInTheDocument());
  });

  it('first call uses default sort=name_asc, limit=25, offset=0', async () => {
    mockList.mockResolvedValue({ data: [], total: 0, limit: 25, offset: 0 });
    renderWithQuery(<MerchantsPage />);
    await waitFor(() => expect(mockList).toHaveBeenCalled());
    const arg = mockList.mock.calls[0][0];
    expect(arg).toMatchObject({ sort: 'name_asc', limit: 25, offset: 0 });
    expect(arg.q).toBeUndefined();
  });

  it('row click navigates to /merchants/:id', async () => {
    mockList.mockResolvedValue({
      data: [
        {
          id: 'm-7',
          rif: 'J-7',
          current_name: 'ZETA',
          first_seen_at: '2026-01-01T00:00:00Z',
          last_seen_at: '2026-01-01T00:00:00Z',
          order_count: 1,
          total_orders_amount: '0.0000',
        },
      ],
      total: 1,
      limit: 25,
      offset: 0,
    });
    renderWithQuery(<MerchantsPage />);
    await waitFor(() => expect(screen.getByText('ZETA')).toBeInTheDocument());
    fireEvent.click(screen.getByText('ZETA'));
    expect(mockPush).toHaveBeenCalledWith('/merchants/m-7');
  });
});
