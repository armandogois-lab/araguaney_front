'use client';

import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/layout/page-header';
import { listCertificates } from '@/lib/api/certificates';
import { filterCertsBySearch } from '@/lib/traceability/filter';
import type {
  CertificateDetail,
  CertificateOrder,
  CertificateSummary,
} from '@/lib/types/certificate';
import { TraceKpiStrip } from './trace-kpi-strip';
import { TraceToolbar, type TraceFiltersValue } from './trace-toolbar';
import { TraceCertCard } from './trace-cert-card';
import { TraceInspector } from './trace-inspector';

function defaultFilters(): TraceFiltersValue {
  const today = new Date();
  const thirty = new Date();
  thirty.setDate(thirty.getDate() - 30);
  return {
    q: '',
    dateFrom: thirty.toISOString().slice(0, 10),
    dateTo: today.toISOString().slice(0, 10),
  };
}

export function TraceabilityPage() {
  const initial = useMemo(() => defaultFilters(), []);
  const [filters, setFilters] = useState<TraceFiltersValue>(initial);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<{
    order: CertificateOrder;
    cert: CertificateSummary;
  } | null>(null);
  const qc = useQueryClient();

  const certsQ = useQuery({
    queryKey: [
      'certificates',
      {
        issue_date_from: filters.dateFrom,
        issue_date_to: filters.dateTo,
        sort: 'issue_date_desc',
        limit: 100,
      },
    ],
    queryFn: () =>
      listCertificates({
        issue_date_from: filters.dateFrom,
        issue_date_to: filters.dateTo,
        sort: 'issue_date_desc',
        limit: 100,
      }),
    staleTime: 60_000,
  });

  const visible = filterCertsBySearch(certsQ.data?.data ?? [], filters.q);

  function toggleExpand(certId: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(certId)) next.delete(certId);
      else next.add(certId);
      return next;
    });
  }

  const hasInspector = selected !== null;
  const selectedHash =
    selected && qc.getQueryData<CertificateDetail>(['certificate', selected.cert.id])?.payload_hash;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-9 py-7">
      <PageHeader
        breadcrumb={{ section: 'Sistema', current: 'Trazabilidad' }}
        title="Reporte de trazabilidad"
      />
      <div className="mt-5 flex flex-col gap-4">
        <TraceKpiStrip certsQ={certsQ} />
        <TraceToolbar value={filters} onChange={setFilters} />
        <div
          className={
            hasInspector ? 'grid items-start gap-4 lg:grid-cols-[1fr_340px]' : 'flex flex-col gap-3'
          }
        >
          <div className="flex flex-col gap-3">
            {certsQ.isLoading && <CenteredCard>Cargando certificados…</CenteredCard>}
            {certsQ.isError && <CenteredCard>No se pudieron cargar los certificados.</CenteredCard>}
            {!certsQ.isLoading && !certsQ.isError && visible.length === 0 && (
              <CenteredCard italic>Sin certificados en este período.</CenteredCard>
            )}
            {visible.map(({ cert }) => (
              <TraceCertCard
                key={cert.id}
                cert={cert}
                expanded={expanded.has(cert.id)}
                onToggle={toggleExpand}
                onSelectOrder={(order, c) => setSelected({ order, cert: c })}
              />
            ))}
          </div>
          {selected && (
            <TraceInspector
              order={selected.order}
              cert={selected.cert}
              payloadHash={selectedHash ?? null}
              onClose={() => setSelected(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function CenteredCard({
  children,
  italic = false,
}: {
  children: React.ReactNode;
  italic?: boolean;
}) {
  return (
    <div className="bg-card border-border-subtle flex h-48 items-center justify-center rounded-xl border">
      <div className={'text-text-3 text-center text-sm ' + (italic ? 'italic' : '')}>
        {children}
      </div>
    </div>
  );
}
