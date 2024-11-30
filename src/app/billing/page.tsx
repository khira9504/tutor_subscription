// import { getUserById } from '@/feature/prisma/user';
// import { getBillingPortalURL } from '@/feature/stripe/stripe';
import { Billing } from '@/components/billing/Billing';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';

export default async function page() {
  const session = await getAuthSession();
  if (!session) return redirect("/login");

  // const user = await getUserById({ userId: session.user.id });
  // if (!user || !user.customerId) return <div>請求はありません</div>;

  // const url = await getBillingPortalURL({ customerId: user.customerId, returnPath: "/billing" });
  
  return (
    <main className="max-w-screen-sm mx-auto">
      <Billing session={session} />
    </main>
  );
};
