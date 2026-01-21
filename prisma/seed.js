import bcrypt from "bcrypt";
import { prisma } from "../app/lib/db/prisma.js";

async function main() {
  const adminEmail = "admin@servex.com";
  const adminPassword = "Admin@123456";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("✅ Admin already exists");
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log("🚀 Admin user created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
