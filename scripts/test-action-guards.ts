import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

type GuardExpectation = {
  file: string;
  functions: string[];
};

const expectations: GuardExpectation[] = [
  { file: "src/actions/message.ts", functions: ["getAllMessages"] },
  { file: "src/actions/skill.ts", functions: ["getAllSkills", "getSkill"] },
  { file: "src/actions/blog-post.ts", functions: ["getBlogPost"] },
  { file: "src/actions/project.ts", functions: ["getProject"] },
];

function functionBody(source: string, name: string): string {
  const start = source.indexOf(`export async function ${name}(`);
  assert.notEqual(start, -1, `${name} must exist in the action module`);
  const nextExport = source.indexOf("\nexport async function ", start + 1);
  return source.slice(start, nextExport === -1 ? source.length : nextExport);
}

function main(): void {
  for (const { file, functions } of expectations) {
    const source = fs.readFileSync(path.join(process.cwd(), file), "utf8");
    for (const name of functions) {
      const body = functionBody(source, name);
      assert.match(
        body,
        /requireAdmin\(\)/,
        `${file}: ${name} must verify admin authorization server-side`
      );
    }
  }

  console.log("action guard tests passed");
}

main();
