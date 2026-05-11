import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { InvestorCreateModal } from './investor-create-modal';

const { mockCreate, toastSuccess } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
  toastSuccess: vi.fn(),
}));

vi.mock('@/lib/api/investors', () => ({
  createInvestor: (...a: unknown[]) => mockCreate(...a),
}));

vi.mock('sonner', () => ({
  toast: {
    success: (...a: unknown[]) => toastSuccess(...a),
    error: vi.fn(),
  },
}));

describe('<InvestorCreateModal />', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders the title and mounts the create form', () => {
    renderWithQuery(<InvestorCreateModal onClose={vi.fn()} />);
    expect(screen.getByText(/registrar inversor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/raz[oó]n social/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^rif/i)).toBeInTheDocument();
  });

  it('on success: toasts and closes', async () => {
    mockCreate.mockResolvedValueOnce({
      id: 'inv-new',
      legal_name: 'Nuevo Fondo',
      rif: 'J-99999999-0',
      kind: 'juridica',
      status: 'active',
      email: null,
      phone: null,
      notes: null,
      created_at: '2026-05-11T10:00:00Z',
      updated_at: '2026-05-11T10:00:00Z',
      updated_by: null,
      active_cert_count: 0,
      total_invested: '0.0000',
    });
    const onClose = vi.fn();
    renderWithQuery(<InvestorCreateModal onClose={onClose} />);
    fireEvent.change(screen.getByLabelText(/raz[oó]n social/i), {
      target: { value: 'Nuevo Fondo' },
    });
    fireEvent.change(screen.getByLabelText(/^rif/i), {
      target: { value: 'J-99999999-0' },
    });
    fireEvent.click(screen.getByRole('button', { name: /crear inversor/i }));
    await waitFor(() => expect(mockCreate).toHaveBeenCalled());
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(toastSuccess).toHaveBeenCalledWith(expect.stringContaining('Nuevo Fondo'));
  });

  it('clicking backdrop closes', () => {
    const onClose = vi.fn();
    const { container } = renderWithQuery(<InvestorCreateModal onClose={onClose} />);
    fireEvent.click(container.querySelector('[data-testid="create-modal-backdrop"]')!);
    expect(onClose).toHaveBeenCalled();
  });

  it('clicking the × close button closes', () => {
    const onClose = vi.fn();
    renderWithQuery(<InvestorCreateModal onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /^×$/ }));
    expect(onClose).toHaveBeenCalled();
  });
});
