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
      lookup_keys: ["premium", "standard"],
      expand: ["data.product"],
    });
    return prices.data;
  } catch (error) {
    throw error;
  };
};

export const getLevelFromMetadata = ({ metadata }: Stripe.Metadata): SubscriptionLevelType => {
  switch(metadata.level) {
    case "Premium": {
      return SubscriptionLevelType.Special;
    };
    case "Standard": {
      return SubscriptionLevelType.Standard;
    };
    default: {
      throw new Error("Metadata.level が存在しません。metadata:", metadata);
    };
  };
};