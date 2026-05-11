'use client';

import { useQuery } from '@tanstack/react-query';
import { listInvestors } from '@/lib/api/investors';
import { fmtMoney2 } from '@/lib/format/money';
import { buildQuery } from './investors-table';
import type { InvestorsFiltersValue } from './investors-filters';

interface Props {
  filters: InvestorsFiltersValue;
  page: number;
}

export function InvestorMetricsStrip({ filters, page }: Props) {
  const query = buildQuery(filters, page);
  const { data } = useQuery({
    queryKey: ['investors', query],
    queryFn: () => listInvestors(query),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    placeholderData: (prev) => prev,
  });

  const visible = (data?.data ?? []).filter((i) => i.kind !== 'internal');
  const actives = visible.filter((i) => i.status === 'active');
  const activeCount = actives.length;
  const totalCapital = actives.reduce((acc, i) => acc + Number(i.total_invested), 0);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card
        label="Inversores activos"
        value={String(activeCount)}
        sub={`de ${visible.length} en página`}
      />
      <Card
        label="Capital colocado"
        value={fmtMoney2(totalCapital)}
        sub="en certificados activos"
      />
    </div>
  );
}

function Card({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-card border-border-subtle rounded-xl border p-5">
      <div className="text-text-3 mb-2 text-[10px] uppercase tracking-wide">{label}</div>
      <div className="text-[24px] font-semibold tabular-nums tracking-[-0.3px]">{value}</div>
      <div className="text-text-3 mt-1 text-[11px]">{sub}</div>
    </div>
  );
}
