import { stripe } from "@/lib/stripe";
import { getUserById } from "../prisma/user";
import Stripe from "stripe";
import { SubscriptionLevelType } from "@prisma/client";

export const createCustomerById = async({ userId }: { userId: string }) => {
  try {
    const user = await getUserById({ userId });
    if(!user) {
      throw new Error(`ユーザーが存在しません : ${userId}`);
    };
    if(user.customerId) {
      return;
    };

    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      preferred_locales: ["ja"],
      metadata: {
        userId,
      },
    });

    try {
      await prisma?.user.update({
        where: { id: userId },
        data: {
          customerId: customer.id,
        },
      });
    } catch(err) {
      throw err;
    };
  } catch(err) {
    throw err;
  };
};

export const getStripePrices = async() => {
  try {
    const prices = await stripe.prices.list({
      lookup_keys: ["special", "standard"],
      expand: ["data.product"],
    });
    return prices.data;
  } catch (error) {
    throw error;
  };
};

export const getLevelFromMetadata = (metadata: Stripe.Metadata): SubscriptionLevelType => {
  switch (metadata.level) {
    case "Special": {
      return SubscriptionLevelType.Special;
    };
    case "Standard": {
      return SubscriptionLevelType.Standard;
    };
    default: {
      throw new Error("メタデータが存在しません:", metadata);
    };
  };
};

export const getSubscriptionPaymentUrl = async({ userId, priceId }: { userId: string; priceId: string }) => {
  try {
    const user = await getUserById({ userId });
    if(!user) {
      throw new Error(`ユーザーが存在しません: ${userId}`);
    };

    const customerId = user.customerId;
    if (!customerId) {
      throw new Error(`カスタマーIDが存在しません: ${userId}`);
    };

    const session = await stripe.checkout.sessions.create({
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment`,
      payment_method_types: ["card"],
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      billing_address_collection: "auto",
      metadata: {
        userId,
      },
      subscription_data: {
        metadata: {
          userId,
        },
      },
    });
    return session.url;
  } catch(err) {
    throw err;
  };
};