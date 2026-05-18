'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import {
  CertificateFilters,
  type CertificateFiltersValue,
  type CertificateStatusFilter,
} from './certificate-filters';
import { CertificatesTable } from './certificates-table';

const VALID_STATUSES: CertificateStatusFilter[] = [
  'issued',
  'draft',
  'all',
  'matured',
  'cancelled',
];

function initialFilters(statusParam: string | null): CertificateFiltersValue {
  const status: CertificateStatusFilter =
    statusParam && (VALID_STATUSES as string[]).includes(statusParam)
      ? (statusParam as CertificateStatusFilter)
      : 'issued';
  return {
    status,
    investorId: null,
    issueDateFrom: null,
    issueDateTo: null,
    q: '',
  };
}

export function CertificatesPage() {
  const searchParams = useSearchParams();
  const [filters, setFiltersInternal] = useState<CertificateFiltersValue>(() =>
    initialFilters(searchParams.get('status')),
  );
  const [page, setPage] = useState(0);

  function setFilters(next: CertificateFiltersValue) {
    setFiltersInternal(next);
    setPage(0);
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-9 py-7">
      <PageHeader
        breadcrumb={{ section: 'Operación', current: 'Certificados' }}
        title="Certificados"
      />
      <div className="mt-6 flex flex-col gap-6">
        <CertificateFilters value={filters} onChange={setFilters} />
        <CertificatesTable filters={filters} page={page} onPageChange={setPage} />
      </div>
    </div>
  );
}
