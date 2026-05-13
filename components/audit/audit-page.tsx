'use client';

import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import type { AuditEntry } from '@/lib/types/audit';
import { AuditFilters, type AuditFiltersValue } from './audit-filters';
import { AuditTable } from './audit-table';
import { AuditDetailModal } from './audit-detail-modal';

function defaultFilters(): AuditFiltersValue {
  const today = new Date();
  const thirty = new Date();
  thirty.setDate(thirty.getDate() - 30);
  return {
    entityType: 'all',
    action: 'all',
    dateFrom: thirty.toISOString().slice(0, 10),
    dateTo: today.toISOString().slice(0, 10),
  };
}

export function AuditPage() {
  const initial = useMemo(() => defaultFilters(), []);
  const [filters, setFiltersInternal] = useState<AuditFiltersValue>(initial);
  const [page, setPage] = useState(0);
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);

  function setFilters(next: AuditFiltersValue) {
    setFiltersInternal(next);
    setPage(0);
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-9 py-7">
      <PageHeader breadcrumb={{ section: 'Sistema', current: 'Auditoría' }} title="Auditoría" />
      <div className="mt-6 flex flex-col gap-6">
        <AuditFilters value={filters} onChange={setFilters} />
        <AuditTable
          filters={filters}
          page={page}
          onPageChange={setPage}
          onSelectEntry={setSelectedEntry}
        />
      </div>
      {selectedEntry && (
        <AuditDetailModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
      )}
    </div>
  );
}
