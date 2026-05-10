export type CertificateStatus = 'draft' | 'issued' | 'matured' | 'cancelled';
export type CertificateType = 'standard' | 'sweep';
export type CertificateTermDays = 14 | 42;

export interface Certificate {
  id: string;
  code: string;
  status: CertificateStatus;
  certificate_type: CertificateType;
  investor: { id: string; legal_name: string; rif: string };
  capital: string;
  rate: string;
  term_days: CertificateTermDays;
  issue_date: string;
  maturity_date: string;
  nominal_target: string;
  nominal_actual: string;
  investor_paid: string;
  investor_yield: string;
  num_orders: number;
  issued_at: string | null;
}

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
  investor: { id: string; legal_name: string; rif: string };
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
