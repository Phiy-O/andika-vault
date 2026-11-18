import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

// `next build` prerenders pages in parallel Node workers. Supabase's session
// pooler allows 15 clients, so each build worker is limited to a single
// connection. Runtime keeps a small, configurable pool per process.
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
const runtimePoolMax = Number(process.env.DATABASE_POOL_MAX ?? 5);
const poolMax = isBuildPhase
  ? 1
  : Number.isInteger(runtimePoolMax) && runtimePoolMax > 0
    ? runtimePoolMax
    : 5;

const adapter = new PrismaPg({
  connectionString,
  max: poolMax,
});

// Cache in every environment so route bundles and build workers share one
// client (and therefore one pool) per Node process instead of creating a new
// pool for each module copy.
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

globalForPrisma.prisma = prisma;
