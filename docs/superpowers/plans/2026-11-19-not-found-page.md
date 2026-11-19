# 404 Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `app/not-found.tsx` into a standalone, theme-consistent neobrutalist 404 page.

**Architecture:** A single-file Next.js App Router server component. Purely presentational — no new shared components, no client JS, no data access. Styling uses existing Tailwind v4 utilities and CSS variables from `app/globals.css`, mirroring the patterns in `HomeHero` and `CTAButton`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, pnpm.

**Spec:** `docs/superpowers/specs/2026-11-19-not-found-page-design.md`

## Global Constraints
- Use pnpm only; no new dependencies.
- Standalone page: no `Navbar`, no `Footer`, no DB access.
- Reuse existing tokens (`--background`, `--foreground`, `--muted`, `--line`, `--purple`, `--amber`) and font utilities from `app/globals.css`.
- Neobrutalist language: near-black 2px borders, restrained offset shadows, coral accent, square corners, mono uppercase micro-labels with wide tracking, heavy uppercase serif headings. No gradients, glassmorphism, or pills.
- Server component only; no `"use client"`.
- Keep the file path/export (`app/not-found.tsx`, default `NotFound`).

## Review Focus
- **Mobile overflow:** the oversized "404" must scale/clamp so it never causes horizontal scroll on narrow viewports.
- **Contrast/readability:** muted body text on cream background must remain legible; coral accent used sparingly.
- **Focus states:** both links must show the global visible focus outline.
- **Link correctness:** both links must point to real routes (`/` and `/projects`).
- **Reduced motion:** hover transforms are subtle and CSS-only; no animations introduced.

---

### Task 1: Restyle the 404 page

**Files:**
- Modify: `app/not-found.tsx`

**Interfaces:**
- Consumes: `next/link` `Link`; Tailwind utilities and CSS variables from `app/globals.css`.
- Produces: default-exported `NotFound()` server component at `app/not-found.tsx`.

- [ ] **Step 1: Replace the current component with the standalone editorial composition**

  Rewrite `app/not-found.tsx` to contain, in order: a mono eyebrow (`ERROR // 404 — ROUTE NOT FOUND`), an oversized uppercase serif `404` with a coral highlight chip (border + offset shadow), an uppercase editorial headline, one short muted paragraph, a primary "Back to home" link styled like `CTAButton` (coral, `border-2`, `shadow-[4px_4px_0_...]`, hover lift) and a secondary "Browse projects" link, plus a subtle mono status line. Use responsive clamps and `px-[5.5vw]` to match other public sections. Keep all text meaningful and links real.

- [ ] **Step 2: Verify TypeScript**

  Run: `pnpm exec tsc --noEmit`
  Expected: PASS with no errors.

- [ ] **Step 3: Verify lint**

  Run: `pnpm run lint`
  Expected: PASS, with no new `@typescript-eslint/no-explicit-any` or other warnings introduced.
