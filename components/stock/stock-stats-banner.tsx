'use client';

import { useQuery } from '@tanstack/react-query';
import { getOrdersStats } from '@/lib/api/orders';
import { countCertificatesIssued } from '@/lib/api/certificates';
import { mondayOfThisWeekUTC, todayUTC } from '@/lib/format/week';
import { fmtMoney2 } from '@/lib/format/money';

export function StockStatsBanner() {
  const stats = useQuery({
    queryKey: ['orders-stats'],
    queryFn: () => getOrdersStats(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const monday = mondayOfThisWeekUTC();
  const today = todayUTC();
  const certs = useQuery({
    queryKey: ['certs-this-week', monday, today],
    queryFn: () => countCertificatesIssued(monday, today),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const capitalValue = stats.isSuccess ? fmtMoney2(Number(stats.data.available_capital)) : '—';
  const ordersValue = stats.isSuccess
    ? stats.data.by_status.available.count.toLocaleString('en-US')
    : '—';
  const certsValue = certs.isSuccess ? String(certs.data.total) : '—';

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <Card label="Capital disponible" value={capitalValue} sub="nominal disponible" />
      <Card label="Órdenes disponibles" value={ordersValue} sub="disponibles para emisión" />
      <Card
        label="Certs esta semana"
        value={certsValue}
        sub={`desde lun ${formatMondayShort(monday)}`}
      />
    </div>
  );
}

function Card({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-card border-border-subtle rounded-lg border p-4">
      <div className="text-text-3 text-[10px] tracking-wide uppercase">{label}</div>
      <div className="mt-1 text-[20px] font-semibold tabular-nums tracking-[-0.3px]">{value}</div>
      <div className="text-text-3 mt-0.5 text-[11px]">{sub}</div>
    </div>
  );
}

function formatMondayShort(iso: string): string {
  const [, m, d] = iso.split('-');
  return `${d}/${m}`;
}
