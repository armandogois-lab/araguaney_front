import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { CertificatesPage } from './certificates-page';

const { mockListCerts, mockListInvestors } = vi.hoisted(() => ({
  mockListCerts: vi.fn(),
  mockListInvestors: vi.fn(),
}));

vi.mock('@/lib/api/certificates', () => ({
  listCertificates: (...a: unknown[]) => mockListCerts(...a),
}));

vi.mock('@/lib/api/investors', () => ({
  listInvestors: (...a: unknown[]) => mockListInvestors(...a),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('<CertificatesPage />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockListCerts.mockResolvedValue({ data: [], total: 0, limit: 50, offset: 0 });
    mockListInvestors.mockResolvedValue({ data: [], total: 0, limit: 200, offset: 0 });
  });

  it('renders header + filters + table', async () => {
    renderWithQuery(<CertificatesPage />);
    expect(screen.getByRole('heading', { level: 1, name: /certificados/i })).toBeInTheDocument();
    await waitFor(() => expect(mockListCerts).toHaveBeenCalledTimes(1));
    expect(screen.getByRole('button', { name: 'Activos' })).toHaveAttribute('data-active', 'true');
  });

  it('re-keys the certificates query when status filter changes', async () => {
    renderWithQuery(<CertificatesPage />);
    await waitFor(() => expect(mockListCerts).toHaveBeenCalledTimes(1));
    expect(mockListCerts.mock.calls[0][0].status).toBe('issued');

    fireEvent.click(screen.getByRole('button', { name: 'Todos' }));
    await waitFor(() => expect(mockListCerts).toHaveBeenCalledTimes(2));
    expect(mockListCerts.mock.calls[1][0].status).toBeUndefined();
  });
});
