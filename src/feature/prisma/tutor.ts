export const getTutorById = async(id: string) => {
  try {
    const tutor = await prisma?.tutor.findUnique({ where: { id } });
    return tutor;
  } catch(err) {
    throw err;
  };
};