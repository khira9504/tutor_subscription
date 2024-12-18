import Stripe from "stripe";
import { Button } from "../ui/button";
import { getLevelFromMetadata, getSubscriptionPaymentUrl } from '@/feature/stripe/stripe';
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";

type SubscriptionButtonProps = {
  price: Pick<Stripe.Price, "id" | "metadata">;
};

export default async function PaymentButton({ price }: SubscriptionButtonProps) {
  const session = await getAuthSession();
  if (!session) {
    redirect("/login");
  };

  const paymentUrl = await getSubscriptionPaymentUrl({ userId: session.user.id, priceId: price.id}) || "/";
  
  const buttonVariant = getLevelFromMetadata(price.metadata) === "Special" ? "special" : "standard";

  return (
    <Button className="w-full cursor-pointer font-bold text-base hover:opacity-[.6] transition-[.2s]" variant={buttonVariant} asChild>
      <a href={ paymentUrl }>コースに登録する</a>
    </Button>
  )
}
