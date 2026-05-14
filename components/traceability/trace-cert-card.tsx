'use client';

import type { CertificateOrder, CertificateSummary } from '@/lib/types/certificate';
import { TraceCertRow } from './trace-cert-row';
import { TraceCertOrders } from './trace-cert-orders';

interface Props {
  cert: CertificateSummary;
  expanded: boolean;
  onToggle: (certId: string) => void;
  onSelectOrder: (order: CertificateOrder, cert: CertificateSummary) => void;
}

export function TraceCertCard({ cert, expanded, onToggle, onSelectOrder }: Props) {
  return (
    <div className="bg-card border-border-subtle overflow-hidden rounded-xl border">
      <TraceCertRow cert={cert} expanded={expanded} onToggle={onToggle} />
      <TraceCertOrders cert={cert} enabled={expanded} onSelectOrder={onSelectOrder} />
    </div>
  );
}
