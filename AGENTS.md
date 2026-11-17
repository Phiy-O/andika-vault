# AGENTS.md

## 1. Project Overview

This repository contains a personal portfolio website that represents the owner's professional identity, technical capabilities, projects, achievements, and learning journey.

The website consists of two primary areas:

### Public Website
- Home / Landing Page
- About Me
- Projects
- Blog
- Blog Article Detail
- Achievements / Certificates
- Contact

### Admin Dashboard
A private dashboard for managing website content and configurable landing page sections.

The admin dashboard is responsible for managing content such as:
- Projects
- Blog articles
- Achievements and certificates
- Skills and technologies
- Landing page content and sections
- Media and uploaded assets
- Other existing website settings

Do not assume every feature listed above has already been implemented. Inspect the existing codebase before adding, modifying, or removing functionality.

### Main Objective

Build a professional, distinctive, maintainable, and responsive personal portfolio website.

The website should communicate personality, technical credibility, creativity, and professional experience through its content and visual presentation.

Avoid generic AI-generated website aesthetics. Every design decision should have a clear visual or functional purpose.

---

## 2. Technology Stack

Use the existing technology stack unless a change is explicitly requested.

| Technology | Purpose |
|---|---|
| Next.js 16 | Application framework |
| React 19 | UI library |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| Prisma 7 | ORM |
| PostgreSQL / Supabase | Database |
| NextAuth v4 | Authentication |
| Zod | Schema validation |
| Cloudinary | Media storage |
| LexKit / Lexical | Rich text editor |
| sanitize-html | HTML sanitization |
| pnpm | Package manager |

### Package Manager

- Use `pnpm` exclusively.
- Do not introduce npm, yarn, or bun commands.
- Do not modify the package manager or lockfile strategy without explicit approval.

### Common Commands

```bash
pnpm dev
pnpm run build
pnpm run lint
pnpm exec tsc --noEmit
```

Database commands:

```bash
pnpm prisma db push
pnpm prisma generate
```

Use the existing seed command when database seeding is required. Inspect `package.json` before assuming command names or scripts.

---

## 3. Project Structure and Architecture

The project currently uses the following architecture:

```text
app/
  api/
  ...

components/
  ...

lib/
  prisma.ts

proxy.ts

src/
  actions/
  services/
  repositories/
  lib/
    auth.ts
    cloudinary.ts
    cloudinary-url.ts
  types/
```

Other existing configuration files include:

- `prisma.config.ts`
- `postcss.config.mjs`
- `app/globals.css`

The `@/*` import alias maps to the repository root.

Always inspect the actual repository before creating new directories or restructuring existing files.

### Data Flow

Follow the existing layered architecture:

```text
UI Components
     |
     v
Server Actions / API Routes
     |
     v
Services
     |
     v
Repositories
     |
     v
Prisma
     |
     v
PostgreSQL
```

Responsibilities:

**UI Components**
- Handle presentation and user interaction.
- Avoid placing business logic directly inside presentation components.
- Reuse shared components when appropriate.

**Server Actions (`src/actions/`)**
- Handle requests originating from the UI.
- Validate incoming data.
- Perform authorization checks.
- Delegate business operations to services.
- Return the established response format.

**API Routes (`app/api/`)**
- Handle HTTP-based integrations and operations.
- Follow the existing route conventions.

**Services (`src/services/`)**
- Contain business logic and application workflows.
- Coordinate repositories and other services.

**Repositories (`src/repositories/`)**
- Handle database queries and persistence.
- Keep database access out of UI components.

**Prisma**
- Remains the database access layer.

### Server Action Response Convention

Use the established response format:

```ts
{
  data?: T;
  error?: string;
}
```

Do not introduce a different response convention without a clear reason and explicit approval.

### Database Query Guidelines

- Prefer lean selectors for list queries.
- Reuse existing selectors such as `blogPostListSelect` and `projectListSelect`.
- Avoid fetching unnecessary fields.
- Avoid N+1 query patterns.
- Keep database queries inside repositories.

