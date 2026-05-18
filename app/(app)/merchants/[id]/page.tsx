import { notFound } from 'next/navigation';
import { ApiError } from '@/lib/api/error';
import { getMerchantDetail } from '@/lib/api/merchants';
import { MerchantDetailPage } from '@/components/merchants/merchant-detail-page';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MerchantDetailRoute({ params }: Props) {
  const { id } = await params;
  let merchant;
  try {
    merchant = await getMerchantDetail(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
  return <MerchantDetailPage merchant={merchant} />;
}
