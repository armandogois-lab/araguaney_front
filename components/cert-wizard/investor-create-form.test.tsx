import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { InvestorCreateForm } from './investor-create-form';

const { mockCreate } = vi.hoisted(() => ({ mockCreate: vi.fn() }));

vi.mock('@/lib/api/investors', () => ({
  createInvestor: (...a: unknown[]) => mockCreate(...a),
}));

describe('<InvestorCreateForm />', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders all fields with juridica selected by default', () => {
    renderWithQuery(<InvestorCreateForm onCreated={vi.fn()} />);
    expect(screen.getByLabelText(/razón social/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^rif/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tel[eé]fono/i)).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /jur[ií]dica/i })).toBeChecked();
  });

  it('disables submit when required fields are empty', () => {
    renderWithQuery(<InvestorCreateForm onCreated={vi.fn()} />);
    expect(screen.getByRole('button', { name: /crear inversor/i })).toBeDisabled();
  });

  it('submits with the entered values and calls onCreated', async () => {
    mockCreate.mockResolvedValueOnce({
      id: 'inv-99',
      legal_name: 'Inv X',
      rif: 'J-1',
      kind: 'juridica',
      status: 'active',
      email: null,
      phone: null,
    });
    const onCreated = vi.fn();
    renderWithQuery(<InvestorCreateForm onCreated={onCreated} />);
    fireEvent.change(screen.getByLabelText(/razón social/i), { target: { value: 'Inv X' } });
    fireEvent.change(screen.getByLabelText(/^rif/i), { target: { value: 'J-1' } });
    fireEvent.click(screen.getByRole('button', { name: /crear inversor/i }));
    await waitFor(() => expect(mockCreate).toHaveBeenCalled());
    expect(mockCreate.mock.calls[0][0]).toMatchObject({
      legal_name: 'Inv X',
      rif: 'J-1',
      kind: 'juridica',
    });
    await waitFor(() => expect(onCreated).toHaveBeenCalled());
  });

  it('shows the back error message inline on failure', async () => {
    mockCreate.mockRejectedValueOnce(new Error('RIF duplicado'));
    renderWithQuery(<InvestorCreateForm onCreated={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(/razón social/i), { target: { value: 'X' } });
    fireEvent.change(screen.getByLabelText(/^rif/i), { target: { value: 'J-1' } });
    fireEvent.click(screen.getByRole('button', { name: /crear inversor/i }));
    await waitFor(() => expect(screen.getByText('RIF duplicado')).toBeInTheDocument());
  });

  it('toggles to natural when clicking that radio', () => {
    renderWithQuery(<InvestorCreateForm onCreated={vi.fn()} />);
    fireEvent.click(screen.getByRole('radio', { name: /natural/i }));
    expect(screen.getByRole('radio', { name: /natural/i })).toBeChecked();
    expect(screen.getByRole('radio', { name: /jur[ií]dica/i })).not.toBeChecked();
  });
});
