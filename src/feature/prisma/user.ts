export const getUserById = async({ userId }: { userId: string }) => {
  try {
    const user = await prisma?.user.findUnique({ where: { id: userId } });
    return user;
  } catch(err) {
    throw err;
  };
};