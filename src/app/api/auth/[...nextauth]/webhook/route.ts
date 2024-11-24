import { getLevelFromMetadata } from "@/feature/stripe/stripe";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get("Stripe-Signature");
  let evt: Stripe.Event;

  try {
    if(!sig) throw new Error("Signatureがありません");
    evt = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch(err) {
    throw err;
  };

  try {
    switch(evt.type) {
      case "invoice.payment_succeeded": {
        const invoice: Stripe.Invoice = evt.data.object;
        const userId = invoice.subscription_details?.metadata?.userId;
        if(!userId) throw new NextResponse("ユーザーIDがありません", { status: 400 });

        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
        const planLevel = getLevelFromMetadata(subscription.items.data[0].price.metadata);

        await prisma?.subscription.upsert({
          where: { userId },
          update: {
            subscriptionId: subscription.id,
            priceId: subscription.items.data[0].price.id,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            status: subscription.status,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            planLevel: planLevel,
          },
          create: {
            userId: userId,
            subscriptionId: subscription.id,
            priceId: subscription.items.data[0].price.id,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            status: subscription.status,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            planLevel: planLevel,
          },
        });
        break;
      };
      case "invoice.payment_failed": {
        console.error("サブスクリプションの支払いが失敗しました");
        break;
      };
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription: Stripe.Subscription = await evt.data.object;
        const userId = subscription.metadata.userId;
        if(!userId) throw new NextResponse("ユーザーIDがありません", { status: 400 });
        const planLevel = getLevelFromMetadata(subscription.items.data[0].price.metadata);

        await prisma?.subscription.upsert({
          where: { userId },
          update: {
            subscriptionId: subscription.id,
            priceId: subscription.items.data[0].price.id,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            status: subscription.status,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            planLevel: planLevel,
          },
          create: {
            userId: userId,
            subscriptionId: subscription.id,
            priceId: subscription.items.data[0].price.id,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            status: subscription.status,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            planLevel: planLevel,
          },
        });
        break;
      };
    };
  } catch(err) {
    throw err;
  };
};