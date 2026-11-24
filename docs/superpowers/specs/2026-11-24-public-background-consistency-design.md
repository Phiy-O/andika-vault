# Public Background Consistency — Short Design

Date: 2026-11-24

## Intent

Public pages currently render four different cream canvases: `#f4ebdc` (home), `#f4efe6` (about, project detail), `#faf6ee` (achievements, blog detail, projects list), and `#fcf9f8` (blog list, contact). The shared Navbar is hardcoded to a fifth shade, `#f4ebdc`, while the Footer and body use `#f4efe6`, so most pages also show a seam under the navbar and above the footer. The user wants one consistent public background.

## Decision

Standardize the public page canvas on the existing global `bg-background` token (`--background: #f4efe6` in `app/globals.css`). Chosen by the human partner from three options.

## Goals

- Every public page `<main>` uses `bg-background`.
- The shared `Navbar` uses `bg-background` so nav → content → footer has no seam.
- The full-width canvas bands on blog article detail use `bg-background` so that page does not read as a different color.
- Admin is untouched: `.admin-shell` overrides `--background` to `#faf6ee`, so the token change is public-only.

## Non-goals / anti-goals

- Do not change card, panel, badge, figure-frame, terminal, or code-block colors (`bg-surface`, `bg-[#fffdf7]`, `bg-[#faf6ee]` on small elements, etc.) — these are intentional surfaces.
- Do not change accents, typography, spacing, borders, shadows, or layout.
- Do not change text colors (e.g. `text-[#1d1d1b]`, `text-[#1b1b1b]`) — the request is about background only.
- Do not introduce new tokens or a `tailwind.config.js`; Tailwind v4 reads tokens from `app/globals.css`.

## Constraints

- Tailwind CSS v4 with CSS-first tokens in `app/globals.css`; use `bg-background`, not arbitrary hex values, when the token already represents the color.
- No `docs/design-system.md` exists in the repo; the global token is the de facto source of truth.
- `AGENTS.md` specifies warm cream/off-white as the primary background direction; `#f4efe6` fits.

## Approaches considered

1. **`bg-background` token (`#f4efe6`)** — chosen. Reuses the existing token, removes seams, keeps admin isolated, and leaves intentional surface colors alone.
2. Homepage/navbar cream `#f4ebdc` — closest to the reference images but would require changing the root token and diverges from the existing token-based surfaces.
3. Light editorial `#faf6ee` — already used on three pages and in admin, but would make the public site read closer to the admin workspace.

## Scope (files to touch)

- `app/page.tsx` — home `<main>`
- `components/achievements/AchievementsContent.tsx` — achievements `<main>`
- `components/blog/BlogContent.tsx` — blog list `<main>`
- `app/contact/page.tsx` — contact `<main>`
- `components/projects/ProjectsContent.tsx` — projects list `<main>`
- `app/blog/[slug]/page.tsx` — article `<main>` and body `<section>`
- `components/blog/detail/ArticleHeader.tsx` — full-width header band
- `components/blog/detail/ArticleFigure.tsx` — full-width figure band (keep small figure/badge surfaces)
- `components/layout/Navbar.tsx` — navbar background

Already using `bg-background`: `app/about/page.tsx`, `app/projects/[slug]/page.tsx`, `app/auth/login/page.tsx`, `components/layout/Footer.tsx`, body. `app/not-found.tsx` inherits the body background and needs no change.

## Left to the builder

Nothing significant. Verify with `pnpm exec tsc --noEmit`, `pnpm run build`, and a visual pass over the public routes.
