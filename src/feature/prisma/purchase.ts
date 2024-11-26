import prisma from "@/lib/prisma";

export const createPurchase = async({ userId, tutorId }: { userId: string; tutorId: string; }) => {
  try {
    await prisma.purchase.create({
      data: {
        userId,
        tutorId
      },
    });
  } catch(err) {
    throw err;
  };
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
