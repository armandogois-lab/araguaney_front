import type { MerchantDetail } from '@/lib/types/merchant';
import { MerchantDetailHeader } from './merchant-detail-header';
import { MerchantKpiStrip } from './merchant-kpi-strip';
import { MerchantStatusBreakdown } from './merchant-status-breakdown';
import { MerchantNameHistory } from './merchant-name-history';

interface Props {
  merchant: MerchantDetail;
}

export function MerchantDetailPage({ merchant }: Props) {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-9 py-7">
      <MerchantDetailHeader
        currentName={merchant.current_name}
        rif={merchant.rif}
        firstSeenAt={merchant.first_seen_at}
        lastSeenAt={merchant.last_seen_at}
      />
      <div className="mt-5 flex flex-col gap-4">
        <MerchantKpiStrip
          orderCount={merchant.orders_summary.total_count}
          totalAmount={merchant.orders_summary.total_amount}
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <MerchantStatusBreakdown byStatus={merchant.orders_summary.by_status} />
          <MerchantNameHistory items={merchant.name_history} />
        </div>
      </div>
    </div>
  );
}
