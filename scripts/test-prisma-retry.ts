import assert from "node:assert/strict";
import {
  isTransientConnectionError,
  withTransientRetry,
} from "../src/lib/prisma-retry";

async function countAttempts(
  error: unknown,
  maxAttempts: number
): Promise<number> {
  let attempts = 0;
  await assert.rejects(
    withTransientRetry(async () => {
      attempts += 1;
      throw error;
    }, maxAttempts)
  );
  return attempts;
}

async function main(): Promise<void> {
  // Prisma codes surfaced by model queries with @prisma/adapter-pg.
  assert.equal(isTransientConnectionError({ code: "P1001" }), true);
  assert.equal(isTransientConnectionError({ code: "P2039" }), true);

  // Pool exhaustion arrives as P2039 with the real code inside meta.
  assert.equal(
    isTransientConnectionError({
      code: "P2039",
      meta: {
        driverAdapterError: Object.assign(
          new Error("(EMAXCONNSESSION) max clients reached in session mode"),
          { code: "EMAXCONNSESSION" }
        ),
      },
    }),
    true
  );
  assert.equal(isTransientConnectionError({ code: "P1002" }), true);
  assert.equal(isTransientConnectionError({ code: "P1008" }), true);
  assert.equal(isTransientConnectionError({ code: "P1017" }), true);

  // Connection failure surfaced by $queryRaw through the driver adapter.
  assert.equal(
    isTransientConnectionError({
      code: "P2010",
      message: "Raw query failed. Message: `Can't reach database server`",
    }),
    true
  );

  // Pool exhaustion / driver-level connection failures.
  assert.equal(isTransientConnectionError({ code: "53300" }), true); // too_many_connections
  assert.equal(isTransientConnectionError({ code: "57P03" }), true); // cannot_connect_now
  assert.equal(isTransientConnectionError({ code: "EMAXCONNSESSION" }), true);
  assert.equal(isTransientConnectionError({ code: "ECONNREFUSED" }), true);
  assert.equal(isTransientConnectionError({ code: "ENOTFOUND" }), true);

  // Wrapped errors must be inspected through the cause chain.
  assert.equal(
    isTransientConnectionError({
      code: "P2010",
      message: "Raw query failed",
      cause: { code: "ECONNRESET" },
    }),
    true
  );

  // pg pool timeouts observed during Vercel builds have no `code` at all.
  const timeoutError = Object.assign(
    new Error("Connection terminated due to connection timeout"),
    {
      clientVersion: "7.9.0",
      cause: new Error("Connection terminated unexpectedly"),
    }
  );
  assert.equal(isTransientConnectionError(timeoutError), true);

  // pg pool-queue timeout: no code, plain Error.
  const poolTimeout = new Error("timeout exceeded when trying to connect");
  assert.equal(isTransientConnectionError(poolTimeout), true);

  // Dual-stack DNS failures can surface as AggregateError with children.
  const aggregate = new AggregateError(
    [Object.assign(new Error("connect failed"), { code: "ECONNREFUSED" })],
    "connect failed"
  );
  assert.equal(isTransientConnectionError(aggregate), true);

  // Non-connection errors must never be retried.
  assert.equal(isTransientConnectionError({ code: "P2002" }), false);
  assert.equal(isTransientConnectionError({ code: "P2025" }), false);
  assert.equal(isTransientConnectionError(new Error("boom")), false);
  assert.equal(isTransientConnectionError(null), false);

  assert.equal(await countAttempts({ code: "P1001" }, 4), 4);
  assert.equal(await countAttempts({ code: "53300" }, 4), 4);
  assert.equal(await countAttempts(timeoutError, 4), 4);
  assert.equal(await countAttempts(poolTimeout, 4), 4);
  assert.equal(await countAttempts(aggregate, 4), 4);
  assert.equal(await countAttempts({ code: "P2002" }, 4), 1);

  let succeededAfter = 0;
  const value = await withTransientRetry(async () => {
    succeededAfter += 1;
    if (succeededAfter < 3) throw { code: "ECONNREFUSED" };
    return "ok";
  }, 4);
  assert.equal(value, "ok");
  assert.equal(succeededAfter, 3);

  console.log("prisma retry tests passed");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
