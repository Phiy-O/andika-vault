# Elias Reid About Content Design

## Intent

Make About page content match Figma reference identity Elias Reid while moving editable content into backend-backed site settings.

## Goals

- Replace hardcoded Andika About identity with Elias Reid content.
- Preserve Figma layout and visual hierarchy.
- Store profile facts, narrative, pillars, and timeline in existing site settings architecture.
- Expose About content through admin settings.
- Preserve existing skills, resume, social links, auth, routes, and contact workflow.
- Keep missing/legacy settings safe through defaults during migration.

## Non-goals

- No new About CMS table system.
- No homepage identity change unless explicitly requested later.
- No auth, contact API, DB workflow, or social-link behavior changes.
- No new dependencies.

## Approaches

1. Extend existing `site_settings` with About fields and structured JSON arrays. Recommended: smallest change, fits current settings service, editable from existing admin.
2. Add dedicated About profile/section tables. Rejected for unnecessary schema and CRUD complexity.
3. Keep content static in page code. Rejected because future refinement would require code edits.

## Data model

Add nullable About fields to existing site settings record:

- `aboutName`
- `aboutRole`
- `aboutLocation`
- `aboutFocus`
- `aboutIntro`
- `aboutDiscipline`
- `aboutPhilosophy`
- `aboutRuntime`
- `aboutJourney` JSON
- `aboutPillars` JSON
- `aboutTimeline` JSON
- `aboutQuote`

Structured arrays use validated object shapes:

- Journey: `{ title: string, body: string }[]`
- Pillars: `{ title: string, description: string, tag: string }[]`
- Timeline: `{ title: string, description: string }[]`

## Seed content

Use exact Figma reference content for Elias Reid, Seattle, architecture discipline, journey narrative, engineering pillars, timeline, quote, and runtime values. Existing project skills remain dynamic through `skillService`.

## UI behavior

`app/about/page.tsx` reads settings once and passes content into the Figma-matched sections. Defaults remain available for records without migrated values. Admin settings renders editable text inputs/textareas for scalar fields and structured JSON editors or existing project convention for arrays. Validate JSON at the trust boundary and reject malformed shapes without overwriting stored data.

## Verification

- Migration applies cleanly against existing database.
- TypeScript passes.
- Admin settings can save Elias content.
- `/about` renders saved values at port `3000`.
- Missing optional fields use safe defaults.
- No duplicate homepage/contact behavior changes.