---

## 4. Authentication and Security

Security is a core requirement, especially for the admin dashboard and content management operations.

### Authentication

- The project uses NextAuth v4 with Credentials authentication.
- Password verification uses bcrypt.
- Authentication configuration is located in `src/lib/auth.ts`.
- `proxy.ts` is used for the Next.js 16 request interception and admin route protection.
- Do not replace `proxy.ts` with the older `middleware.ts` convention.

### Authorization

- All admin mutations must call `await requireAdmin()` before executing the operation.
- Never rely exclusively on frontend route protection.
- Verify authorization on the server side for every sensitive operation.
- Do not expose admin-only data through public endpoints.

### Input Validation

- Use Zod for request and form validation.
- Validate all untrusted input on the server.
- Never assume frontend validation is sufficient.

### Rich Text Content

- LexKit uses Lexical.
- The editor must be loaded dynamically in client components when required by the existing implementation.
- Sanitize rich text content with `sanitizeContent()` before rendering HTML using `dangerouslySetInnerHTML`.
- Never render unsanitized user-generated HTML.

### Cloudinary

- Signed uploads are handled through `/api/cloudinary/signature`.
- Cloudinary server functionality belongs in `src/lib/cloudinary.ts`.
- Client-safe Cloudinary URL helpers belong in `src/lib/cloudinary-url.ts`.
- Never import the server-only Cloudinary module into client components.
- Cleanup operations are handled through `/api/cron/cloudinary-cleanup`.
- Cron authentication uses the `CRON_SECRET` Bearer token.

### General Security Rules

- Never expose secrets, tokens, credentials, or private environment variables to the client.
- Never hardcode secrets in source files.
- Use server-only modules for server-side operations.
- Sanitize and validate external input.
- Avoid insecure direct object references and unauthorized resource access.
- Do not trust client-submitted user IDs, roles, or ownership information.
- Preserve existing security boundaries when refactoring.

---

## 5. Design Direction

The website follows a **Structured Playful Neobrutalism** direction.

The visual identity should feel:

- Editorial
- Expressive
- Structured
- Creative
- Professional
- Personal
- Modern without looking generic

The website should balance playful visual elements with a clear information hierarchy.

### Visual Characteristics

**Color**
- Warm cream / off-white as the primary background direction.
- Coral / salmon as an expressive accent.
- Black / near-black for typography, borders, and contrast.
- Use neutral supporting colors when necessary.
- Avoid excessive colors or decorative accents.

**Typography**
- Use expressive editorial typography for prominent headings.
- Use a clean and readable sans-serif for body content.
- Use monospace typography for technical metadata, labels, or supporting details when appropriate.
- Maintain a clear typography hierarchy.

**Layout**
- Use structured grids and deliberate spacing.
- Create strong visual hierarchy.
- Use visible borders where appropriate.
- Use square or subtly rounded corners rather than excessive rounding.
- Use restrained offset shadows when they contribute to the visual identity.
- Maintain visual balance between content, whitespace, and decorative elements.

### Avoid

- Generic AI-generated layouts.
- Excessive gradients.
- Glassmorphism.
- Excessive rounded cards.
- Unnecessary floating decorations.
- Randomly applied accent colors.
- Overused pill-shaped UI elements.
- Inconsistent spacing and typography.
- Decorative elements that reduce readability.
- Components that look visually unrelated to the overall design system.

### Public Website vs Admin Dashboard

Both areas must belong to the same visual identity, but they have different functional priorities.

**Public Website**
- Editorial and storytelling-oriented.
- More expressive layouts.
- Strong visual presentation.
- Content and personality should be the focus.

**Admin Dashboard**
- Editorial workspace with a productivity-oriented layout.
- Information-dense but readable.
- Clear navigation and content hierarchy.
- Prioritize usability, efficiency, and accessibility.
- Use the same design language without blindly copying public website layouts.

---

## 6. Design References and Documentation

