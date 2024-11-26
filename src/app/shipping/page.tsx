import { getUserById } from "@/feature/prisma/user";
import { getBillingPortalURL, getShippingByCustomerId } from "@/feature/stripe/stripe";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";


export default async function page() {
  const session = await getAuthSession();
  if(!session) redirect("/login");

  const user = await getUserById({ userId: session.user.id });
  if(!user || !user.customerId) redirect("/login");

  const url = await getBillingPortalURL({ customerId: user.customerId, returnPath: "/shipping" });
  const shipping = await getShippingByCustomerId({ customerId: user.customerId });
  if(!shipping || !shipping.address) return <a href={url}>プランの管理</a>;

  return (
    <>
      {shipping && shipping.address && (
        <main className="max-w-screen-md mx-auto">
          <p>{shipping.address.country}</p>
          <p>{shipping.address.postal_code}</p>
          <p>{shipping.address.state}</p>
          <p>{shipping.address.line1}</p>
          <p>{shipping.address.line2}</p>
        </main>
      )}
    </>
  );
};
