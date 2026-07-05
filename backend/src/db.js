import { prisma } from "./prisma.js";

export async function checkDatabaseConnection() {
  const result = await prisma.$queryRaw`select 1 as ok`;
  return result[0]?.ok === 1;
}
