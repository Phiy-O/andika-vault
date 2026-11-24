import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Page-level canvas declarations that must all resolve to the shared token.
const canvasStrings: Array<[string, string]> = [
  ["app/page.tsx", "min-h-screen bg-[#f4ebdc]"],
  ["components/achievements/AchievementsContent.tsx", "min-h-screen bg-[#faf6ee]"],
  ["components/blog/BlogContent.tsx", "min-h-screen bg-[#fcf9f8]"],
  ["app/contact/page.tsx", "min-h-screen bg-[#fcf9f8]"],
  ["components/projects/ProjectsContent.tsx", "min-h-screen bg-[#faf6ee]"],
  ["app/blog/[slug]/page.tsx", "bg-[#faf6ee] text-[#1b1b1b]"],
  ["components/blog/detail/ArticleHeader.tsx", "bg-[#faf6ee] px-[5.5vw]"],
  ["components/blog/detail/ArticleFigure.tsx", "bg-[#fcf9f8] px-[5.5vw]"],
  ["components/blog/detail/RelatedDispatches.tsx", "bg-[#fcf9f8] px-[5.5vw]"],
  ["components/layout/Navbar.tsx", "bg-[#f4ebdc] sticky"],
];

async function main(): Promise<void> {
  for (const [file, forbidden] of canvasStrings) {
    const source = readFileSync(file, "utf8");
    assert.ok(
      !source.includes(forbidden),
      `${file} must not use canvas declaration "${forbidden}"`
    );
    assert.ok(source.includes("bg-background"), `${file} must use bg-background`);
  }

  // The article detail page has two full-width canvas bands; neither may
  // keep the old cream, including the body section that has no text token.
  const article = readFileSync("app/blog/[slug]/page.tsx", "utf8");
  assert.ok(
    !article.includes("bg-[#faf6ee]"),
    "app/blog/[slug]/page.tsx must not keep any bg-[#faf6ee] canvas band"
  );

  const globals = readFileSync("app/globals.css", "utf8");
  assert.ok(globals.includes(".admin-shell"), "admin shell must remain");
  assert.ok(
    globals.includes("background: var(--background)"),
    "admin shell must keep its token override"
  );
  assert.ok(
    globals.includes("--background: #faf6ee"),
    "admin palette must remain unchanged"
  );

  console.log("public background tests passed");
}

void main();
