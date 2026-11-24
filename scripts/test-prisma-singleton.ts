import assert from "node:assert/strict";

process.env.DATABASE_URL = "postgresql://u:p@127.0.0.1:1/db";
(process.env as Record<string, string | undefined>).NODE_ENV = "production";

interface PrismaGlobal {
  prisma?: unknown;
  basePrisma?: unknown;
}

async function main(): Promise<void> {
  const globalForPrisma = globalThis as unknown as PrismaGlobal;
  delete globalForPrisma.prisma;
  delete globalForPrisma.basePrisma;

  // A production build bundles the Prisma module into several chunks. Without
  // unconditional global caching each chunk creates its own pg pool, which
  // exhausts Supabase's 15-client limit during prerendering.
  const { prisma, basePrisma } = await import("../lib/prisma");

  assert.ok(
    globalForPrisma.prisma,
    "prisma must be cached on globalThis during production builds"
  );
  assert.ok(
    globalForPrisma.basePrisma,
    "basePrisma must be cached on globalThis during production builds"
  );
  assert.strictEqual(globalForPrisma.prisma, prisma);
  assert.strictEqual(globalForPrisma.basePrisma, basePrisma);

  console.log("prisma singleton tests passed");
}

void main();
