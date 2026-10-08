const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.adminUser.findMany();
  console.log("Current users:", users);

  if (users.length > 0) {
    const updated = await prisma.adminUser.updateMany({
      data: { role: "ADMIN" }
    });
    console.log("Updated", updated.count, "users to ADMIN role");
  }
}

main().finally(() => prisma.$disconnect());