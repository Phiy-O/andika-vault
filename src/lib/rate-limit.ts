export class RateLimitError extends Error {
  constructor(public readonly retryAfter: number) {
    super("Too many messages. Please try again later.");
    this.name = "RateLimitError";
  }
}

const buckets = new Map<string, { count: number; resetAt: number }>();

/**
 * Simple fixed-window limiter shared by the contact API route and the
 * createMessage server action, so neither entry point can bypass it.
 * On serverless this is per-instance; it is intentionally dependency-free.
 */
export function checkRateLimit(
  key: string,
  max = 5,
  windowMs = 10 * 60 * 1000
): void {
  const now = Date.now();

  if (buckets.size > 1000) {
    for (const [bucketKey, value] of buckets) {
      if (value.resetAt <= now) buckets.delete(bucketKey);
    }
  }

  const current = buckets.get(key);
  if (current && current.resetAt > now) {
    if (current.count >= max) {
      throw new RateLimitError(Math.ceil((current.resetAt - now) / 1000));
    }
    current.count += 1;
    return;
  }

  buckets.set(key, { count: 1, resetAt: now + windowMs });
}
