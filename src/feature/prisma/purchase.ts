import prisma from "@/lib/prisma";
import Stripe from "stripe";

export const createPurchase = async({ userId, tutorId, intentData }: { userId: string; tutorId: string; intentData: Stripe.PaymentIntent }) => {
  try {
    await prisma.purchase.create({
      data: {
        userId,
        tutorId,
        paymentIntentId: intentData.id,
        amount: intentData.amount,
      },
    });
  } catch(err) {
    throw err;
  };
};

export const updatePurchase = async ({ userId, tutorId, intentData }: { userId: string; tutorId: string; intentData: Stripe.PaymentIntent; }) => {
  try {
    await prisma.purchase.update({
      where: {
        userId_tutorId: { userId, tutorId },
      },
      data: {
        paymentIntentId: intentData.id,
        amount: intentData.amount,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getPurchase = async({ userId, tutorId }: { userId: string; tutorId: string; }) => {
  try {
    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_tutorId: {
          userId: userId,
          tutorId: tutorId,
        },
      },
    });
    return purchase;
  } catch(err) {
    throw err;
  };
};

export const getPurchaseInfo = async({ userId }: { userId: string }) => {
  try {
    const purchasesInfo = await prisma.purchase.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: { tutor: true },
    });
    return purchasesInfo
  } catch(err) {
    throw err;
  };
};