Design reference PDFs are stored under:

```text
docs/
  design-references/
    public/
    admin/
  design-system.md
  page-specifications.md
```

The actual filenames and directory contents must be inspected before implementation.

### Design Reference Interpretation

Design PDFs are visual references, not immutable implementation instructions.

They communicate:
- Intended composition.
- Visual hierarchy.
- Layout direction.
- Component appearance.
- Spacing relationships.
- Page-specific visual characteristics.

They do not automatically define the final implementation of every shared component.

**Never blindly reproduce inconsistencies found across different PDF references.**

When references conflict, use the following priority:

1. `docs/design-system.md` — source of truth for shared visual rules and components.
2. `docs/page-specifications.md` — source of truth for page-specific layouts and intentional variations.
3. Relevant design reference PDFs — visual guidance for the intended appearance.
4. Existing implementation — technical and functional context that must be inspected before making changes.

`AGENTS.md` defines the working rules and constraints for interpreting these sources.

### Design Conflict Resolution

Before implementing a page:

1. Inspect its relevant design reference.
2. Identify recurring components shared with other pages.
3. Compare those components across relevant references.
4. Identify inconsistencies and possible intentional variations.
5. Check whether the design system already defines the correct behavior.
6. If a significant conflict is not documented, propose a resolution before implementing it.

Distinguish between:

**Unintentional inconsistency**
- Different navbar structures without a clear functional reason.
- Different button styles for the same action.
- Arbitrary typography or spacing differences.
- Different card treatments for equivalent content.
- Inconsistent container widths or alignment.

These should generally be standardized.

**Intentional variation**
- A different navigation behavior on mobile.
- A unique hero composition for a specific page.
- A page-specific card layout serving a different content purpose.
- Different section arrangements that support different user goals.
- A distinct admin interaction pattern required by the workflow.

These may be preserved when they have a clear purpose.

Do not force every page to look identical. Consistency means following the same visual language, not removing page individuality.

### Shared Component Consistency

Recurring components must be implemented through reusable components or a clearly defined shared pattern when appropriate.

Examples include:
- Navbar
- Footer
- Buttons
- Form controls
- Typography patterns
- Content containers
- Cards
- Badges
- Navigation elements
- Dialogs and overlays

Do not create duplicate implementations of the same shared component merely because individual PDF references show different appearances.

If a genuine variation is necessary, implement it as an explicit component variant rather than an unrelated duplicate.

### Design Documentation Responsibilities

**`docs/design-system.md`**

Documents:
- Color tokens.
- Typography scale.
- Spacing scale.
- Borders and radii.
- Shadows.
- Layout and container rules.
- Responsive behavior.
- Shared components.
- Component variants.
- Interaction and state conventions.

**`docs/page-specifications.md`**

Documents:
- Page purpose.
- Page hierarchy.
- Section composition.
- Page-specific components.
- Intentional visual variations.
- Interaction behavior.
- Responsive adaptations.
- Relevant reference PDF.

Do not silently introduce major design decisions that conflict with these documents.

### Responsive Adaptation

PDF references may only represent desktop layouts.

Do not assume desktop composition should be copied directly to smaller screens.

Adapt layouts for:
- Desktop.
- Tablet.
- Mobile.

Preserve the design identity, hierarchy, readability, and functionality at every viewport.

### PDF Usage Rules

- Keep design reference PDFs inside `docs/design-references/`.
- Do not put design documentation PDFs in `public/`.
- Inspect the relevant PDF before implementing its corresponding page.
- Use the design system for shared visual rules.
- Use page specifications for page-specific requirements.
- Do not invent major visual directions without approval.
- Do not blindly copy a static reference when it conflicts with responsive behavior, accessibility, or actual application functionality.

---

## 7. Frontend Engineering Guidelines

Follow the installed `frontend-ui-engineering` skill when working on frontend implementation.

Read the skill instructions before significant UI work.

The skill provides general frontend engineering standards, while this file provides project-specific constraints and design direction.

