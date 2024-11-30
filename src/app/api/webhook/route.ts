import { createPurchase, updatePurchase } from "@/feature/prisma/purchase";
import { getLevelFromMetadata } from "@/feature/stripe/stripe";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { upsertSubscription } from "@/feature/stripe/stripe";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get("Stripe-Signature");
  let evt: Stripe.Event;

  try {
    if(!sig) throw new Error("Signatureがありません");
    evt = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch(err) {
    const setErr = err instanceof Error ? err : new Error("Bad Request");
    return new NextResponse(`Webhook Error: ${setErr.message}`, {
      status: 400,
    });
  };

  try {
    switch(evt.type) {
      case "checkout.session.completed": {
        const session = evt.data.object;
        if("subscription" in session && session.subscription) {
          const shippingDetails = session.shipping_details;
          if (shippingDetails !== null) {
            await stripe.customers.update(session.customer as string, {
              shipping: {
                name: shippingDetails.name!,
                address: {
                  country: shippingDetails.address?.country!,
                  postal_code: shippingDetails.address?.postal_code!,
                  city: shippingDetails.address?.city!,
                  state: shippingDetails.address?.state!,
                  line1: shippingDetails.address?.line1!,
                  line2: shippingDetails.address?.line2!,
                },
              },
            });
          };
        } else if("payment_intent" in session && session.payment_intent) {
          const intentData = await stripe.paymentIntents.retrieve(session.payment_intent as string);
          const userId = intentData.metadata.userId;
          const tutorId = intentData.metadata.tutorId;
          await createPurchase({ userId, tutorId, intentData });
        };
        break;
      };
      case "invoice.payment_succeeded": {
        const invoice: Stripe.Invoice = evt.data.object;
        const userId = invoice.subscription_details?.metadata?.userId;
        if (!userId) return new NextResponse("ユーザーIDがありません", { status: 400 });

        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
        const planLevel = getLevelFromMetadata(subscription.items.data[0].price.metadata);

        await upsertSubscription({ userId, subscription, level: planLevel });
        break;
      };
      case "invoice.payment_failed": {
        console.error("サブスクリプションの支払いが失敗しました");
        break;
      };
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription: Stripe.Subscription = evt.data.object;
        const userId = subscription.metadata.userId;
        if (!userId) return new NextResponse("ユーザーIDが存在しません", { status: 400 });
        const planLevel = getLevelFromMetadata(subscription.items.data[0].price.metadata);
        await upsertSubscription({ userId, subscription, level: planLevel });
        break;
      };
      case "payment_intent.succeeded":
      case "payment_intent.canceled":
      case "payment_intent.payment_failed": {
        const intentData = evt.data.object;
        if (intentData.invoice) break;
        const userId = intentData.metadata.userId;
        const tutorId = intentData.metadata.tutorId;
        await updatePurchase({ userId, tutorId, intentData });
        break;
      };
    };
    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse("fail event handle", {
      status: 400,
    });
  }
};