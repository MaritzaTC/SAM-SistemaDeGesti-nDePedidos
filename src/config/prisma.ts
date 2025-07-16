import { PrismaClient } from '@prisma/client';

declare global {
  // Esto permite que TypeScript entienda la variable global
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
