import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function disconnect() {
  await prisma.$disconnect();
}

export default prisma;