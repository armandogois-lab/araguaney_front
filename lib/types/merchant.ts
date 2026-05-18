export interface MerchantSummary {
  id: string;
  rif: string;
  current_name: string;
  first_seen_at: string;
  last_seen_at: string;
  order_count: number;
  total_orders_amount: string;
}

export interface MerchantsListResponse {
  data: MerchantSummary[];
  total: number;
  limit: number;
  offset: number;
}

export interface MerchantNameHistoryItem {
  id: string;
  name: string;
  effective_from: string;
  effective_to: string | null;
}

export type MerchantOrderStatus = 'available' | 'assigned' | 'matured' | 'defaulted';

export interface MerchantOrdersSummary {
  total_count: number;
  total_amount: string;
  by_status: Record<MerchantOrderStatus, number>;
}

export interface MerchantDetail {
  id: string;
  rif: string;
  current_name: string;
  first_seen_at: string;
  last_seen_at: string;
  order_count: number;
  total_orders_amount: string;
  name_history: MerchantNameHistoryItem[];
  orders_summary: MerchantOrdersSummary;
}
