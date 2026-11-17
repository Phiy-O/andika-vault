# Blog Figma Design Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild `/blog` to match Figma node `313:3945` while preserving dynamic blog behavior.

**Architecture:** Keep existing server data loading and article links. Replace listing presentation with blog-local responsive sections: masthead, featured article, toolbar, archive grid, and CTA. Keep styles local to blog scope.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Prisma-backed repository.

**Spec:** `docs/superpowers/specs/2026-11-17-blog-figma-design.md`

## Global Constraints

- Modify blog scope only.
- Preserve existing repository, visibility filtering, and article URLs.
- No new dependency.
- No temporary Figma asset URL in source.
- Keep semantic HTML, keyboard access, focus states, and responsive behavior.

## Review Focus

- Empty article result renders readable empty state instead of broken grid.
- Long titles and excerpts wrap without horizontal overflow.
- Search and category filters preserve current article behavior.
- Missing article media uses existing fallback behavior.
- Mobile layout remains usable at 320px.

---

### Task 1: Inspect and preserve blog data contract

**Files:**
- Modify: `app/blog/page.tsx`
- Inspect: existing blog repository/types/components used by page

**Interfaces:**
- Preserve current page data shape, article slug links, visibility filtering, search, and category behavior.

- [ ] **Step 1:** Read current `app/blog/page.tsx` and all direct imports; record props and data fields used by cards.
- [ ] **Step 2:** Add or retain a small self-check for any extracted pure article filtering/formatting function if non-trivial logic moves out of page.
- [ ] **Step 3:** Keep server-side data loading unchanged unless required for reference layout.
- [ ] **Step 4:** Run `pnpm exec tsc --noEmit`.

### Task 2: Implement Figma-matched blog listing layout

**Files:**
- Modify: `app/blog/page.tsx`
- Create only if needed: blog-local component under existing project component convention

**Interfaces:**
- Consume existing article data.
- Produce accessible `/blog` page with links to `/blog/[slug]`.

- [ ] **Step 1:** Build cream canvas and 1200px max content container.
- [ ] **Step 2:** Add technical masthead: archive badge, published status, “NOTES FROM THE BUILD.” heading, description, RSS action, and apparatus panel.
- [ ] **Step 3:** Add featured article split card with dynamic lead article, category, metadata, read action, and media/fallback.
- [ ] **Step 4:** Add filter/search toolbar using real categories and current controls; use buttons and labeled search input.
- [ ] **Step 5:** Add archive heading and responsive three-column article card grid with dynamic content, metadata, media, and article links.
- [ ] **Step 6:** Add load-more/CTA and footer-like archive prompt only when supported by existing behavior; do not invent pagination backend.
- [ ] **Step 7:** Add empty and error-safe presentation without changing server response convention.
- [ ] **Step 8:** Verify no out-of-scope files changed.

### Task 3: Responsive and accessibility finish

**Files:**
- Modify: `app/blog/page.tsx`
- Modify only blog-scoped stylesheet if existing structure requires it

- [ ] **Step 1:** Verify layouts at 320px, 768px, 1024px, and 1440px.
- [ ] **Step 2:** Ensure buttons, links, input, and filters have visible focus styles and keyboard access.
- [ ] **Step 3:** Ensure heading hierarchy, image alt text, labels, and status text are semantic.
- [ ] **Step 4:** Add restrained hover/focus transitions respecting reduced motion.
- [ ] **Step 5:** Run `pnpm exec tsc --noEmit`.
- [ ] **Step 6:** Run `pnpm run lint`.
- [ ] **Step 7:** Run `pnpm run build`.

### Task 4: Final scope review

- [ ] **Step 1:** Review git diff for blog-only changes.
- [ ] **Step 2:** Confirm no Figma temporary URLs remain.
- [ ] **Step 3:** Confirm existing article links and data behavior remain intact.
- [ ] **Step 4:** Report checks and any known limitation.
