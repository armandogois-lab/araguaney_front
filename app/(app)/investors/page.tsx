import { ComingSoon } from '@/components/layout/coming-soon';
import { PageHeader } from '@/components/layout/page-header';

export default function InvestorsPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-9 py-7">
      <PageHeader breadcrumb={{ section: 'Operación', current: 'Inversores' }} title="Inversores" />
      <ComingSoon />
    </div>
  );
}
