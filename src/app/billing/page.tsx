import { getUserById } from '@/feature/prisma/user';
import { getBillingPortalURL } from '@/feature/stripe/stripe';
import { getAuthSession } from '@/lib/nextauth';

export default async function page() {
  const session = await getAuthSession();
  if (!session) return <div>請求はありません</div>;

  const user = await getUserById({ userId: session.user.id });
  if (!user || !user.customerId) return <div>請求はありません</div>;

  const url = await getBillingPortalURL({ customerId: user.customerId, returnPath: "/billing" });
  
  return (
    <a href={url}>プランの管理</a>
  );
};
