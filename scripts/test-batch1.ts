import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function source(file: string): string {
  return fs.readFileSync(path.join(process.cwd(), file), "utf8");
}

function main(): void {
  // 1. Footer's #top link must resolve on every public page.
  assert.match(source("components/layout/PublicShell.tsx"), /id="top"/);

  // 2. Achievements: remove the no-op category tabs; search must filter and
  //    the featured item must come from the filtered set.
  const achievements = source("components/achievements/AchievementsContent.tsx");
  assert.doesNotMatch(achievements, /activeCategory === "certificate"/);
  assert.doesNotMatch(achievements, /items\.length : items\.length/);
  assert.match(achievements, /const featured = filtered\[0\]/);

  // 3. Blog featured article must respect active filters.
  assert.match(source("components/blog/BlogContent.tsx"), /const latestPost = filteredPosts\[0\];/);

  // 4. Public filter/tab buttons must expose their active state.
  for (const file of [
    "components/blog/BlogContent.tsx",
    "components/projects/ProjectsContent.tsx",
    "components/about/AboutSkills.tsx",
  ]) {
    assert.match(source(file), /aria-pressed=/, `${file} must expose filter state`);
  }

  // 5. Messages: PATCH must support marking as unread and bulk delete must work.
  assert.match(source("app/api/admin/messages/[id]/route.ts"), /isRead/);
  assert.match(source("src/repositories/message.ts"), /markUnread|isRead/);
  const workspace = source("app/admin/messages/_components/MessageWorkspace.tsx");
  assert.doesNotMatch(workspace, /disabled=\{true\}/);
  assert.match(workspace, /onClick=\{requestBulkDelete\}/);
  assert.match(workspace, /requestBulkDelete=\{requestBulkDelete\}/);

  console.log("batch 1 tests passed");
}

main();
