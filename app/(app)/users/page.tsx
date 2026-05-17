import { getMe } from '@/lib/api/me';
import { UsersPage } from '@/components/users/users-page';

export default async function UsersRoute() {
  const me = await getMe();
  return <UsersPage me={me} />;
}
