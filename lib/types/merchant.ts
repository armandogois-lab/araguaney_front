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
