'use server';

import { apiFetch } from './client';
import { ApiError } from './error';
import type {
  Certificate,
  CertificateTermDays,
  CertificatesListResponse,
  SimulationResult,
} from '@/lib/types/certificate';

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

/**
 * Back's /simulate returns a nested shape (inputs / pricing / pool / payouts /
 * concentration / ...). Front internally consumes the flat SimulationResult.
 * We translate at the boundary so panels keep their existing field accesses.
 */
interface RawSimulationResponse {
  inputs: {
    investor: { id: string; legal_name: string; rif: string };
    capital: string;
    rate: string;
    term_days: CertificateTermDays;
    issue_date: string;
    maturity_date: string;
  };
  pricing: { price: string; nominal_target: string };
  pool: {
    order_ids: string[];
    order_count: number;
    merchant_count: number;
    installment_count: number;
    installment_plazo_days: { min: number; max: number };
  };
  payouts: {
    nominal_actual: string;
    investor_paid: string;
    investor_returned: string;
    investor_yield: string;
    shortfall_pct: string;
  };
  concentration: {
    top: Array<{
      merchant_id: string;
      current_name: string;
      rif: string;
      amount: string;
      pct: string;
    }>;
    total_distinct_merchants: number;
  };
  due_date_distribution: Array<{ date: string; amount: string }>;
  payload_hash: string;
}

function flattenSimulation(raw: RawSimulationResponse): SimulationResult {
  return {
    investor: raw.inputs.investor,
    capital: raw.inputs.capital,
    rate: raw.inputs.rate,
    term_days: raw.inputs.term_days,
    issue_date: raw.inputs.issue_date,
    maturity_date: raw.inputs.maturity_date,
    price: raw.pricing.price,
    nominal_target: raw.pricing.nominal_target,
    nominal_actual: raw.payouts.nominal_actual,
    investor_paid: raw.payouts.investor_paid,
    investor_returned: raw.payouts.investor_returned,
    investor_yield: raw.payouts.investor_yield,
    shortfall_pct: raw.payouts.shortfall_pct,
    selected_orders: raw.pool.order_ids.map((id) => ({
      id,
      // back's /simulate response only carries IDs; the rich per-order fields
      // aren't needed by any front consumer (Step3Confirm only uses `.id`).
      installments_sum: '0',
      merchant_id: '',
      num_installments: 0,
      max_due_date: '',
    })),
    total_eligible_merchants: raw.concentration.total_distinct_merchants,
    total_distinct_merchants: raw.concentration.total_distinct_merchants,
    installment_plazo_days: raw.pool.installment_plazo_days,
    concentration_top: raw.concentration.top,
    due_date_distribution: raw.due_date_distribution,
    payload_hash: raw.payload_hash,
  };
}

export async function simulateCertificate(
  body: SimulateCertificateBody,
): Promise<SimulationResult> {
  try {
    const raw = await apiFetch<RawSimulationResponse>('/api/certificates/simulate', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return flattenSimulation(raw);
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
