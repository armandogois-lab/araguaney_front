'use client';

import { useQuery } from '@tanstack/react-query';
import { getCertificateDetail } from '@/lib/api/certificates';
import { fmtMoney2 } from '@/lib/format/money';
import { Pill } from '@/components/ui/pill';
import type { CertificateOrder, CertificateSummary } from '@/lib/types/certificate';

interface Props {
  cert: CertificateSummary;
  enabled: boolean;
  onSelectOrder: (order: CertificateOrder, cert: CertificateSummary) => void;
}

const VISIBLE_LIMIT = 10;

export function TraceCertOrders({ cert, enabled, onSelectOrder }: Props) {
  const detailQ = useQuery({
    queryKey: ['certificate', cert.id],
    queryFn: () => getCertificateDetail(cert.id),
    staleTime: 30_000,
    enabled,
  });

  if (!enabled) return null;
  if (detailQ.isLoading)
    return <div className="text-text-3 px-9 py-4 text-[12px]">Cargando órdenes…</div>;
  if (detailQ.isError || !detailQ.data)
    return (
      <div className="px-9 py-4">
        <span className="text-warn-text text-[12px]">No se pudieron cargar las órdenes. </span>
        <button
          type="button"
          onClick={() => detailQ.refetch()}
          className="text-text-2 text-[12px] underline hover:no-underline"
        >
          Reintentar
        </button>
      </div>
    );

  const orders = detailQ.data.orders;
  const visible = orders.slice(0, VISIBLE_LIMIT);
  const remaining = orders.length - visible.length;

  return (
    <div className="relative px-9 py-1">
      {visible.map((o, i) => {
        const isLast = i === visible.length - 1;
        return (
          <div
            key={o.id}
            onClick={() => onSelectOrder(o, cert)}
            className="relative grid cursor-pointer items-center gap-3 rounded-md px-3 py-2 hover:bg-subtle grid-cols-[1fr_1.6fr_60px_90px]"
          >
            <span
              className="bg-border-strong absolute top-0 left-0 w-px"
              style={{ bottom: isLast ? '50%' : 0 }}
            />
            <span className="bg-border-strong absolute top-1/2 left-0 h-px w-2.5" />
            <div className="text-text-2 font-mono text-[11.5px]">{o.external_order_id}</div>
            <div className="truncate text-[11.5px]" title={o.merchant.current_name}>
              {o.merchant.current_name}
            </div>
            <div className="text-center">
              <Pill variant="neutral">{o.installments.length}c</Pill>
            </div>
            <div className="num text-right text-[11.5px]">
              {fmtMoney2(Number(o.installments_sum_snapshot))}
            </div>
          </div>
        );
      })}
      {remaining > 0 && (
        <div className="text-text-3 px-3 py-2 text-[11px] italic">
          … {remaining} órdenes más en este certificado
        </div>
      )}
    </div>
  );
}
