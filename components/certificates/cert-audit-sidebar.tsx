import { fmtDate } from '@/lib/format/date';
import type { CertificateDetail, CertificateEvent } from '@/lib/types/certificate';

interface Props {
  cert: CertificateDetail;
}

const EVENT_LIMIT = 10;

export function CertAuditSidebar({ cert }: Props) {
  const events = cert.events.slice(0, EVENT_LIMIT);
  return (
    <div className="flex flex-col gap-6">
      <Block title="INVERSOR">
        <KV k="Razón social" v={cert.investor.legal_name} />
        <KV k="RIF" v={cert.investor.rif} mono last />
      </Block>

      <Block title="REGLAS VERIFICADAS">
        <KV k="Vencimientos ≤ certificado" v={<Check />} />
        <KV k="Órdenes indivisibles" v={<Check />} />
        <KV k="Redondeo hacia abajo" v={<Check />} last />
      </Block>

      <Block title="AUDITORÍA">
        {events.length === 0 ? (
          <div className="text-text-3 py-2 text-[11px] italic">Sin eventos registrados.</div>
        ) : (
          events.map((e, i) => <EventRow key={e.id} event={e} last={i === events.length - 1} />)
        )}
      </Block>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border-border-subtle rounded-lg border p-4">
      <div className="text-text-3 mb-3 text-[10px] uppercase tracking-wide">{title}</div>
      {children}
    </div>
  );
}

function KV({
  k,
  v,
  mono = false,
  last = false,
}: {
  k: string;
  v: React.ReactNode;
  mono?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={
        'flex items-center justify-between gap-3 py-1.5 text-[12px] ' +
        (last ? '' : 'border-border-soft border-b')
      }
    >
      <span className="text-text-3">{k}</span>
      <span className={'text-text-2 font-medium tabular-nums ' + (mono ? 'font-mono' : '')}>
        {v}
      </span>
    </div>
  );
}

function Check() {
  return <span className="text-green-text text-[14px]">✓</span>;
}

function EventRow({ event, last }: { event: CertificateEvent; last: boolean }) {
  return (
    <div className={'flex gap-3 py-2 ' + (last ? '' : 'border-border-soft border-b')}>
      <div className="bg-text-3 mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
      <div className="text-[11px] leading-snug">
        <div>
          <b className="text-text-2 font-medium">{event.event_type}</b>
        </div>
        <div className="text-text-3 tabular-nums mt-0.5 text-[10px]">
          {fmtDate(event.occurred_at)}
        </div>
      </div>
    </div>
  );
}
