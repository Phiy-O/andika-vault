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

  console.log("security hardening tests (part 1) passed");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
