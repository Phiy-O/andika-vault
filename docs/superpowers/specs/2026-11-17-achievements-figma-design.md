# Achievements Figma Design

## Intent
Match achievements page at Figma node `313:1741` while preserving live certificate data and interactions.

## Goals
- Rebuild `/achievements` visual structure from reference.
- Keep certificates dynamic from existing service.
- Preserve search, category filtering, load more, and certificate modal.
- Group milestones by issue year.
- Add responsive desktop, tablet, and mobile layouts.

## Non-goals
- No admin, blog, database, auth, or global shell changes.
- No schema or service changes unless required by existing data shape.
- No static replacement of certificate records.

## Constraints
- Existing Next.js, React, TypeScript, Tailwind v4 stack.
- Existing certificate modal remains interaction endpoint.
- Achievements scope means `app/achievements` and achievement-local components/styles only.
- No temporary Figma asset URLs in source.

## Approach
Keep existing server data query and client filtering state. Rebuild presentation with editorial milestone masthead, summary counters, CSS technical archive panel, featured recognition card, toolbar, year-grouped certificate cards, verification stamp, and continuation CTA. Use local certificate view typing because list selectors may return lean fields. Use CSS illustration fallback where no local exact asset exists.

## Verification
Run TypeScript, build, focused lint, and diff-scope checks. Review `/achievements` at 320px, 768px, 1024px, and 1440px. Confirm keyboard modal triggers, focus-visible states, search/filter/load-more behavior, empty state, and no out-of-scope changes.
