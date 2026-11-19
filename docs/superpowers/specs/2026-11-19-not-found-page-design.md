# 404 Page Redesign — Design (short)

Date: 2026-11-19

## Intent
Redesign the root `app/not-found.tsx` so it matches the site's **Structured Playful Neobrutalism** theme instead of the current generic centered layout. This is a minor-detail polish task, not a new feature.

## Decisions (approved)
- **Standalone** page: no `Navbar`, no `Footer` (preserves current behavior; avoids the Footer's DB call).
- **Approach A — standalone editorial 404**: one focused, full-viewport composition, no quick-link grid (Approach C declined as unnecessary for a minor detail).

## Goals
- Use the shared visual language: cream background token, near-black 2px borders, restrained offset shadows, coral accent, square corners.
- Editorial hierarchy: mono micro-label eyebrow, oversized uppercase serif headline, short readable body, clear primary action.
- Responsive down to mobile without horizontal overflow.
- Accessible semantics, visible focus, meaningful link labels, reduced-motion friendly.

## Non-goals / constraints
- No new dependencies, no route/layout changes, no new shared components (single-file change).
- No DB access, no server actions, no client JS.
- Keep the established `app/not-found.tsx` export and filename.
- Reuse existing tokens/fonts from `app/globals.css` and match `HomeHero`/`CTAButton` patterns.

## Implementation sketch
- Root `<main>` filling viewport, centered with `px-[5.5vw]`, cream `--background` inherited from body.
- Mono eyebrow: `ERROR // 404 — ROUTE NOT FOUND` with wide tracking.
- Giant `404`: uppercase `font-serif font-black`, coral highlight chip on one element with `border-2` + offset shadow.
- Headline: uppercase editorial statement (e.g. "LOST IN THE CURRENT.").
- Body: one short muted paragraph.
- Actions: primary "Back to home" (coral, `border-2`, `shadow-[4px_4px_0_...]`, hover lift) + secondary "Browse projects" link; both real, working links.
- Subtle mono status line at bottom for editorial flavor (e.g. `STATUS // PAGE NOT FOUND`).

## Verification
- `pnpm exec tsc --noEmit`
- `pnpm run lint`
