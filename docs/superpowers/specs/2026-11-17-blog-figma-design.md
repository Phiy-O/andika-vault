# Blog Figma Design

## Intent
Match blog listing page at Figma node `313:3945` while keeping existing blog data and behavior.

## Goals
- Rebuild `/blog` visual structure from reference.
- Keep articles dynamic from existing repository.
- Preserve article links and visibility rules.
- Add responsive layouts for desktop, tablet, and mobile.
- Keep accessibility and interaction states.

## Non-goals
- No admin dashboard changes.
- No blog detail redesign unless required by shared blog-only code.
- No database, auth, API, or global shell changes.
- No new dependency.

## Anti-goals
- No temporary Figma asset URLs in source.
- No global design-system rewrite.
- No static replacement of database content.

## Constraints
- Existing Next.js, React, TypeScript, Tailwind v4 stack.
- Existing repository and selectors remain data source.
- Blog scope means `app/blog` and narrowly scoped blog components/styles only.

## Approach
Use existing blog data flow and rebuild listing composition with blog-local presentation. Match reference hierarchy: technical masthead, featured article, filter/search toolbar, three-column archive cards, and footer CTA. Use CSS/Tailwind responsive layout rather than fixed canvas positioning. Use local assets only when exact reference assets are available and needed; otherwise preserve dynamic article media.

## Verification
Run TypeScript, lint, and build checks. Review `/blog` at 320px, 768px, 1024px, and 1440px. Confirm keyboard access, visible focus, article links, filters, search, empty state, and no out-of-scope file changes.

## Update — Blog detail redesign (2026-11-17)

A follow-up request superseded the detail-page non-goal. `/blog/[slug]` was rebuilt against Figma node `313:1126` while keeping the same dynamic data source and visibility rules.

- Rebuilt the breadcrumb masthead, cover figure, two-column reading area, sticky TOC sidebar, article footer/author card, and "Keep Reading" cards.
- Preserved `blogPostService.getVisibleBySlug` / `getBySlug` access rules and sanitized article HTML with `sanitizeContent()`.
- Generated `article-section-N` anchors from sanitized `<h2>` headings for the TOC and scrollspy; falls back to an "Article Overview" link when no headings exist.
- Reused the shared `px-[5.5vw]` width convention and the existing Inter/Geist Mono fonts instead of adding new typefaces.
- Added a public `/api/blog/rss` route so the existing RSS calls to action resolve to a real feed. The route exposes only `getVisible()` posts.
- Runtime checks covered 390, 768, 1024, 1280, and 1440 widths, TOC anchor/scrollspy behavior, copy-link success and failure states, and horizontal-overflow detection.
