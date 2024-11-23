import { createCustomerById } from "@/feature/stripe/stripe";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";


export default async function page() {
  const session = await getAuthSession();
  // sessionが存在しない場合、ログインページにリダイレクトします
  if (!session) {
    redirect("/login");
  }
  await createCustomerId({ userId: session.user.id });

  return (
    <div>決済ページ</div>
  );
};
