import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { CertificatesTable } from './certificates-table';
import type { CertificateFiltersValue } from './certificate-filters';
import type { CertificateSummary } from '@/lib/types/certificate';

const { mockListCerts } = vi.hoisted(() => ({ mockListCerts: vi.fn() }));

vi.mock('@/lib/api/certificates', () => ({
  listCertificates: (...a: unknown[]) => mockListCerts(...a),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

function cert(over: Partial<CertificateSummary> = {}): CertificateSummary {
  return {
    id: 'c-' + Math.random(),
    certificate_code: 'C4572A',
    certificate_type: 'standard',
    status: 'issued',
    investor: { id: 'inv-1', legal_name: 'Alpha', rif: 'J-1' },
    investor_capital: '100000.0000',
    annual_rate: '0.130000',
    term_days: 42,
    price: '0.984833',
    nominal_target: '101540.6000',
    nominal_actual: '101540.0000',
    investor_paid: '99999.4100',
    investor_yield: '1540.5900',
    shortfall_pct: '0.000006',
    issue_date: '2026-04-27',
    maturity_date: '2026-06-08',
    cycle_week: '2026-W18',
    issued_by: { id: 'u-1', email: 'op@x.com', full_name: 'María R.' },
    created_at: '2026-04-27T14:30:00Z',
    ...over,
  };
}

const FILTERS: CertificateFiltersValue = {
  status: 'issued',
  investorId: null,
  issueDateFrom: null,
  issueDateTo: null,
  q: '',
};

describe('<CertificatesTable />', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows skeleton while fetching', () => {
    mockListCerts.mockImplementation(() => new Promise(() => {}));
    renderWithQuery(<CertificatesTable filters={FILTERS} page={0} onPageChange={() => {}} />);
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it('shows empty state when no results', async () => {
    mockListCerts.mockResolvedValueOnce({ data: [], total: 0, limit: 50, offset: 0 });
    renderWithQuery(<CertificatesTable filters={FILTERS} page={0} onPageChange={() => {}} />);
    await waitFor(() => expect(screen.getByText(/ning[uú]n certificado/i)).toBeInTheDocument());
  });

  it('shows error state on failure', async () => {
    mockListCerts.mockRejectedValueOnce(new Error('boom'));
    renderWithQuery(<CertificatesTable filters={FILTERS} page={0} onPageChange={() => {}} />);
    await waitFor(() => expect(screen.getByText(/no se pudieron cargar/i)).toBeInTheDocument());
  });

  it('renders rows + pagination footer', async () => {
    mockListCerts.mockResolvedValueOnce({
      data: [cert({ certificate_code: 'A' }), cert({ certificate_code: 'B' })],
      total: 100,
      limit: 50,
      offset: 0,
    });
    renderWithQuery(<CertificatesTable filters={FILTERS} page={0} onPageChange={() => {}} />);
    await waitFor(() => expect(screen.getByText('A')).toBeInTheDocument());
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText(/1[–\-]50 de 100/)).toBeInTheDocument();
  });

  it('translates status="all" to undefined in the listCertificates call', async () => {
    mockListCerts.mockResolvedValueOnce({ data: [], total: 0, limit: 50, offset: 0 });
    renderWithQuery(
      <CertificatesTable
        filters={{ ...FILTERS, status: 'all' }}
        page={0}
        onPageChange={() => {}}
      />,
    );
    await waitFor(() => expect(mockListCerts).toHaveBeenCalled());
    expect(mockListCerts.mock.calls[0][0].status).toBeUndefined();
  });

  it('triggers onPageChange when next-page is clicked', async () => {
    mockListCerts.mockResolvedValueOnce({
      data: [cert()],
      total: 200,
      limit: 50,
      offset: 0,
    });
    const onPageChange = vi.fn();
    renderWithQuery(<CertificatesTable filters={FILTERS} page={0} onPageChange={onPageChange} />);
    await waitFor(() => expect(screen.getByLabelText(/p[aá]gina siguiente/i)).toBeInTheDocument());
    fireEvent.click(screen.getByLabelText(/p[aá]gina siguiente/i));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });
});
