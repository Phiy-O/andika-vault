# Elias Reid About Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move Elias Reid About content into validated backend-backed settings and render the Figma-matched About page from those values.

**Architecture:** Extend the existing key/value `SiteSetting` service with a typed `SiteSettings` object. Store repeated About content as JSON strings in existing settings, validate and parse at the action boundary, then pass normalized content into the About page. Extend existing admin settings form rather than create a new CMS.

**Tech Stack:** Next.js 16, React 19, TypeScript, Prisma PostgreSQL, Zod, Tailwind CSS.

**Spec:** `docs/superpowers/specs/2026-11-17-elias-reid-about-content-design.md`

## Global Constraints

- No new About CMS table system.
- No homepage identity change.
- No auth, contact API, DB workflow, or social-link behavior changes.
- No new dependencies.
- Existing skills remain dynamic through `skillService`.
- Malformed structured JSON must not overwrite stored valid values.

## Review Focus

- Existing records lacking new keys render exact Elias defaults.
- Malformed journey/pillar/timeline JSON returns validation error and preserves stored settings.
- Admin save preserves existing social, email, and resume fields.
- Long text and multiline content survive round trip.
- About page remains usable on mobile without horizontal overflow.

---

### Task 1: Extend typed settings and defaults

**Files:**
- Modify: `src/lib/validations/site-settings.ts`
- Modify: `src/services/site-setting.ts` (or exact existing site setting service path)
- Test: `src/lib/validations/site-settings.test.ts` if project test convention exists; otherwise use TypeScript check plus action-level self-check.

**Interfaces:**
- `SiteSettings` gains scalar About fields and JSON-string fields: `aboutName`, `aboutRole`, `aboutLocation`, `aboutFocus`, `aboutIntro`, `aboutDiscipline`, `aboutPhilosophy`, `aboutRuntime`, `aboutJourney`, `aboutPillars`, `aboutTimeline`, `aboutQuote`.
- Defaults contain exact Elias reference content and valid JSON arrays.

- [ ] Add Zod validation for scalar text and JSON fields with parsed array object validation.
- [ ] Add `SITE_SETTINGS_DEFAULTS` values from the Figma reference.
- [ ] Ensure service merge/get behavior returns defaults for absent keys.
- [ ] Run `pnpm exec tsc --noEmit`.

### Task 2: Add safe structured-content parser

**Files:**
- Create: `src/lib/about-content.ts`
- Test: `src/lib/about-content.test.ts` or project-equivalent.

**Interfaces:**
- `AboutJourneyItem`, `AboutPillar`, `AboutTimelineItem` types.
- `parseAboutContent(settings: SiteSettings): AboutContent` returns normalized arrays and scalar values.

- [ ] Write tests for valid JSON, empty arrays, and malformed JSON.
- [ ] Implement parser using Zod; malformed input throws a user-facing validation error before persistence and defaults are used for read-only fallback.
- [ ] Run focused test/check and TypeScript.

### Task 3: Update admin settings form

**Files:**
- Modify: `app/admin/settings/page.tsx` and its existing client form component if separated.

**Interfaces:**
- Existing `updateSiteSettings` input remains `SiteSettings`.
- Form exposes Elias About scalar fields and structured JSON textareas using exact setting keys.

- [ ] Add labeled fields for identity, intro, discipline, philosophy, runtime, quote.
- [ ] Add JSON editors for journey, pillars, timeline with helper examples.
- [ ] Preserve existing fields and submit behavior.
- [ ] Show validation errors without clearing prior values.
- [ ] Run `pnpm exec tsc --noEmit`.

### Task 4: Wire About page to backend content

**Files:**
- Modify: `app/about/page.tsx`
- Modify: `src/lib/about-content.ts` only if integration requires it.

**Interfaces:**
- About page reads `getSiteSettings()` and `skillService.getVisible()`.
- Page uses parsed `AboutContent` for all Elias identity, narrative, pillars, timeline, quote, and runtime copy.

- [ ] Replace hardcoded identity/content with parsed settings values.
- [ ] Keep Figma layout, local profile image, dynamic skills, and resume URL.
- [ ] Add safe rendering for missing optional content.
- [ ] Verify `http://localhost:3000/about` contains Elias content.

### Task 5: Verify persistence and runtime

**Files:**
- Modify only defects found.

- [ ] Run `pnpm exec tsc --noEmit`.
- [ ] Run project lint command and record baseline failures separately.
- [ ] Run Prisma validation/generate command used by repository.
- [ ] Verify admin settings save with valid About JSON and rejects malformed JSON.
- [ ] Verify About page at mobile and desktop widths.
- [ ] Confirm only port `3000` is used.
