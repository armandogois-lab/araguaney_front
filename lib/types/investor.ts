export type InvestorKind = 'juridica' | 'natural' | 'internal';
export type InvestorStatus = 'active' | 'inactive';

export interface InvestorActor {
  id: string;
  email: string;
  full_name: string;
}

export interface InvestorSummary {
  id: string;
  legal_name: string;
  rif: string;
  kind: InvestorKind;
  status: InvestorStatus;
  email: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  updated_by: InvestorActor | null;
  active_cert_count: number;
  total_invested: string;
}

export interface InvestorsListResponse {
  data: InvestorSummary[];
  total: number;
  limit: number;
  offset: number;
}

export interface InvestorCreate {
  legal_name: string;
  rif: string;
  kind: 'juridica' | 'natural';
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
}

export interface InvestorUpdate {
  legal_name?: string;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
  status?: InvestorStatus;
}
