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

  console.log("db pool config tests passed");
}

void main();
