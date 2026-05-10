import { fmtDate } from '@/lib/format/date';
import { fmtMoney } from '@/lib/format/money';
import type { OrderSummary } from '@/lib/types/order';
import { OrderStatusPill } from './order-status-pill';

export function OrderRow({ order }: { order: OrderSummary }) {
  return (
    <tr className="border-border-soft hover:bg-subtle border-b transition-colors">
      <td className="text-text-2 px-4 py-3.5 font-mono text-[11.5px]">{order.external_order_id}</td>
      <td className="num px-4 py-3.5">{fmtDate(order.purchase_date)}</td>
      <td className="max-w-[280px] truncate px-4 py-3.5" title={order.merchant.current_name}>
        {order.merchant.current_name}
      </td>
      <td className="num px-4 py-3.5 text-right font-medium">{order.num_installments}</td>
      <td className="num px-4 py-3.5 text-right font-medium">
        {fmtMoney(Number(order.installments_sum))}
      </td>
      <td className="px-4 py-3.5">
        <OrderStatusPill status={order.status} />
      </td>
    </tr>
  );
}
