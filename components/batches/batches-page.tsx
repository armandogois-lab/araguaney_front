'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { BatchesTable } from './batches-table';
import { UploadBatchModal } from './upload-batch-modal';
import { UploadButton } from './upload-button';

export function BatchesPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-[1440px] px-9 py-7">
      <PageHeader
        breadcrumb={{ section: 'Datos', current: 'Lotes' }}
        title="Lotes"
        actions={<UploadButton onClick={() => setModalOpen(true)} />}
      />
      <BatchesTable />
      {modalOpen && <UploadBatchModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
