import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { withTransientRetry } from "@/src/lib/prisma-retry";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });

const READ_OPERATIONS = new Set([
  "findMany",
  "findUnique",
  "findUniqueOrThrow",
  "findFirst",
  "findFirstOrThrow",
  "count",
  "aggregate",
  "groupBy",
  "findRaw",
  "aggregateRaw",
]);

function createBasePrisma() {
  return new PrismaClient({ adapter });
}

type BasePrisma = ReturnType<typeof createBasePrisma>;
type ExtendedPrisma = ReturnType<typeof extendPrisma>;

function extendPrisma(client: BasePrisma) {
  return client.$extends({
    query: {
      async $allOperations({ operation, args, query }) {
        if (!READ_OPERATIONS.has(operation)) return query(args);
        return withTransientRetry(() => query(args));
      },
    },
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrisma | undefined;
  basePrisma: BasePrisma | undefined;
};

export const basePrisma = globalForPrisma.basePrisma ?? createBasePrisma();
export const prisma = globalForPrisma.prisma ?? extendPrisma(basePrisma);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.basePrisma = basePrisma;
  globalForPrisma.prisma = prisma;
}
