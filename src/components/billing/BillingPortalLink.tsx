import { getBillingPortalURL } from "@/feature/stripe/stripe";
import { Button } from "../ui/button";

export default async function BillingPortalLink({ customerId }: { customerId: string | null }) {
  if(!customerId) return null;
  const settingUrl = await getBillingPortalURL({ customerId: customerId, returnPath: "/billing" });

  return (
    <Button asChild className="font-bold cursor-pointer mt-2" variant={"default"}>
      <a href={settingUrl}>プランの詳細確認・変更・キャンセルはこちら</a>
    </Button>
  );
};
