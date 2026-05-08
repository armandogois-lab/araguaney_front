export type BatchStatus = 'uploaded' | 'parsing' | 'imported' | 'rejected' | 'archived';

export interface BatchSummary {
  id: string;
  external_code: string;
  status: BatchStatus;
  rows_imported: number;
  rows_rejected: number;
  total_orders_amount: string;
  total_installments_amount: string;
  imported_at: string | null;
  rejection_reason: string | null;
  uploaded_at: string | null;
  uploaded_by: { id: string; email: string; full_name: string } | null;
}

export interface BatchListResponse {
  data: BatchSummary[];
  total: number;
  limit: number;
  offset: number;
}

export interface UploadBatchInput {
  file: File;
  externalCode?: string;
}
