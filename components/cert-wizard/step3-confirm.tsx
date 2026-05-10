'use client';

import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { issueCertificate } from '@/lib/api/certificates';
import { fmtMoney2 } from '@/lib/format/money';
import { fmtPct } from '@/lib/format/percent';
import { fmtDate } from '@/lib/format/date';
import type { Certificate, SimulationResult } from '@/lib/types/certificate';

interface Props {
  simulation: SimulationResult;
  triggerConfirm: boolean;
  onPoolChanged: () => void;
  onSuccess: (cert: Certificate) => void;
  onConfirmStart: () => void;
  onConfirmEnd: () => void;
}

export function Step3Confirm({
  simulation,
  triggerConfirm,
  onPoolChanged,
  onSuccess,
  onConfirmStart,
  onConfirmEnd,
}: Props) {
  const qc = useQueryClient();

  const mut = useMutation({
    mutationFn: issueCertificate,
    onMutate: () => onConfirmStart(),
    onSuccess: (cert) => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['orders-stats'] });
      qc.invalidateQueries({ queryKey: ['certs-this-week'] });
      toast.success(`Certificado ${cert.code} emitido`);
      onSuccess(cert);
      onConfirmEnd();
    },
    onError: (err) => {
      const status = (err as { status?: number }).status;
      const message = err instanceof Error ? err.message : '';
      const isPoolChanged =
        status === 409 ||
        message.toLowerCase().includes('payload_hash') ||
        message.toLowerCase().includes('ya asignada');
      if (isPoolChanged) {
        onPoolChanged();
      } else {
        toast.error(err instanceof Error ? err.message : 'Error al emitir');
      }
      onConfirmEnd();
    },
  });

  useEffect(() => {
    if (triggerConfirm) {
      mut.mutate({
        investor_id: simulation.investor.id,
        capital: Number(simulation.capital),
        rate: Number(simulation.rate),
        term_days: simulation.term_days,
        issue_date: simulation.issue_date,
        order_ids: simulation.selected_orders.map((o) => o.id),
        expected_payload_hash: simulation.payload_hash,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerConfirm]);

  const totalPaid = Number(simulation.investor_paid) + Number(simulation.investor_yield);

  return (
    <div className="flex flex-col gap-4 px-7 py-6">
      <div className="text-[13px]">Vas a emitir un certificado con los siguientes términos:</div>
      <div className="grid grid-cols-2 gap-3">
        <Panel title="Inversor">
          <Row label="Razón social" value={simulation.investor.legal_name} mono={false} />
          <Row label="RIF" value={simulation.investor.rif} mono />
        </Panel>
        <Panel title="Términos">
          <Row label="Capital" value={fmtMoney2(Number(simulation.capital))} />
          <Row label="Tasa" value={fmtPct(simulation.rate)} />
          <Row label="Plazo" value={`${simulation.term_days} días`} />
          <Row label="Emisión" value={fmtDate(simulation.issue_date)} />
          <Row label="Vence" value={fmtDate(simulation.maturity_date)} />
        </Panel>
      </div>
      <Panel title="Pool">
        <Row label="Nominal del certificado" value={fmtMoney2(Number(simulation.nominal_target))} />
        <Row label="Total a recibir" value={fmtMoney2(totalPaid)} />
        <Row label="Órdenes empaquetadas" value={String(simulation.selected_orders.length)} />
        <Row label="Comercios distintos" value={String(simulation.total_distinct_merchants)} />
      </Panel>
      <div className="bg-warn-bg text-warn-text rounded-md px-3 py-2 text-[12px]">
        ⚠️ Esta emisión es irreversible salvo cancelación posterior.
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border-border-subtle rounded-lg border p-4">
      <div className="text-text-3 mb-3 text-[10px] uppercase tracking-wide">{title}</div>
      {children}
    </div>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="border-border-subtle flex items-center justify-between border-b py-2 last:border-0">
      <span className="text-text-3 text-[11px]">{label}</span>
      <span className={'text-[12px] font-medium tabular-nums ' + (mono ? 'font-mono' : '')}>
        {value}
      </span>
    </div>
  );
}
