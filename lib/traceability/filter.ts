import type { CertificateSummary } from '@/lib/types/certificate';

export type FilterMatchMode = 'all' | 'match-cert';

export interface FilteredCert {
  cert: CertificateSummary;
  mode: FilterMatchMode;
}

export function filterCertsBySearch(certs: CertificateSummary[], query: string): FilteredCert[] {
  const q = query.trim().toLowerCase();
  if (!q) return certs.map((cert) => ({ cert, mode: 'all' as const }));
  const out: FilteredCert[] = [];
  for (const cert of certs) {
    const hay = [
      cert.certificate_code,
      cert.investor.legal_name,
      cert.investor.rif,
      cert.issued_by.full_name,
    ]
      .join(' ')
      .toLowerCase();
    if (hay.includes(q)) out.push({ cert, mode: 'match-cert' });
  }
  return out;
}
