# Homepage Figma Design Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild homepage presentation to match Figma node `313:139` while preserving live content and interactions.

**Architecture:** Keep `app/page.tsx` data loading. Rework homepage-local components and homepage project presentation with shared local tokens, editorial sections, and responsive Tailwind layouts. Avoid global style changes that affect completed public pages.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4.

**Spec:** `docs/superpowers/specs/2026-11-17-homepage-figma-design.md`

## Global Constraints

- Homepage scope only.
- Preserve dynamic data, links, resume, email, settings, and existing interactions.
- No new dependency.
- No temporary Figma asset URLs.
- Use cream, coral, blue, green, black tokens and editorial typography fallbacks.
- Keep semantic headings, keyboard focus, accessible labels, and responsive behavior.

## Review Focus

- Lean service return types must not require unsafe full Prisma casts.
- Missing thumbnails must retain stable visual layout.
- Long project, skill, post, and certificate text must wrap without overflow.
- Empty dynamic collections must show useful states.
- Mobile layout must avoid horizontal overflow and preserve CTA access.

---

### Task 1: Inspect and align homepage data contracts

**Files:**
- Modify: `app/page.tsx`
- Inspect/modify: `components/home/*`, `components/projects/HomeProjectsSection.tsx`

- [ ] Replace unnecessary full-model casts with existing lean list types where compatible.
- [ ] Preserve parallel service loading and settings behavior.
- [ ] Run `pnpm exec tsc --noEmit`.

### Task 2: Rebuild homepage hero and background statement

**Files:**
- Modify: `components/home/HomeHero.tsx`
- Modify: `components/home/HomeApproach.tsx`

- [ ] Match Figma masthead typography, cream canvas, coral highlighted phrase, technical sublabel, hard borders, and offset shadows.
- [ ] Preserve resume URL behavior and navigation CTAs.
- [ ] Add responsive stacking and focus states.
- [ ] Handle absent resume URL without broken link behavior.

### Task 3: Rebuild selected work and capability sections

**Files:**
- Modify: `components/projects/HomeProjectsSection.tsx`
- Modify: `components/home/HomeCapabilities.tsx`

- [ ] Match featured project flagship card, image frame, metadata labels, project links, and secondary two-column cards.
- [ ] Match three capability cards with domain labels, descriptions, and stack tags.
- [ ] Preserve dynamic project and skill content.
- [ ] Add missing-data and long-content-safe layouts.

### Task 4: Rebuild writing, milestones, contact, and local footer treatment

**Files:**
- Modify: `components/home/HomeWriting.tsx`
- Modify: `components/home/HomeMilestones.tsx`
- Modify: `components/home/HomeContactSection.tsx`
- Inspect/modify: `components/layout/Footer.tsx` only if homepage-specific variant is required.

- [ ] Match reference archive rows, milestone rows, coral contact panel, labels, borders, and CTA hierarchy.
- [ ] Preserve post links, certificate links, email, and dynamic counts.
- [ ] Add useful empty states.

### Task 5: Verify homepage

- [ ] Run `pnpm exec tsc --noEmit`.
- [ ] Run `pnpm exec eslint app/page.tsx components/home components/projects/HomeProjectsSection.tsx`.
- [ ] Run `pnpm run build`.
- [ ] Run `git diff --check`.
- [ ] Review 320px, 768px, 1024px, and 1440px layouts.
- [ ] Confirm changed source stays homepage scope and no temporary Figma URLs remain.
