'use server';

import { apiFetch } from './client';
import { ApiError } from './error';
import type { Certificate, CertificateTermDays, SimulationResult } from '@/lib/types/certificate';

interface CertificatesListResponse {
  data: unknown[];
  total: number;
  limit: number;
  offset: number;
}

function rethrowWithMessage(err: unknown): never {
  if (err instanceof ApiError) {
    const body = err.body as { message?: string } | null;
    throw new Error(body?.message ?? `Error del servidor (${err.status})`);
  }
  throw err;
}

/**
 * Returns only the count of certificates issued between [from, to].
 * The Stock banner card cares about the number, not the certificates.
 * `from` and `to` are ISO date strings (YYYY-MM-DD).
 */
export async function countCertificatesIssued(
  from: string,
  to: string,
): Promise<{ total: number }> {
  const params = new URLSearchParams({
    issue_date_from: from,
    issue_date_to: to,
    limit: '1',
  });
  try {
    const res = await apiFetch<CertificatesListResponse>(`/api/certificates?${params.toString()}`, {
      method: 'GET',
    });
    return { total: res.total };
  } catch (err) {
    rethrowWithMessage(err);
  }
}

export interface SimulateCertificateBody {
  investor_id: string;
  capital: number;
  rate: number;
  term_days: CertificateTermDays;
  issue_date: string;
}

export interface IssueCertificateBody extends SimulateCertificateBody {
  order_ids: string[];
  expected_payload_hash: string;
}

export async function simulateCertificate(
  body: SimulateCertificateBody,
): Promise<SimulationResult> {
  try {
    return await apiFetch<SimulationResult>('/api/certificates/simulate', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  } catch (err) {
    rethrowWithMessage(err);
  }
}

export async function issueCertificate(body: IssueCertificateBody): Promise<Certificate> {
  try {
    return await apiFetch<Certificate>('/api/certificates', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  } catch (err) {
    rethrowWithMessage(err);
  }
}
