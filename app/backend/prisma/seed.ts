import { PrismaClient } from "../src/generated/prisma";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password', 10);
  const user = await prisma.user.create({
    data: {
      name: 'テストユーザー',
      email: 'test@xyz.com',
      password: hashedPassword,
    },
  })
  console.log(user)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })