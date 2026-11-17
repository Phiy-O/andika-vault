# Projects Figma Design Implementation Plan

**Goal:** Rebuild `/projects` to match Figma node `313:558` while preserving live project behavior.

**Files:** `app/projects/page.tsx`, `components/projects/ProjectsContent.tsx`.

## Tasks

1. Replace full Prisma cast with `ProjectListItem` contract.
2. Rebuild editorial masthead, blueprint panel, featured project, terminal diagnostics, toolbar, catalog cards, empty state, load-more, and archive CTA.
3. Preserve filters (`all`, `featured`, `product`, `tool`), search, project URLs, detail links, and dynamic thumbnails.
4. Ensure keyboard focus, semantic labels, responsive stacking, and long-content wrapping.
5. Run `pnpm exec tsc --noEmit`, focused ESLint, `pnpm run build`, and `git diff --check`.
6. Review diff for Projects-only source changes and absence of Figma temporary URLs.
