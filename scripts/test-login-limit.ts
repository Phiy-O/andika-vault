import assert from "node:assert/strict";

delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.UPSTASH_REDIS_REST_TOKEN;

async function main(): Promise<void> {
  const { isLoginAllowed } = await import("../src/lib/login-rate-limit");

  // Fallback path when Upstash is not configured.
  const ip = "fallback-" + Date.now();
  for (let i = 0; i < 5; i += 1) {
    assert.equal(await isLoginAllowed(ip), true, `attempt ${i + 1} allowed`);
  }
  assert.equal(await isLoginAllowed(ip), false, "6th attempt blocked");

  // Distributed path using the Upstash REST API.
  process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io/";
  process.env.UPSTASH_REDIS_REST_TOKEN = "test-token";
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    assert.equal(url, "https://example.upstash.io/pipeline");
    assert.equal(
      (init?.headers as Record<string, string>).Authorization,
      "Bearer test-token"
    );
    const commands = JSON.parse(String(init?.body)) as string[][];
    assert.equal(commands[0][0], "INCR");
    assert.equal(commands[1][0], "EXPIRE");
    calls += 1;
    return new Response(JSON.stringify([{ result: calls }, { result: 1 }]), {
      status: 200,
    });
  }) as typeof fetch;

  try {
    for (let i = 0; i < 5; i += 1) {
      assert.equal(await isLoginAllowed("upstash-ip"), true);
    }
    assert.equal(await isLoginAllowed("upstash-ip"), false);
    assert.equal(calls, 6);
  } finally {
    globalThis.fetch = originalFetch;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  }

  console.log("login rate limit tests passed");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
