export type OrderStatus = 'available' | 'reserved' | 'assigned' | 'matured' | 'defaulted';

export interface OrderMerchantRef {
  id: string;
  current_name: string;
  rif: string;
}

export interface OrderEndUserRef {
  id: string;
  external_hash: string;
  national_id: string | null;
  full_name: string | null;
}

export interface OrderBatchRef {
  id: string;
  external_code: string;
}

export interface OrderSummary {
  id: string;
  external_order_id: string;
  status: OrderStatus;
  purchase_date: string; // ISO date "YYYY-MM-DD"
  max_due_date: string;
  total_amount: string; // Decimal as string
  installments_sum: string;
  num_installments: number;
  imported_at: string; // ISO timestamp
  merchant: OrderMerchantRef;
  end_user: OrderEndUserRef;
  batch: OrderBatchRef;
}

export interface OrdersListResponse {
  data: OrderSummary[];
  total: number;
  limit: number;
  offset: number;
}

export interface OrdersStatsBucket {
  count: number;
  total_amount: string;
  total_installments_amount: string;
}

export interface OrdersStats {
  by_status: {
    available: OrdersStatsBucket;
    assigned: OrdersStatsBucket;
    matured: OrdersStatsBucket;
    defaulted: OrdersStatsBucket;
  };
  total_orders: number;
  available_capital: string;
}
