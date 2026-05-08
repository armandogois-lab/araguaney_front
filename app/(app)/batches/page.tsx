import { ComingSoon } from '@/components/layout/coming-soon';
import { PageHeader } from '@/components/layout/page-header';

export default function BatchesPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-9 py-7">
      <PageHeader breadcrumb={{ section: 'Datos', current: 'Lotes' }} title="Lotes" />
      <ComingSoon />
    </div>
  );
}
