const { PrismaClient } = require("@prisma/client");
const { users, freeTutors, standardTutors, specialTutors } = require("./data");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function seedUsers() {
  try {
    await prisma.user.deleteMany({});
    const initUsers = await Promise.all(
      users.map(async user => {
        const hashPass = await bcrypt.hash(user.password, 10);
        user.password = hashPass;
        return prisma.user.create({ data: { ...user } });
      })
    );
    console.log(`Add ${ initUsers.length } users`);
  } catch(err) {
    console.error("Can not add Seed Users:", err);
  };
};

async function seedTutors() {
  const initRecords = [
    { level: "Free", tutor: freeTutors },
    { level: "Standard", tutor: standardTutors },
    { level: "Special", tutor: specialTutors },
  ];

  try {
    await prisma.tutor.deleteMany({});
    initRecords.forEach(async(records) => {
      const initTutors = await Promise.all(
        records.tutor.map(async(tutor) => {
          const date = new Date();
          return prisma.tutor.create({
            data: {
              ...tutor,
              createdAt: date,
              updatedAt: date,
              accessLevel: records.level,
            }
          });
        })
      );
      console.log(`Add ${ initTutors.length } tutors`);
    });
  } catch(err) {
    console.error("Can not add Seed Tutors:", err);
  };
};

(async() => {
  await seedUsers();
  await seedTutors();
})();