import Payment from "@/components/payment/Payment";
import { createCustomerById } from "@/feature/stripe/stripe";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";


export default async function page() {
  const session = await getAuthSession();
  if (!session) {
    redirect("/login");
  };
  await createCustomerById({ userId: session.user.id });

  return (
    <div>
      <Payment />
    </div>
  );
};