### Component Architecture

- Prefer small, focused, reusable components.
- Separate presentation from business logic.
- Avoid unnecessary component abstraction.
- Avoid giant components containing unrelated responsibilities.
- Reuse shared components instead of duplicating markup and styling.
- Keep component responsibilities clear.
- Follow the existing folder and naming conventions.

### State Management

- Use local component state for local UI interactions.
- Use the existing application patterns for shared state.
- Avoid introducing new state management libraries unless necessary.
- Keep server state and client interaction state appropriately separated.

### Styling

- Use Tailwind CSS v4.
- Follow the existing styling conventions.
- Reuse design tokens and shared component styles.
- Avoid arbitrary values when an existing design token or utility already represents the same purpose.
- Avoid introducing conflicting CSS overrides.
- Do not create a separate design language for individual pages.

### Accessibility

Follow WCAG 2.1 AA principles where applicable.

Ensure:
- Semantic HTML.
- Keyboard accessibility.
- Visible focus states.
- Sufficient color contrast.
- Accessible form labels.
- Appropriate ARIA attributes when needed.
- Descriptive alternative text for meaningful images.
- Clear interaction feedback.

### Interaction and UI States

Consider the complete component lifecycle, not just its static appearance.

Implement appropriate:
- Default states.
- Hover states.
- Focus states.
- Active states.
- Disabled states.
- Loading states.
- Empty states.
- Success states.
- Error states.

Forms must provide clear validation and submission feedback.

Interactive elements must have meaningful behavior. Do not use decorative controls that appear functional but do nothing.

### Responsive Design

- Design mobile-first when appropriate.
- Avoid horizontal overflow.
- Ensure navigation works across viewport sizes.
- Preserve content hierarchy on smaller screens.
- Make tables, forms, and dashboard layouts usable on mobile.
- Test relevant breakpoints rather than assuming responsiveness from CSS alone.

### Animation

- Use motion to communicate state changes or improve interaction.
- Keep transitions purposeful and restrained.
- Avoid excessive animation and distracting effects.
- Respect reduced-motion preferences.
- Do not sacrifice usability for visual effects.

---

## 8. Admin Dashboard Guidelines

The admin dashboard is a content management workspace, not simply a collection of decorative cards.

Prioritize:
- Clear information hierarchy.
- Efficient navigation.
- Consistent CRUD interactions.
- Readable data presentation.
- Clear form structure.
- Predictable interaction patterns.
- Useful empty and error states.

### CRUD Consistency

Where applicable, management modules should follow a consistent pattern:

1. Page title and contextual description.
2. Primary action.
3. Search and filtering controls.
4. Data presentation.
5. Pagination when necessary.
6. Create and edit forms.
7. Delete confirmation.
8. Success and error feedback.

Do not force every module to use exactly the same layout if its content or workflow requires a different structure.

### Destructive Actions

- Confirm destructive operations.
- Clearly communicate what will be deleted.
- Avoid accidental deletion.
- Handle dependent resources appropriately.
- Ensure server-side authorization.

### Content Management

- Preserve existing content and database relationships.
- Avoid destructive schema changes.
- Consider published, draft, and unpublished content states where supported by the existing model.
- Ensure public pages display only content intended to be public.

---

## 9. Database and Prisma Guidelines

The project uses Prisma 7 with PostgreSQL.

### Prisma 7 Configuration

- Use the existing `@prisma/adapter-pg` adapter.
- Respect the current `prisma.config.ts` configuration.
- Do not apply older Prisma configuration conventions without checking compatibility.

### Supabase Connection Considerations

The current database uses Supabase.

Operational notes:
- The session pooler on port `5432` has a connection limit.
- The observed connection exhaustion issue includes `EMAXCONNSESSION`.
- If build processes exhaust connections, consider the transaction pooler on port `6543` where appropriate.
- Avoid unnecessary concurrent database connections.
- Do not change connection configuration without checking the current environment and deployment requirements.

### Schema Changes

