'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { listMerchants } from '@/lib/api/merchants';
import { MerchantsToolbar, type MerchantsFiltersValue } from './merchants-toolbar';
import { MerchantsTable } from './merchants-table';
import { MerchantsPagination } from './merchants-pagination';

const PAGE_LIMIT = 25;

const INITIAL_FILTERS: MerchantsFiltersValue = {
  q: '',
  sort: 'name_asc',
};

export function MerchantsPage() {
  const router = useRouter();
  const [filters, setFiltersInternal] = useState<MerchantsFiltersValue>(INITIAL_FILTERS);
  const [page, setPage] = useState(0);

  function setFilters(next: MerchantsFiltersValue) {
    setFiltersInternal(next);
    setPage(0);
  }

  const apiQuery = {
    q: filters.q || undefined,
    sort: filters.sort,
    limit: PAGE_LIMIT,
    offset: page * PAGE_LIMIT,
  };

  const merchantsQ = useQuery({
    queryKey: ['merchants', apiQuery],
    queryFn: () => listMerchants(apiQuery),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });

  return (
    <div className="mx-auto w-full max-w-[1440px] px-9 py-7">
      <PageHeader breadcrumb={{ section: 'Datos', current: 'Comercios' }} title="Comercios" />
      <div className="mt-5 flex flex-col gap-4">
        <MerchantsToolbar value={filters} onChange={setFilters} />
        <MerchantsTable
          rows={merchantsQ.data?.data ?? []}
          isLoading={merchantsQ.isLoading}
          isError={merchantsQ.isError}
          onRowClick={(id) => router.push(`/merchants/${id}`)}
          onRetry={() => merchantsQ.refetch()}
        />
        {merchantsQ.data && merchantsQ.data.data.length > 0 && (
          <MerchantsPagination
            offset={merchantsQ.data.offset}
            limit={merchantsQ.data.limit}
            total={merchantsQ.data.total}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
