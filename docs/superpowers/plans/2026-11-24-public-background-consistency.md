# Public Background Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every public page render on the same `#f4efe6` canvas by using the existing `bg-background` token for page-level backgrounds and the shared navbar.

**Architecture:** The palette lives in `app/globals.css` as CSS-first Tailwind v4 tokens. Several public pages bypassed the token with hardcoded cream hex values on their `<main>` elements and on the shared navbar. The change is a source-level class swap: replace only the canvas declarations with `bg-background`, leaving intentional surface colors and the admin `.admin-shell` override untouched. A source-assertion script pins the exact strings so the change is testable without a browser.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, TypeScript, pnpm.

**Spec:** `docs/superpowers/specs/2026-11-24-public-background-consistency-design.md`

## Global Constraints

- Use pnpm exclusively (`pnpm exec`, `pnpm run`); never npm/yarn/bun.
- Tailwind CSS v4 tokens are defined in `app/globals.css`; do not create `tailwind.config.js` or introduce new tokens.
- Prefer the existing `bg-background` utility over arbitrary hex values when the token already represents the color.
- Do not modify `.admin-shell` in `app/globals.css`; it overrides `--background` to `#faf6ee` and must stay public-only.
- Do not change card, panel, badge, figure-frame, terminal, or code-block colors — only page-canvas declarations.
- Do not change text colors, fonts, spacing, borders, shadows, or layout.
- Existing lint output contains pre-existing warnings; do not introduce new errors or `any`.

## Review Focus

- **Navbar seam** — if the navbar keeps `#f4ebdc`, pages still show a band under it; Task 2 asserts the navbar no longer carries that hex.
- **Blog article bands** — if only `<main>` changes, the full-width header/figure/body bands remain a different cream; Task 2 asserts all three band declarations change.
- **Over-broad replacement** — replacing every `#faf6ee`/`#fcf9f8` would flatten intentional cards and badges; Task 1's assertions target exact canvas strings only, and Task 2 touches only those strings.
- **Admin palette isolation** — changing the root token or `.admin-shell` would alter the workspace colors; Task 1 asserts `.admin-shell` still declares `background: var(--background)` with its original hex tokens.
- **Token availability at build** — `bg-background` must resolve under Tailwind v4; Task 2 runs `pnpm run build` after the swap.

---

### Task 1: Add a source-level regression test

**Files:**
- Create: `scripts/test-public-background.ts`
- Modify: `package.json` (add `test:background` script and include it in `test`)

**Interfaces:**
- Consumes: nothing.
- Produces: `pnpm run test:background` — exits 0 only when every scoped canvas declaration uses `bg-background` and the admin override is intact.

- [ ] **Step 1: Create `scripts/test-public-background.ts`**

Write a script using `node:assert/strict` and `node:fs` `readFileSync` that:

- Defines `canvasFiles` with these exact paths and forbidden canvas strings:
  - `app/page.tsx` → `min-h-screen bg-[#f4ebdc]`
  - `components/achievements/AchievementsContent.tsx` → `min-h-screen bg-[#faf6ee]`
  - `components/blog/BlogContent.tsx` → `min-h-screen bg-[#fcf9f8]`
  - `app/contact/page.tsx` → `min-h-screen bg-[#fcf9f8]`
  - `components/projects/ProjectsContent.tsx` → `min-h-screen bg-[#faf6ee]`
  - `app/blog/[slug]/page.tsx` → `bg-[#faf6ee] text-[#1b1b1b]` (appears twice: `<main>` and body `<section>`)
  - `components/blog/detail/ArticleHeader.tsx` → `bg-[#faf6ee] px-[5.5vw]`
  - `components/blog/detail/ArticleFigure.tsx` → `bg-[#fcf9f8] px-[5.5vw]`
  - `components/layout/Navbar.tsx` → `bg-[#f4ebdc] sticky`
- For each pair, assert `!source.includes(forbidden)` with a message naming the file.
- Assert each of those files contains `bg-background`.
- Assert `app/globals.css` contains `.admin-shell` and `background: var(--background)` and `--background: #faf6ee`.
- End with `console.log("public background tests passed")` and invoke via `void main()`.

- [ ] **Step 2: Wire the test into `package.json`**

Add `"test:background": "tsx scripts/test-public-background.ts"` after `"test:singleton"`, and insert `&& pnpm run test:background` into the `test` script between `test:singleton` and `test:batch1`.

- [ ] **Step 3: Run the test to verify it fails**

Run: `pnpm run test:background`
Expected: FAIL with an assertion naming `app/page.tsx` (first forbidden string still present).

- [ ] **Step 4: Commit**

```bash
git add scripts/test-public-background.ts package.json
git commit -m "test: pin public page canvas backgrounds to bg-background"
```

### Task 2: Apply the canvas background changes

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/achievements/AchievementsContent.tsx`
- Modify: `components/blog/BlogContent.tsx`
- Modify: `app/contact/page.tsx`
- Modify: `components/projects/ProjectsContent.tsx`
- Modify: `app/blog/[slug]/page.tsx`
- Modify: `components/blog/detail/ArticleHeader.tsx`
- Modify: `components/blog/detail/ArticleFigure.tsx`
- Modify: `components/layout/Navbar.tsx`

**Interfaces:**
- Consumes: the forbidden-string list asserted by `pnpm run test:background`.
- Produces: all public page canvases and the navbar use `bg-background`; no other declarations change.

- [ ] **Step 1: Replace the canvas declarations**

For each file in Task 1's list, replace only the exact forbidden string with the same text using `bg-background`:

- Home: `min-h-screen bg-[#f4ebdc]` → `min-h-screen bg-background`
- Achievements, projects list: `min-h-screen bg-[#faf6ee]` → `min-h-screen bg-background`
- Blog list, contact: `min-h-screen bg-[#fcf9f8]` → `min-h-screen bg-background`
- Blog detail: both `bg-[#faf6ee] text-[#1b1b1b]` → `bg-background text-[#1b1b1b]`
- Article header: `bg-[#faf6ee] px-[5.5vw]` → `bg-background px-[5.5vw]`
- Article figure: `bg-[#fcf9f8] px-[5.5vw]` → `bg-background px-[5.5vw]`
- Navbar: `bg-[#f4ebdc] sticky` → `bg-background sticky`

Do not touch any other hex value in these files (cards, badges, figure frames, terminal blocks, status strips).

- [ ] **Step 2: Run the regression test**

Run: `pnpm run test:background`
Expected: PASS with `public background tests passed`.

- [ ] **Step 3: Run the project checks**

Run: `pnpm exec tsc --noEmit`, `pnpm run lint`, `pnpm run build`
Expected: tsc clean; lint has 0 errors (pre-existing warnings only); build succeeds with all static pages generated.

- [ ] **Step 4: Commit**

```bash
git add app components
git commit -m "fix: equate public page backgrounds on the bg-background token"
```
