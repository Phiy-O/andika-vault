import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function source(file: string): string {
  return fs.readFileSync(path.join(process.cwd(), file), "utf8");
}

function main(): void {
  // One <main> landmark per public page: the shell must not add another.
  const shell = source("components/layout/PublicShell.tsx");
  assert.doesNotMatch(shell, /<main/);
  assert.match(shell, /id="top"/);

  // Shared dialog a11y behavior (focus trap, Escape, scroll lock).
  assert.ok(fs.existsSync(path.join(process.cwd(), "components/ui/useDialogA11y.ts")));
  const publicNav = source("components/layout/Navbar.tsx");
  assert.match(publicNav, /useDialogA11y/);
  assert.match(publicNav, /role="dialog"/);
  assert.match(publicNav, /aria-modal="true"/);
  assert.match(publicNav, /aria-label="Mobile navigation"/);
  assert.match(source("components/admin/AdminNavbar.tsx"), /useDialogA11y/);

  // Global reduced-motion coverage, not just loading animations.
  const css = source("app/globals.css");
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  const reducedBlock = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
  assert.match(reducedBlock, /animation-duration/);
  assert.match(reducedBlock, /transition-duration/);
  assert.match(reducedBlock, /scroll-behavior/);

  console.log("batch 3 tests passed");
}

main();
