import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { InvestorEditModal } from './investor-edit-modal';
import type { InvestorSummary } from '@/lib/types/investor';

const { mockUpdate, toastSuccess, toastError } = vi.hoisted(() => ({
  mockUpdate: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock('@/lib/api/investors', () => ({
  updateInvestor: (...a: unknown[]) => mockUpdate(...a),
}));

vi.mock('sonner', () => ({
  toast: {
    success: (...a: unknown[]) => toastSuccess(...a),
    error: (...a: unknown[]) => toastError(...a),
  },
}));

function inv(over: Partial<InvestorSummary> = {}): InvestorSummary {
  return {
    id: 'inv-1',
    legal_name: 'Inversora Alpha, C.A.',
    rif: 'J-12345678-9',
    kind: 'juridica',
    status: 'active',
    email: 'ops@alpha.com',
    phone: '+58-212-555-1234',
    notes: 'Cliente histórico',
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-05-01T10:00:00Z',
    updated_by: null,
    active_cert_count: 2,
    total_invested: '450000.0000',
    ...over,
  };
}

describe('<InvestorEditModal />', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders title with legal_name', () => {
    renderWithQuery(<InvestorEditModal investor={inv()} onClose={vi.fn()} />);
    expect(screen.getByText(/editar.*alpha/i)).toBeInTheDocument();
  });

  it('initializes inputs from the investor', () => {
    renderWithQuery(<InvestorEditModal investor={inv()} onClose={vi.fn()} />);
    expect(screen.getByLabelText(/raz[oó]n social/i)).toHaveValue('Inversora Alpha, C.A.');
    expect(screen.getByLabelText(/email/i)).toHaveValue('ops@alpha.com');
    expect(screen.getByLabelText(/tel[eé]fono/i)).toHaveValue('+58-212-555-1234');
    expect(screen.getByLabelText(/notas/i)).toHaveValue('Cliente histórico');
  });

  it('disables Guardar when no field is dirty', () => {
    renderWithQuery(<InvestorEditModal investor={inv()} onClose={vi.fn()} />);
    expect(screen.getByRole('button', { name: /guardar/i })).toBeDisabled();
  });

  it('enables Guardar after a dirty change', () => {
    renderWithQuery(<InvestorEditModal investor={inv()} onClose={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'new@alpha.com' },
    });
    expect(screen.getByRole('button', { name: /guardar/i })).not.toBeDisabled();
  });

  it('sends only dirty fields on submit', async () => {
    mockUpdate.mockResolvedValueOnce(inv({ email: 'new@alpha.com' }));
    const onClose = vi.fn();
    renderWithQuery(<InvestorEditModal investor={inv()} onClose={onClose} />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'new@alpha.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));
    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith('inv-1', { email: 'new@alpha.com' }),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(toastSuccess).toHaveBeenCalled();
  });

  it('toggles status via the Activo/Inactivo buttons', () => {
    renderWithQuery(<InvestorEditModal investor={inv()} onClose={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Activo' })).toHaveAttribute('data-active', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Inactivo' }));
    expect(screen.getByRole('button', { name: 'Inactivo' })).toHaveAttribute('data-active', 'true');
    expect(screen.getByRole('button', { name: /guardar/i })).not.toBeDisabled();
  });

  it('on error: toasts and stays open', async () => {
    mockUpdate.mockRejectedValueOnce(new Error('Conflicto de datos'));
    const onClose = vi.fn();
    renderWithQuery(<InvestorEditModal investor={inv()} onClose={onClose} />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'x@y.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));
    await waitFor(() => expect(toastError).toHaveBeenCalled());
    expect(onClose).not.toHaveBeenCalled();
  });

  it('clicking backdrop closes', () => {
    const onClose = vi.fn();
    const { container } = renderWithQuery(<InvestorEditModal investor={inv()} onClose={onClose} />);
    fireEvent.click(container.querySelector('[data-testid="edit-modal-backdrop"]')!);
    expect(onClose).toHaveBeenCalled();
  });
});
