import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import slugify from "../src/lib/slugify";
import { messageSchema } from "../src/lib/validations/message";

function source(file: string): string {
  return fs.readFileSync(path.join(process.cwd(), file), "utf8");
}

async function main(): Promise<void> {
  // Slugs must satisfy the [a-z0-9-] validation regex.
  assert.equal(slugify("Hello_World"), "hello-world");
  assert.equal(slugify("  A  B__C  "), "a-b-c");

  // Consent and subject must be validated on the server, not just in HTML.
  const valid = {
    name: "Alex",
    email: "alex@example.com",
    message: "Hello",
    subject: "Architecture inquiry",
    consent: true,
  };
  assert.equal(messageSchema.safeParse(valid).success, true);
  assert.equal(messageSchema.safeParse({ ...valid, consent: false }).success, false);
  assert.equal(messageSchema.safeParse({ ...valid, consent: undefined }).success, false);
  assert.equal(messageSchema.safeParse({ ...valid, subject: undefined }).success, false);

  // A shared rate limiter must exist and be used by the contact service so
  // direct Server Action calls cannot bypass the API route's protection.
  const { checkRateLimit, RateLimitError } = await import("../src/lib/rate-limit");
  const key = "test-contact-" + Date.now();
  for (let i = 0; i < 5; i += 1) checkRateLimit(key);
  assert.throws(() => checkRateLimit(key), RateLimitError);
  assert.match(source("src/services/message.ts"), /checkRateLimit/);
  assert.doesNotMatch(source("app/api/contact/route.ts"), /new Map/);

  // Login attempts must be rate limited using the shared limiter.
  assert.match(source("src/lib/auth.ts"), /checkRateLimit/);

  // Admin dashboard counters must use visible-only service counts and must
  // not reach into Prisma directly from the page.
  const dashboard = source("app/admin/page.tsx");
  assert.match(dashboard, /countVisible\(\)/);
  assert.doesNotMatch(dashboard, /from "@\/lib\/prisma"/);

  console.log("batch 2 tests passed");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
