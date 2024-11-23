import { createCustomerById } from "@/feature/stripe/stripe";
import { getAuthSession } from "@/lib/nextauth"
import { redirect } from "next/navigation";


export default async function page() {
  const session = getAuthSession();
  if(!session) {
    redirect("/login");
  };
  await createCustomerById({ userId: session.user.id })

  return (
    <div>決済ページ</div>
  );
};
