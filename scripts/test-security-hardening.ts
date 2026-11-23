import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { actionError } from "../src/actions/action-error";

function source(file: string): string {
  return fs.readFileSync(path.join(process.cwd(), file), "utf8");
}

async function main(): Promise<void> {
  // #2 — internal error messages must never reach the client.
  assert.equal(actionError(new Error("P2002 Unique constraint failed on users_email_key"), "Safe message"), "Safe message");
  assert.equal(actionError("raw driver detail", "Safe message"), "Safe message");
  assert.equal(
    actionError({ issues: [{ message: "Title is required" }] }, "Safe message"),
    "Title is required"
  );
  for (const file of [
    "src/actions/message.ts",
    "src/actions/project.ts",
    "src/actions/skill.ts",
    "src/actions/site-setting.ts",
    "src/actions/certificate.ts",
    "src/actions/blog-post.ts",
  ]) {
    assert.doesNotMatch(
      source(file),
      /(?:e|error)\.message\s*\?\?/,
      `${file} must not echo raw error messages`
    );
  }

  // #3 — Cloudinary URL parsing, paginated cleanup, and reference checks.
  process.env.CLOUDINARY_CLOUD_NAME = "testcloud";
  const { publicIdFromUrl } = await import("../src/lib/cloudinary");
  const base = "https://res.cloudinary.com/testcloud/image/upload";
  assert.equal(publicIdFromUrl(`${base}/v123/andika-vault/abc.png`), "andika-vault/abc");
  assert.equal(
    publicIdFromUrl(`${base}/f_auto,q_auto/v123/andika-vault/abc.png`),
    "andika-vault/abc"
  );
  assert.equal(
    publicIdFromUrl(`${base}/c_fill,w_300/andika-vault/abc.png`),
    "andika-vault/abc"
  );
  assert.equal(publicIdFromUrl("https://evil.example/andika-vault/abc.png"), null);

  assert.match(source("src/lib/cloudinary-cleanup.ts"), /next_cursor/);
  assert.match(source("app/api/cron/cloudinary-cleanup/route.ts"), /timingSafeEqual/);
  assert.doesNotMatch(source("app/api/cron/cloudinary-cleanup/route.ts"), /Bearer \$\{undefined\}/);
  assert.match(source("app/api/cloudinary/delete/route.ts"), /cleanupCloudinaryImages/);

  // #4 — inline style must be narrowed and raw HTML embeds disabled.
  const { sanitizeContent } = await import("../src/lib/sanitize");
  const styled = sanitizeContent(
    '<p style="position:fixed;background-image:url(https://evil.example/x.png)">hi</p>'
  );
  assert.doesNotMatch(styled, /position|background-image/i);
  assert.doesNotMatch(
    sanitizeContent('<a href="//evil.example">link</a>'),
    /href="\/\//
  );
  assert.doesNotMatch(
    source("components/admin/LexKitEditor.tsx"),
    /htmlEmbedExtension/
  );

  // #5 — draft previews must require admin role, not just any session.
  for (const file of [
    "app/blog/[slug]/page.tsx",
    "app/projects/[slug]/page.tsx",
  ]) {
    assert.match(
      source(file),
      /requireAdmin\(\)|ADMIN_ROLE/,
      `${file} must gate unfiltered previews on admin role`
    );
  }

  // #6 — protocol-relative URLs must not pass URL validation.
  const { safeUrlString } = await import("../src/lib/validations/url");
  assert.equal(safeUrlString.safeParse("//evil.example/path").success, false);
  assert.equal(safeUrlString.safeParse("/\\evil.example").success, false);
  assert.equal(safeUrlString.safeParse("/local/path").success, true);
  assert.equal(safeUrlString.safeParse("https://example.com").success, true);

  console.log("security hardening tests (part 1) passed");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
