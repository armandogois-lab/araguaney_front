'use client';

import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { PageHeader } from '@/components/layout/page-header';
import { useUser } from '@/lib/auth/user-context';
import { getOrdersStats } from '@/lib/api/orders';
import { listCertificates } from '@/lib/api/certificates';
import { listBatches } from '@/lib/api/batches';
import { listAudit } from '@/lib/api/audit';
import { currentCycleRange } from '@/lib/format/iso-week';
import type { OrdersStats } from '@/lib/types/order';
import type { CertificatesListResponse } from '@/lib/types/certificate';
import { CycleCtaButtons } from './cycle-cta-buttons';
import { CycleBanner } from './cycle-banner';
import { CycleMetricsStrip } from './cycle-metrics-strip';
import { CycleCertificatesPanel } from './cycle-certificates-panel';
import { CycleBatchesPanel } from './cycle-batches-panel';
import { CycleActivityFeed } from './cycle-activity-feed';

function computePctAssigned(
  stats: OrdersStats | undefined,
  certs: CertificatesListResponse | undefined,
): number {
  if (!stats || !certs) return 0;
  const assigned = certs.data.reduce((acc, c) => acc + Number(c.investor_capital), 0);
  const available = Number(stats.available_capital);
  const denom = assigned + available;
  return denom > 0 ? assigned / denom : 0;
}

export function CyclePage() {
  const user = useUser();
  const range = useMemo(() => currentCycleRange(), []);

  const [statsQ, certsQ, batchesQ, auditQ] = useQueries({
    queries: [
      {
        queryKey: ['orders-stats'],
        queryFn: getOrdersStats,
        staleTime: 60_000,
      },
      {
        queryKey: [
          'certificates',
          {
            issue_date_from: range.monday,
            issue_date_to: range.friday,
            sort: 'issue_date_desc',
            limit: 50,
          },
        ],
        queryFn: () =>
          listCertificates({
            issue_date_from: range.monday,
            issue_date_to: range.friday,
            sort: 'issue_date_desc',
            limit: 50,
          }),
        staleTime: 60_000,
      },
      {
        queryKey: ['batches', { status: 'imported' as const }],
        queryFn: () => listBatches({ status: 'imported', limit: 50 }),
        staleTime: 60_000,
      },
      {
        queryKey: ['audit', { occurred_at_from: range.monday, limit: 8 }],
        queryFn: () => listAudit({ occurred_at_from: range.monday, limit: 8 }),
        staleTime: 60_000,
      },
    ],
  });

  const pctAssigned = computePctAssigned(statsQ.data, certsQ.data);

  return (
    <div className="mx-auto w-full max-w-[1440px] px-9 py-7">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          breadcrumb={{ section: 'Operación', current: 'Panel del ciclo' }}
          title="Panel del ciclo"
        />
        <CycleCtaButtons userRole={user.role} />
      </div>
      <div className="mt-5 flex flex-col gap-4">
        <CycleBanner
          weekNumber={range.weekNumber}
          weekLabel={range.weekLabel}
          dayIndex={range.dayIndex}
          pctAssigned={pctAssigned}
        />
        <CycleMetricsStrip statsQ={statsQ} certsQ={certsQ} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
          <CycleCertificatesPanel certsQ={certsQ} />
          <div className="flex flex-col gap-4">
            <CycleBatchesPanel batchesQ={batchesQ} />
            <CycleActivityFeed auditQ={auditQ} />
          </div>
        </div>
      </div>
    </div>
  );
}
