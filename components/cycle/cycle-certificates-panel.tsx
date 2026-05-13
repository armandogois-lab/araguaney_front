'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { UseQueryResult } from '@tanstack/react-query';
import { Pill } from '@/components/ui/pill';
import { CertificateStatusPill } from '@/components/certificates/certificate-status-pill';
import { fmtDate } from '@/lib/format/date';
import { fmtMoney2 } from '@/lib/format/money';
import { fmtPct } from '@/lib/format/percent';
import type { CertificateSummary, CertificatesListResponse } from '@/lib/types/certificate';

interface Props {
  certsQ: UseQueryResult<CertificatesListResponse>;
}

const VISIBLE_LIMIT = 10;

export function CycleCertificatesPanel({ certsQ }: Props) {
  return (
    <div className="bg-card border-border-subtle overflow-hidden rounded-xl border">
      <div className="border-border-subtle flex items-center justify-between border-b px-5 py-3">
        <h3 className="text-[13px] font-semibold tracking-[-0.2px]">Certificados de la semana</h3>
        <Link href="/certificates" className="text-text-3 text-[11px] hover:underline">
          Ver todos →
        </Link>
      </div>
      <PanelBody certsQ={certsQ} />
    </div>
  );
}

function PanelBody({ certsQ }: Props) {
  const router = useRouter();
  if (certsQ.isLoading) return <Centered>Cargando certificados…</Centered>;
  if (certsQ.isError || !certsQ.data) return <Centered>No se pudo cargar.</Centered>;
  if (certsQ.data.data.length === 0)
    return <Centered italic>Sin certificados emitidos esta semana.</Centered>;
  const rows = certsQ.data.data.slice(0, VISIBLE_LIMIT);
  return (
    <table className="w-full text-[12px]">
      <thead className="bg-subtle">
        <tr>
          <Th>Código</Th>
          <Th>Inversor</Th>
          <Th align="right">Capital</Th>
          <Th align="right">Tasa</Th>
          <Th>Vence</Th>
          <Th>Estado</Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((c) => (
          <tr
            key={c.id}
            onClick={() => router.push(`/certificates/${c.id}`)}
            className="border-border-soft hover:bg-subtle cursor-pointer border-b"
          >
            <td className="text-text-2 px-4 py-3 font-mono text-[11.5px]">{c.certificate_code}</td>
            <td className="max-w-[200px] truncate px-4 py-3" title={c.investor.legal_name}>
              {c.investor.legal_name}
            </td>
            <td className="num px-4 py-3 text-right font-medium">
              {fmtMoney2(Number(c.investor_capital))}
            </td>
            <td className="num px-4 py-3 text-right">{fmtPct(c.annual_rate)}</td>
            <td className="num px-4 py-3">{fmtDate(c.maturity_date)}</td>
            <td className="px-4 py-3">
              <CellPill cert={c} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CellPill({ cert }: { cert: CertificateSummary }) {
  if (cert.certificate_type === 'sweep') return <Pill variant="sweep">Barrido Cashea</Pill>;
  return <CertificateStatusPill status={cert.status} />;
}

function Th({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  const alignClass = align === 'right' ? 'text-right' : 'text-left';
  return (
    <th
      className={`text-text-3 border-border-subtle border-b px-4 py-2.5 ${alignClass} text-[9.5px] font-medium tracking-[0.7px] uppercase`}
    >
      {children}
    </th>
  );
}

function Centered({ children, italic = false }: { children: React.ReactNode; italic?: boolean }) {
  return (
    <div
      className={
        'text-text-3 flex h-32 items-center justify-center px-5 text-sm ' + (italic ? 'italic' : '')
      }
    >
      {children}
    </div>
  );
}
