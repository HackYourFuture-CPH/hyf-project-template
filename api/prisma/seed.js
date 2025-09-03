import { PrismaClient } from "../src/generated/prisma/index.js";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  console.log("main Started");
  const email = "adminsnabdev@gmail.com";
  const password = "hello12345";
  const name = "Snab Devs";
  const existingUserAdmin = await prisma.user.findFirst({ where: { email } });
  if (existingUserAdmin) {
    return;
  }
  const hashPassword = await bcrypt.hash(password, 12);
  const adminUser = await prisma.user.create({
    data: { email, name, password: hashPassword, role: "ADMIN" },
  });
  console.log(
    "Admin user is created successfully with email :",
    adminUser.email
  );
}
main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
