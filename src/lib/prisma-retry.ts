const TRANSIENT_PRISMA_CODES = new Set([
  "P1001", // Can't reach database server
  "P1002", // Database server timed out
  "P1008", // Operations timed out
  "P1017", // Server closed the connection
  "P2039", // Driver adapter error (e.g. pooler connection limit)
]);

const TRANSIENT_DRIVER_CODES = new Set([
  // PostgreSQL connection / shutdown states (including pool exhaustion).
  "08000", // connection_exception
  "08001", // sqlclient_unable_to_establish_sqlconnection
  "08004", // sqlserver_rejected_establishment_of_sqlconnection
  "08006", // connection_failure
  "08007", // transaction_resolution_unknown
  "53300", // too_many_connections
  "57P01", // admin_shutdown
  "57P02", // crash_shutdown
  "57P03", // cannot_connect_now
  // Supabase pooler.
  "EMAXCONNSESSION",
  // Node.js / pg socket failures.
  "ECONNREFUSED",
  "ECONNRESET",
  "ENOTFOUND",
  "EAI_AGAIN",
  "ETIMEDOUT",
  "ECONNABORTED",
  "EPIPE",
]);

// pg pool/adapter failures can arrive as plain Errors with no `code` at all,
// so the message must be checked as well.
const TRANSIENT_CONNECTION_MESSAGE =
  /can'?t reach database|connection (terminated|timeout|timed out|reset|refused|lost|closed|unavailable)|timeout exceeded|could not connect|unable to connect|too many (clients|connections)|remaining connection slots|socket hang up|network error/i;

/**
 * Detects connection-level failures that are safe to retry. With the pg driver
 * adapter the same failure can surface as a Prisma code (P1001), as a raw
 * Postgres/pg code (53300, ECONNREFUSED, ...), or one level down in `cause`.
 */
export function isTransientConnectionError(error: unknown): boolean {
  const seen = new Set<object>();
  const queue: unknown[] = [error];

  while (queue.length > 0) {
    const current = queue.shift();
    if (current === null || typeof current !== "object" || seen.has(current)) {
      continue;
    }
    seen.add(current);
    const candidate = current as {
      code?: unknown;
      message?: unknown;
      cause?: unknown;
      errors?: unknown;
      meta?: unknown;
    };

    if (typeof candidate.code === "string") {
      if (
        TRANSIENT_PRISMA_CODES.has(candidate.code) ||
        TRANSIENT_DRIVER_CODES.has(candidate.code)
      ) {
        return true;
      }
    }

    // P2010, raw pg errors and pool timeouts have no reliable code, so inspect
    // the message of every error in the chain.
    if (
      typeof candidate.message === "string" &&
      TRANSIENT_CONNECTION_MESSAGE.test(candidate.message)
    ) {
      return true;
    }

    if (candidate.cause) queue.push(candidate.cause);
    // Prisma stores driver-adapter failures (EMAXCONNSESSION, etc.) in meta.
    if (candidate.meta) queue.push(candidate.meta);
    // Dual-stack DNS / autoSelectFamily failures are wrapped in AggregateError.
    if (Array.isArray(candidate.errors)) queue.push(...candidate.errors);
  }

  return false;
}

/**
 * Retries read-only queries that fail because the database connection is
 * temporarily unavailable (for example a flaky DNS lookup, a pooler reset,
 * or exhausted connection slots during a parallel build).
 * Non-connection errors are rethrown immediately.
 */
export async function withTransientRetry<T>(
  operation: () => Promise<T>,
  maxAttempts = 4
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (!isTransientConnectionError(error) || attempt === maxAttempts) {
        throw error;
      }
      // Jittered exponential backoff so parallel build workers do not retry
      // in lockstep against an already saturated pooler.
      const baseDelay = Math.min(200 * 2 ** (attempt - 1), 2000);
      const jitter = Math.floor(Math.random() * baseDelay * 0.25);
      await new Promise((resolve) => setTimeout(resolve, baseDelay + jitter));
    }
  }

  throw lastError;
}
