# Projects Figma Design

## Intent
Match Projects page Figma node `313:558` while preserving live project data and interactions.

## Goals
- Rebuild `/projects` visual structure from reference.
- Keep projects dynamic from existing service.
- Preserve search, filters, load-more, and project links.
- Add responsive desktop, tablet, and mobile layouts.

## Non-goals
- No admin, blog, achievements, database, auth, or global shell changes.
- No schema or service changes.
- No static replacement of project records.

## Approach
Keep existing server project loading and client filtering state. Rebuild presentation with editorial intro panel, CSS blueprint panel, featured flagship project, terminal diagnostics, filter/search toolbar, two-column engineering catalog, empty state, load-more, and archive CTA. Use exact local project fields and CSS visuals where no local matching asset exists.

## Constraints
- Existing Next.js, React, TypeScript, Tailwind v4 stack.
- Preserve project detail routes and external links.
- No temporary Figma asset URLs in source.
- Semantic controls, keyboard focus, responsive layout.

## Verification
Run TypeScript, focused lint, build, and diff-scope checks. Confirm search, filters, load-more, links, empty state, and responsive behavior.
