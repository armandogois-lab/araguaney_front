import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { Step1Investor } from './step1-investor';

const { mockListInvestors, mockCreate } = vi.hoisted(() => ({
  mockListInvestors: vi.fn(),
  mockCreate: vi.fn(),
}));

vi.mock('@/lib/api/investors', () => ({
  listInvestors: (...a: unknown[]) => mockListInvestors(...a),
  createInvestor: (...a: unknown[]) => mockCreate(...a),
}));

describe('<Step1Investor />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockListInvestors.mockResolvedValue({
      data: [
        {
          id: 'inv-1',
          legal_name: 'Alpha',
          rif: 'J-1',
          kind: 'juridica',
          status: 'active',
          email: null,
          phone: null,
        },
      ],
      total: 1,
      limit: 50,
      offset: 0,
    });
  });

  it('starts with Existente tab active', () => {
    renderWithQuery(<Step1Investor onSelect={vi.fn()} />);
    expect(screen.getByRole('tab', { name: /existente/i })).toHaveAttribute('data-state', 'active');
  });

  it('switching to Nuevo tab shows the create form', () => {
    renderWithQuery(<Step1Investor onSelect={vi.fn()} />);
    fireEvent.click(screen.getByRole('tab', { name: /nuevo/i }));
    expect(screen.getByLabelText(/razón social/i)).toBeInTheDocument();
  });

  it('selecting an existing investor calls onSelect', async () => {
    const onSelect = vi.fn();
    renderWithQuery(<Step1Investor onSelect={onSelect} />);
    await waitFor(() => expect(screen.getByText('Alpha')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Alpha'));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'inv-1' }));
  });
});
