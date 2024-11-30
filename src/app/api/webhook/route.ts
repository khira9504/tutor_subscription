import { createPurchase, updatePurchase } from "@/feature/prisma/purchase";
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
          const tutorId = intentData.metadata.articleId;
          await createPurchase({ userId, tutorId, intentData });
        };
        break;
      };
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
      case "payment_intent.succeeded":
      case "payment_intent.canceled":
      case "payment_intent.payment_failed": {
        const intentData = evt.data.object as Stripe.PaymentIntent;
        if (intentData.invoice) break;
        const userId = intentData.metadata.userId;
        const tutorId = intentData.metadata.articleId;
        await updatePurchase({ userId, tutorId, intentData });
        break;
      };
    };
  } catch(err) {
    throw err;
  };
};