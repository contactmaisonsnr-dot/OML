import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

const adapter = new PrismaBetterSqlite3({
  url: `file:${path.join(process.cwd(), "dev.db")}`,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@oml.fr" },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: "admin@oml.fr",
        username: "admin",
        passwordHash: await bcrypt.hash("admin1234", 10),
        firstName: "Admin",
        lastName: "OML",
        role: "ADMIN",
        membershipPaid: true,
        memberNumber: 1,
      },
    });
    console.log("Admin créé : admin@oml.fr / admin1234");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
