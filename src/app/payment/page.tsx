import Payment from "@/components/payment/Payment";
import { createCustomerById } from "@/feature/stripe/stripe";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";

type SearchParamsProps = {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function page({ searchParams }: SearchParamsProps) {
  const query = await searchParams?.tutor_id;
  const tutorId = Array.isArray(query) ? undefined : query;
  const session = await getAuthSession();
  if(!session) redirect("/login");
  await createCustomerById({ userId: session.user.id });

  return (
    <div>
      <Payment tutorId={ tutorId } />
    </div>
  );
};
