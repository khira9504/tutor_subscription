import prisma from "@/lib/prisma";

export const getUserById = async({ userId }: { userId: string }) => {
  try {
    const user = await prisma?.user.findUnique({ where: { id: userId } });
    return user;
  } catch(err) {
    throw err;
  };
};

export const getUserInformation = async({ userId }: { userId: string }) => {
  try {
    const userInfo = await prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        subscription: true,
      },
    });
    return userInfo;
  } catch(err) {
    throw err;
  };
};