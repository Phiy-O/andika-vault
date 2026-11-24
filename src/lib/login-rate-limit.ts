import { checkRateLimit } from "./rate-limit";

const MAX_ATTEMPTS = 5;
const WINDOW_SECONDS = 15 * 60;

/**
 * Distributed login throttle. Uses Upstash's Redis REST API directly (no new
 * dependency) when configured; otherwise falls back to the in-process limiter.
 * The fallback is best-effort on serverless but better than no protection.
 */
export async function isLoginAllowed(ip: string): Promise<boolean> {
  // Vercel KV is Upstash under the hood and exposes these alternative names.
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return allowLocally(`login:${ip}`);
  }

  try {
    const key = `login:${ip}`;
    const response = await fetch(`${url.replace(/\/+$/, "")}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, String(WINDOW_SECONDS), "NX"],
      ]),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Upstash request failed");
    const result = (await response.json()) as Array<{
      result?: number | string | null;
    }>;
    return Number(result[0]?.result ?? 0) <= MAX_ATTEMPTS;
  } catch {
    // Fail open to the local limiter rather than locking everyone out if
    // Upstash is temporarily unavailable.
    return allowLocally(`login-fallback:${ip}`);
  }
}

function allowLocally(key: string): boolean {
  try {
    checkRateLimit(key, MAX_ATTEMPTS, WINDOW_SECONDS * 1000);
    return true;
  } catch {
    return false;
  }
}
