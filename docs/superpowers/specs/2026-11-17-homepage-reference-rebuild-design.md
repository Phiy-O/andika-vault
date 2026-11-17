# Homepage Reference Rebuild Design

## Intent

Refine public homepage to match `docs/design-references/public/Public Portfolio Homepage — Structured Playful Neobrutalism (Refined).png` as primary visual source. User permits removing and repositioning objects within homepage scope.

## Goals

- Rebuild homepage composition around reference order and hierarchy:
  1. compact navigation
  2. split hero with editorial headline and framed visual
  3. approach statement strip
  4. selected projects section
  5. skills grouped by capability
  6. writing list
  7. achievements list
  8. coral contact CTA
  9. compact footer
- Preserve existing real content, server data loading, links, and public routes.
- Match reference visual language: warm cream, black rules, coral accents, serif/editorial headings, dense metadata, square borders, restrained shadows.
- Keep responsive layouts usable at 320px, 768px, 1024px, and 1440px.
- Preserve keyboard focus, semantic headings, meaningful image alt text, and accessible navigation.

## Non-goals

- No database, API, Prisma, auth, or content-model changes.
- No changes to non-homepage routes unless shared component styling must support homepage.
- No new dependencies.
- No invented portfolio content when existing data can populate a section.

## Constraints

- Use current Next.js, React, TypeScript, Tailwind, and existing components/services.
- Homepage remains server-rendered through `app/page.tsx`.
- Existing data sections remain functional: projects, skills, blog, certificates, settings.
- Reference imagery may guide composition but existing local/project imagery supplies actual content.

## Approaches

1. **Reference-first homepage composition — chosen.** Rewrite homepage structure and section markup while reusing existing data services and focused section components. Best visual match; permits removal and movement of current hero/about objects.
2. **CSS-only refinement — rejected.** Current section hierarchy differs materially from reference, so CSS cannot achieve target composition without brittle overrides.
3. **Hybrid rewrite — rejected.** Reuses more current layout, but leaves reference mismatches in hero, project presentation, skills grouping, and list sections.

## Design

- Replace current hero copy and portrait/code composition with reference-style split hero. Use existing profile asset only if it supports target framing; otherwise use an existing project/image asset without adding assets.
- Remove current standalone about block from homepage. Keep `/about` route unchanged.
- Replace decorative approach strip with reference-style bordered statement.
- Rework homepage project section into one featured project followed by two supporting projects, with reference metadata rows and compact case-study actions.
- Rework skills presentation into three capability cards using existing visible skills, grouped by deterministic display buckets without changing DB data.
- Present blog posts as compact bordered rows and certificates as compact bordered achievement rows.
- Keep contact CTA and footer, restyled/repositioned to reference hierarchy.
- Use explicit section IDs and existing routes for all actions.
- Use mobile-first stacking: hero visual below copy, featured project single column, capability cards one column, list rows remain readable without horizontal overflow.

## Builder decisions

- Existing content wins over reference placeholder copy.
- Homepage-only grouping uses stable skill order and does not persist categories.
- Existing shared navbar/footer can be adjusted only where needed for reference alignment; route behavior stays unchanged.
- If reference has an element absent from available data, render structural treatment without fabricating factual content.

## Verification

Run `pnpm exec tsc --noEmit`, `pnpm run lint`, and `pnpm run build`. Review responsive classes and semantic/accessibility states against 320px, 768px, 1024px, and 1440px targets.
