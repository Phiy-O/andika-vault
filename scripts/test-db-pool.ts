import assert from "node:assert/strict";

process.env.DATABASE_URL = "postgresql://u:p@127.0.0.1:1/db";
delete process.env.PRISMA_POOL_MAX;

async function main(): Promise<void> {
  const { resolvePoolMax } = await import("../lib/prisma");

  assert.equal(resolvePoolMax(), 10, "default pool size must be safe at runtime");
  process.env.PRISMA_POOL_MAX = "3";
  assert.equal(resolvePoolMax(), 3, "explicit pool size must be honored");
  process.env.PRISMA_POOL_MAX = "0";
  assert.equal(resolvePoolMax(), 10, "invalid pool size must fall back to default");
  process.env.PRISMA_POOL_MAX = "abc";
  assert.equal(resolvePoolMax(), 10, "non-numeric pool size must fall back to default");

  delete process.env.PRISMA_POOL_MAX;
  process.env.NEXT_PHASE = "phase-production-build";
  assert.equal(resolvePoolMax(), 2, "build workers must use a small pool");
  process.env.PRISMA_POOL_MAX = "4";
  assert.equal(resolvePoolMax(), 4, "explicit override must win during build");
  delete process.env.NEXT_PHASE;

  console.log("db pool config tests passed");
}

void main();
