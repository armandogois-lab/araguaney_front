export type InvestorKind = 'juridica' | 'natural' | 'internal';
export type InvestorStatus = 'active' | 'inactive';

export interface InvestorSummary {
  id: string;
  legal_name: string;
  rif: string;
  kind: InvestorKind;
  status: InvestorStatus;
  email: string | null;
  phone: string | null;
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
