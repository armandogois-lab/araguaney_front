'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { StockStatsBanner } from './stock-stats-banner';
import { StockFilters, type StockFiltersValue } from './stock-filters';
import { StockTable } from './stock-table';
import { NewCertButton } from '@/components/cert-wizard/new-cert-button';
import { NewCertWizard } from '@/components/cert-wizard/new-cert-wizard';

const INITIAL_FILTERS: StockFiltersValue = {
  status: 'available',
  merchantId: null,
  maxDueDateLte: null,
  q: '',
};

export function StockPage() {
  const [filters, setFiltersInternal] = useState<StockFiltersValue>(INITIAL_FILTERS);
  const [page, setPage] = useState(0);
  const [wizardOpen, setWizardOpen] = useState(false);

  function setFilters(next: StockFiltersValue) {
    setFiltersInternal(next);
    setPage(0);
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-9 py-7">
      <PageHeader
        breadcrumb={{ section: 'Operación', current: 'Stock de órdenes' }}
        title="Stock de órdenes"
        actions={<NewCertButton onClick={() => setWizardOpen(true)} />}
      />
      <div className="mt-6 flex flex-col gap-6">
        <StockStatsBanner />
        <StockFilters value={filters} onChange={setFilters} />
        <StockTable filters={filters} page={page} onPageChange={setPage} />
      </div>
      {wizardOpen && <NewCertWizard onClose={() => setWizardOpen(false)} />}
    </div>
  );
}
