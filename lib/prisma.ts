import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { withTransientRetry } from "@/src/lib/prisma-retry";

// Bound the pool per process. Next.js prerenders several pages in parallel
// workers, and Supabase's pooler has a hard connection limit. An unbounded
// pool (pg defaults to 10) multiplied by every worker exhausts it during
// `next build`, which makes otherwise healthy deployments fail.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  max: 2,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 10_000,
});

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
