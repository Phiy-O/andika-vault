import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { withTransientRetry } from "@/src/lib/prisma-retry";

/**
 * Build workers are limited separately in next.config.ts (experimental.cpus),
 * so the pool itself can stay at pg's normal size at runtime. A too-small
 * pool turns ordinary page concurrency into 10-second queue timeouts.
 */
export function resolvePoolMax(): number {
  const configured = Number(process.env.PRISMA_POOL_MAX);
  if (Number.isInteger(configured) && configured > 0) return configured;
  // Supabase's session pooler allows only 15 clients. Build workers are the
  // only phase that opens several clients in one process, so keep them small.
  if (process.env.NEXT_PHASE === "phase-production-build") return 2;
  return 10;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

const adapter = new PrismaPg({
  connectionString,
  max: resolvePoolMax(),
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
