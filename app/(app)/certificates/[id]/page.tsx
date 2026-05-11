import { CertificateDetailPage } from '@/components/certificates/certificate-detail-page';

interface Params {
  params: Promise<{ id: string }>;
}

export default async function CertificateDetailRoute({ params }: Params) {
  const { id } = await params;
  return <CertificateDetailPage id={id} />;
}
