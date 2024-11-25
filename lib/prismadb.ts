import { PrismaClient } from "@prisma/client";

declare global {
  let prisma: PrismaClient | undefined;
}
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
