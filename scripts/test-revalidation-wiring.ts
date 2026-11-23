import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const deleteRoutes = [
  "app/api/admin/blog/[id]/route.ts",
  "app/api/admin/projects/[id]/route.ts",
  "app/api/admin/certificates/[id]/route.ts",
  "app/api/admin/skills/[id]/route.ts",
];

function main(): void {
  for (const file of deleteRoutes) {
    const source = fs.readFileSync(path.join(process.cwd(), file), "utf8");
    const deleteStart = source.indexOf("export async function DELETE(");
    assert.notEqual(deleteStart, -1, `${file} must have a DELETE handler`);
    const handler = source.slice(deleteStart);
    assert.match(
      handler,
      /revalidatePublicContent\(/,
      `${file}: DELETE must invalidate cached public content`
    );
  }

  console.log("revalidation wiring tests passed");
}

main();
