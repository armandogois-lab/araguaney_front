import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { CertificateFilters, type CertificateFiltersValue } from './certificate-filters';

const { mockListInvestors } = vi.hoisted(() => ({ mockListInvestors: vi.fn() }));

vi.mock('@/lib/api/investors', () => ({
  listInvestors: (...a: unknown[]) => mockListInvestors(...a),
}));

const DEFAULT: CertificateFiltersValue = {
  status: 'issued',
  investorId: null,
  issueDateFrom: null,
  issueDateTo: null,
  q: '',
};

describe('<CertificateFilters />', () => {
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
      limit: 200,
      offset: 0,
    });
  });

  it('renders 4 status pills with Activos active by default', () => {
    renderWithQuery(<CertificateFilters value={DEFAULT} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Activos' })).toHaveAttribute('data-active', 'true');
    expect(screen.getByRole('button', { name: 'Todos' })).toHaveAttribute('data-active', 'false');
  });

  it('clicking "Todos" emits status: "all"', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderWithQuery(<CertificateFilters value={DEFAULT} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Todos' }));
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT, status: 'all' });
  });

  it('selecting an investor emits investorId', async () => {
    const onChange = vi.fn();
    renderWithQuery(<CertificateFilters value={DEFAULT} onChange={onChange} />);
    await waitFor(() => expect(mockListInvestors).toHaveBeenCalled());
    const select = await screen.findByLabelText(/inversor/i);
    fireEvent.change(select, { target: { value: 'inv-1' } });
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT, investorId: 'inv-1' });
  });

  it('emits issueDateFrom + issueDateTo when date inputs change', () => {
    const onChange = vi.fn();
    renderWithQuery(<CertificateFilters value={DEFAULT} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(/emitido desde/i), {
      target: { value: '2026-05-01' },
    });
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT, issueDateFrom: '2026-05-01' });
    fireEvent.change(screen.getByLabelText(/hasta/i), { target: { value: '2026-05-31' } });
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT, issueDateTo: '2026-05-31' });
  });

  it('debounces the code search input by 300ms', async () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    renderWithQuery(<CertificateFilters value={DEFAULT} onChange={onChange} />);
    const input = screen.getByPlaceholderText(/c[oó]digo/i);
    fireEvent.change(input, { target: { value: 'C4572' } });
    expect(onChange).not.toHaveBeenCalled();
    vi.advanceTimersByTime(310);
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT, q: 'C4572' });
    vi.useRealTimers();
  });
});
