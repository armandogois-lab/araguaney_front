import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { CertificateDetailPage } from './certificate-detail-page';
import { UserProvider } from '@/lib/auth/user-context';
import type { CertificateDetail } from '@/lib/types/certificate';

const { mockGet, mockGenerate, mockSaveAs } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockGenerate: vi.fn(),
  mockSaveAs: vi.fn(),
}));

vi.mock('@/lib/api/certificates', () => ({
  getCertificateDetail: (...a: unknown[]) => mockGet(...a),
  cancelCertificate: vi.fn(),
  approveDraft: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('@/lib/export/certificate-excel', () => ({
  generateCertificateExcel: (...a: unknown[]) => mockGenerate(...a),
}));

vi.mock('file-saver', () => ({
  saveAs: (...a: unknown[]) => mockSaveAs(...a),
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
    approved_by: null,
    approved_at: null,
    cancelled_at: null,
    cancellation_reason: null,
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

const adminUser = {
  id: 'admin-1',
  email: 'admin@x.com',
  full_name: 'Admin',
  role: 'admin' as const,
  is_active: true,
};

const auditorUser = {
  id: 'aud-1',
  email: 'aud@x.com',
  full_name: 'Auditor',
  role: 'auditor' as const,
  is_active: true,
};

const draftCert: CertificateDetail = mockCert({
  status: 'draft',
  certificate_code: null,
  issued_by: { id: 'op-1', email: 'op@x.com', full_name: 'Op Creator' },
});

function wrap(ui: React.ReactElement, user = operator) {
  return renderWithQuery(<UserProvider user={user}>{ui}</UserProvider>);
}

describe('<CertificateDetailPage />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGenerate.mockResolvedValue(new Blob(['fake-xlsx'], { type: 'application/octet-stream' }));
  });

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

  it('clicking Exportar Excel triggers the helper + saveAs', async () => {
    mockGet.mockResolvedValueOnce(mockCert());
    wrap(<CertificateDetailPage id="c-1" />);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /exportar excel/i })).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByRole('button', { name: /exportar excel/i }));
    await waitFor(() => expect(mockGenerate).toHaveBeenCalled());
    await waitFor(() => expect(mockSaveAs).toHaveBeenCalled());
    const filename = mockSaveAs.mock.calls[0][1] as string;
    expect(filename).toMatch(/Certificado_C4572A.*\.xlsx/);
  });

  it('admin viewing a draft sees Aprobar and Cancelar borrador buttons', async () => {
    mockGet.mockResolvedValueOnce(draftCert);
    wrap(<CertificateDetailPage id="c-1" />, adminUser);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /aprobar/i })).toBeInTheDocument(),
    );
    expect(screen.getByRole('button', { name: /cancelar borrador/i })).toBeInTheDocument();
  });

  it('operator who is creator of a draft sees only Cancelar borrador', async () => {
    // operator with id='op-1' matches draftCert.issued_by.id
    const creatorOp = { ...operator, id: 'op-1' };
    mockGet.mockResolvedValueOnce(draftCert);
    wrap(<CertificateDetailPage id="c-1" />, creatorOp);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /cancelar borrador/i })).toBeInTheDocument(),
    );
    expect(screen.queryByRole('button', { name: /^aprobar$/i })).toBeNull();
  });

  it('non-creator operator viewing a draft sees no action buttons', async () => {
    // operator with id='op-2' does NOT match issued_by.id='op-1'
    const otherOp = { ...operator, id: 'op-2' };
    mockGet.mockResolvedValueOnce(draftCert);
    wrap(<CertificateDetailPage id="c-1" />, otherOp);
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { level: 1, name: /inversora alpha/i }),
      ).toBeInTheDocument(),
    );
    expect(screen.queryByRole('button', { name: /^aprobar$/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /cancelar borrador/i })).toBeNull();
  });

  it('auditor viewing a draft sees no action buttons', async () => {
    mockGet.mockResolvedValueOnce(draftCert);
    wrap(<CertificateDetailPage id="c-1" />, auditorUser);
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { level: 1, name: /inversora alpha/i }),
      ).toBeInTheDocument(),
    );
    expect(screen.queryByRole('button', { name: /^aprobar$/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /cancelar borrador/i })).toBeNull();
  });
});
