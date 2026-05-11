import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CertHeader } from './cert-header';
import { UserProvider } from '@/lib/auth/user-context';
import type { CertificateDetail } from '@/lib/types/certificate';

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
    issued_by: { id: 'u-1', email: 'op@x.com', full_name: 'María Rodríguez' },
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
const auditor = { ...operator, role: 'auditor' as const };

describe('<CertHeader />', () => {
  it('renders breadcrumb + title + code + status pill', () => {
    render(
      <UserProvider user={operator}>
        <CertHeader cert={mockCert()} onCancel={vi.fn()} />
      </UserProvider>,
    );
    expect(screen.getByText('Operación')).toBeInTheDocument();
    expect(screen.getByText('Certificados')).toBeInTheDocument();
    expect(screen.getByText('C4572A', { selector: 'b' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: /inversora alpha/i })).toBeInTheDocument();
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('shows Cancelar button for operator when status=issued', () => {
    render(
      <UserProvider user={operator}>
        <CertHeader cert={mockCert()} onCancel={vi.fn()} />
      </UserProvider>,
    );
    expect(screen.getByRole('button', { name: /cancelar certificado/i })).toBeInTheDocument();
  });

  it('hides Cancelar button for auditor', () => {
    render(
      <UserProvider user={auditor}>
        <CertHeader cert={mockCert()} onCancel={vi.fn()} />
      </UserProvider>,
    );
    expect(screen.queryByRole('button', { name: /cancelar certificado/i })).not.toBeInTheDocument();
  });

  it('hides Cancelar button when status is not issued', () => {
    render(
      <UserProvider user={operator}>
        <CertHeader cert={mockCert({ status: 'cancelled' })} onCancel={vi.fn()} />
      </UserProvider>,
    );
    expect(screen.queryByRole('button', { name: /cancelar certificado/i })).not.toBeInTheDocument();
  });

  it('clicking Cancelar fires onCancel', () => {
    const onCancel = vi.fn();
    render(
      <UserProvider user={operator}>
        <CertHeader cert={mockCert()} onCancel={onCancel} />
      </UserProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: /cancelar certificado/i }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('renders "Exportar Excel" button when onExport prop is provided', () => {
    render(
      <UserProvider user={operator}>
        <CertHeader cert={mockCert()} onCancel={vi.fn()} onExport={vi.fn()} />
      </UserProvider>,
    );
    expect(screen.getByRole('button', { name: /exportar excel/i })).toBeInTheDocument();
  });

  it('Exportar button visible for auditor too', () => {
    render(
      <UserProvider user={auditor}>
        <CertHeader cert={mockCert()} onCancel={vi.fn()} onExport={vi.fn()} />
      </UserProvider>,
    );
    expect(screen.getByRole('button', { name: /exportar excel/i })).toBeInTheDocument();
  });

  it('clicking Exportar fires onExport', () => {
    const onExport = vi.fn();
    render(
      <UserProvider user={operator}>
        <CertHeader cert={mockCert()} onCancel={vi.fn()} onExport={onExport} />
      </UserProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: /exportar excel/i }));
    expect(onExport).toHaveBeenCalled();
  });

  it('button shows "Generando…" and is disabled while exporting=true', () => {
    render(
      <UserProvider user={operator}>
        <CertHeader cert={mockCert()} onCancel={vi.fn()} onExport={vi.fn()} exporting />
      </UserProvider>,
    );
    const btn = screen.getByRole('button', { name: /generando/i });
    expect(btn).toBeDisabled();
  });
});
