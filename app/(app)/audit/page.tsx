import { ComingSoon } from '@/components/layout/coming-soon';
import { PageHeader } from '@/components/layout/page-header';

export default function AuditPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-9 py-7">
      <PageHeader breadcrumb={{ section: 'Sistema', current: 'Auditoría' }} title="Auditoría" />
      <ComingSoon />
    </div>
  );
}
