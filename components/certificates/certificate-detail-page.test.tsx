import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { CertificateDetailPage } from './certificate-detail-page';
import { UserProvider } from '@/lib/auth/user-context';
import type { CertificateDetail } from '@/lib/types/certificate';

const { mockGet } = vi.hoisted(() => ({ mockGet: vi.fn() }));

vi.mock('@/lib/api/certificates', () => ({
  getCertificateDetail: (...a: unknown[]) => mockGet(...a),
  cancelCertificate: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

function mockCert(over: Partial<CertificateDetail> = {}): CertificateDetail {
  return {
    id: 'c-1',
    certificate_code: 'C4572A',
    certificate_type: 'standard',
    status: 'issued',
    investor: { id: 'inv-1', legal_name: 'Inversora Alpha, C.A.', rif: 'J-12345678-9' },
    investor_capital: '100000.0000',
    annual_rate: '0.130000',
    term_days: 42,
    price: '0.984833',
    nominal_target: '101540.6000',
    nominal_actual: '101540.0000',
    investor_paid: '99999.4100',
    investor_returned: '0.5900',
    investor_yield: '1540.5900',
    shortfall_pct: '0.000006',
    issue_date: '2026-04-27',
    maturity_date: '2026-06-08',
    cycle_week: '2026-W18',
    issued_by: { id: 'u-1', email: 'op@x.com', full_name: 'María R.' },
    created_at: '2026-04-27T14:30:00Z',
    payload_hash: 'h',
    cancellation: null,
    orders: [],
    events: [],
    ...over,
  };
}

const operator = {
  id: 'u-1',
  email: 'op@x.com',
  full_name: 'Op',
  role: 'operator' as const,
  is_active: true,
};

function wrap(ui: React.ReactElement) {
  return renderWithQuery(<UserProvider user={operator}>{ui}</UserProvider>);
}

describe('<CertificateDetailPage />', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows loading state initially', () => {
    mockGet.mockImplementation(() => new Promise(() => {}));
    wrap(<CertificateDetailPage id="c-1" />);
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it('shows 404 empty state when fetch errors', async () => {
    mockGet.mockRejectedValueOnce(new Error('not found'));
    wrap(<CertificateDetailPage id="c-1" />);
    await waitFor(() => expect(screen.getByText(/certificado no encontrado/i)).toBeInTheDocument());
    expect(screen.getByRole('link', { name: /volver al listado/i })).toHaveAttribute(
      'href',
      '/certificates',
    );
  });

  it('renders header + hero + body when data arrives', async () => {
    mockGet.mockResolvedValueOnce(mockCert());
    wrap(<CertificateDetailPage id="c-1" />);
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { level: 1, name: /inversora alpha/i }),
      ).toBeInTheDocument(),
    );
    expect(screen.getByText('CAPITAL')).toBeInTheDocument();
    expect(screen.getByText('INVERSOR')).toBeInTheDocument();
  });

  it('opens cancel modal on header button click', async () => {
    mockGet.mockResolvedValueOnce(mockCert());
    wrap(<CertificateDetailPage id="c-1" />);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /cancelar certificado/i })).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByRole('button', { name: /cancelar certificado/i }));
    expect(screen.getByText(/cancelar certificado c4572a/i)).toBeInTheDocument();
  });
});