- Inspect existing schema and relationships before modifying models.
- Preserve existing records and relationships.
- Avoid unnecessary migrations or destructive changes.
- Generate Prisma Client after schema changes.
- Verify affected queries and services after modifying the schema.

---

## 10. Next.js and Tailwind Operational Notes

### Next.js 16

- Use `proxy.ts` for the existing request interception logic.
- Do not revert to the old `middleware.ts` convention.
- Follow App Router conventions.
- Keep server and client components appropriately separated.
- Do not add `"use client"` unnecessarily.

### Tailwind CSS v4

- Tailwind is configured through CSS directives in `app/globals.css`.
- PostCSS configuration is in `postcss.config.mjs`.
- Do not assume a `tailwind.config.js` file exists.
- Do not introduce Tailwind v3 configuration patterns.

### LexKit / Lexical

- The rich text editor requires client-side handling.
- Use dynamic imports with `ssr: false` in client components when required by the current implementation.
- Sanitize content before rendering it as HTML.

---

## 11. Development Workflow

Follow this workflow when implementing a feature or modifying existing functionality.

### Step 1 — Understand

Before making changes:
- Inspect relevant files.
- Understand existing architecture.
- Identify dependencies.
- Check existing shared components.
- Read relevant design documentation.
- Inspect relevant PDF references when working on UI.

Do not assume how the existing implementation works.

### Step 2 — Plan

Before significant changes:
- Identify the affected files.
- Identify possible regressions.
- Determine whether existing components can be reused.
- Consider security, accessibility, and responsiveness.
- Identify design conflicts if the task involves UI.

For major design conflicts, propose the resolution before implementation.

### Step 3 — Implement

- Follow existing conventions.
- Make focused changes.
- Preserve unrelated functionality.
- Reuse shared components.
- Avoid unnecessary dependencies.
- Do not rewrite working modules without a clear reason.

### Step 4 — Verify

Run the relevant checks:

```bash
pnpm exec tsc --noEmit
pnpm run lint
pnpm run build
```

Not every check needs to be run after every trivial change, but relevant verification must be performed before considering significant work complete.

Existing lint configuration may produce `@typescript-eslint/no-explicit-any` warnings. Do not introduce new warnings or use `any` as a shortcut.

### Step 5 — Report

Summarize:
- What changed.
- Which files were affected.
- Important implementation decisions.
- Verification performed.
- Known limitations or remaining issues.

Never claim that a check passed if it was not executed successfully.

---

## 12. Project Boundaries

### Do Not

- Change the overall website concept without approval.
- Replace the existing technology stack without approval.
- Rewrite backend architecture merely to simplify frontend work.
- Introduce unnecessary dependencies.
- Remove existing features without approval.
- Modify database structures without understanding their impact.
- Expose private information or credentials.
- Duplicate shared components without justification.
- Blindly reproduce inconsistent PDF references.
- Invent new design patterns that conflict with the design system.
- Make unrelated modifications while implementing a requested feature.
- Claim functionality works without verification.

### Decision-Making Principles

When several implementation approaches are possible:

1. Prefer the simplest maintainable solution.
2. Preserve existing architecture and conventions.
3. Prefer reusing existing functionality.
4. Prioritize security and correctness.
5. Follow the established design system.
6. Preserve intentional page-specific visual identity.
7. Avoid unnecessary abstractions and dependencies.

If a decision has a significant impact on architecture, security, database structure, or the overall visual identity, explain the trade-offs and request approval before proceeding.

---

## 13. Definition of Done

A task is considered complete when:

- The requested functionality is implemented.
- Existing functionality remains intact.
- The implementation follows the established architecture.
- Server-side authorization and validation are applied where required.
- The UI follows the design system and relevant page specifications.
- Shared components remain visually consistent.
- Intentional page-specific variations are preserved.
- Responsive behavior is considered.
- Accessibility and interaction states are addressed.
- Relevant TypeScript, lint, and build checks are verified.
- Any remaining limitations are clearly reported.