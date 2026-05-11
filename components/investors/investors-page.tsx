'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { hasPermission } from '@/lib/permissions/has-permission';
import { useUser } from '@/lib/auth/user-context';
import type { InvestorSummary } from '@/lib/types/investor';
import { InvestorsFilters, type InvestorsFiltersValue } from './investors-filters';
import { InvestorsTable } from './investors-table';
import { InvestorMetricsStrip } from './investor-metrics-strip';
import { InvestorCreateModal } from './investor-create-modal';
import { InvestorEditModal } from './investor-edit-modal';

const INITIAL_FILTERS: InvestorsFiltersValue = {
  status: 'active',
  q: '',
};

export function InvestorsPage() {
  const user = useUser();
  const canCreate = hasPermission(user.role, 'investor.create');
  const canEdit = hasPermission(user.role, 'investor.update');

  const [filters, setFiltersInternal] = useState<InvestorsFiltersValue>(INITIAL_FILTERS);
  const [page, setPage] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<InvestorSummary | null>(null);

  function setFilters(next: InvestorsFiltersValue) {
    setFiltersInternal(next);
    setPage(0);
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-9 py-7">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          breadcrumb={{ section: 'Operación', current: 'Inversores' }}
          title="Inversores"
        />
        {canCreate && (
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="bg-foreground text-background rounded-md px-4 py-2 text-[12px] font-medium"
          >
            Registrar inversor
          </button>
        )}
      </div>
      <div className="mt-6 flex flex-col gap-6">
        <InvestorMetricsStrip filters={filters} page={page} />
        <InvestorsFilters value={filters} onChange={setFilters} />
        <InvestorsTable
          filters={filters}
          page={page}
          onPageChange={setPage}
          onEditInvestor={canEdit ? setEditTarget : undefined}
        />
      </div>
      {createOpen && <InvestorCreateModal onClose={() => setCreateOpen(false)} />}
      {editTarget && (
        <InvestorEditModal investor={editTarget} onClose={() => setEditTarget(null)} />
      )}
    </div>
  );
}
