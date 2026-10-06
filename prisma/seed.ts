import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "changeme123";

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, name: "Admin", passwordHash, role: "ADMIN" },
  });

  const category = await prisma.category.upsert({
    where: { slug: "smartphones" },
    update: {},
    create: { name: "Smartphones", slug: "smartphones" },
  });

  await prisma.merchant.upsert({
    where: { slug: "flipkart" },
    update: {},
    create: {
      name: "Flipkart",
      slug: "flipkart",
      network: "flipkart",
      isActive: true,
    },
  });

  console.log("Seeded:");
  console.log(`  Admin login: ${adminEmail} / ${adminPassword}  (change this password immediately)`);
  console.log(`  Category: ${category.name}`);
  console.log("  Merchant: Flipkart");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
