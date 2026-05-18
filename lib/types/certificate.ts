export type CertificateStatus = 'draft' | 'issued' | 'matured' | 'cancelled';
export type CertificateType = 'standard' | 'sweep';
export type CertificateTermDays = 14 | 42;

export interface CertificateInvestorRef {
  id: string;
  legal_name: string;
  rif: string;
}

export interface CertificateIssuedBy {
  id: string;
  email: string;
  full_name: string;
}

/** Wire shape from GET /api/certificates list rows AND POST /api/certificates/:id/cancel. */
export interface CertificateSummary {
  id: string;
  certificate_code: string | null;
  certificate_type: CertificateType;
  status: CertificateStatus;
  investor: CertificateInvestorRef;
  investor_capital: string;
  annual_rate: string;
  term_days: CertificateTermDays;
  price: string;
  nominal_target: string;
  nominal_actual: string;
  investor_paid: string;
  investor_yield: string;
  shortfall_pct: string;
  issue_date: string;
  maturity_date: string;
  cycle_week: string;
  issued_by: CertificateIssuedBy;
  created_at: string;
}

export interface Cancellation {
  cancelled_at: string;
  cancelled_by: CertificateIssuedBy | null;
  reason: string | null;
}

export interface CertificateOrderInstallment {
  installment_number: number;
  amount: string;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
}

export interface CertificateOrder {
  id: string;
  external_order_id: string;
  merchant: { id: string; current_name: string; rif: string };
  purchase_date: string;
  max_due_date: string;
  installments_sum_snapshot: string;
  assigned_at: string;
  installments: CertificateOrderInstallment[];
}

export interface CertificateEvent {
  id: string;
  event_type: string;
  occurred_at: string;
  payload: unknown;
  actor_id: string | null;
}

/** Wire shape from GET /api/certificates/:id AND POST /api/certificates (issue). */
export interface CertificateDetail extends CertificateSummary {
  investor_returned: string;
  payload_hash: string;
  cancellation: Cancellation | null;
  approved_by: { id: string; full_name: string } | null;
  approved_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  orders: CertificateOrder[];
  events: CertificateEvent[];
}

/** Back-compat alias — the wizard's issueCertificate returns this (the back returns full detail). */
export type Certificate = CertificateDetail;

export interface CertificatesListResponse {
  data: CertificateSummary[];
  total: number;
  limit: number;
  offset: number;
}

// === Below: types kept from Slice 4 (wizard simulation, untouched) ===

export interface SimConcentrationItem {
  merchant_id: string;
  current_name: string;
  rif: string;
  amount: string;
  pct: string;
}

export interface SimDueDateItem {
  date: string;
  amount: string;
}

export interface SimSelectedOrder {
  id: string;
  installments_sum: string;
  merchant_id: string;
  num_installments: number;
  max_due_date: string;
}

export interface SimulationResult {
  investor: CertificateInvestorRef;
  capital: string;
  rate: string;
  term_days: CertificateTermDays;
  issue_date: string;
  maturity_date: string;
  price: string;
  nominal_target: string;
  nominal_actual: string;
  investor_paid: string;
  investor_returned: string;
  investor_yield: string;
  shortfall_pct: string;
  selected_orders: SimSelectedOrder[];
  total_eligible_merchants: number;
  total_distinct_merchants: number;
  installment_plazo_days: { min: number; max: number };
  concentration_top: SimConcentrationItem[];
  due_date_distribution: SimDueDateItem[];
  payload_hash: string;
}
