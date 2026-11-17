# Contact Figma Design

## Intent
Match contact page Figma node `313:2354` while preserving real contact submission and configured channels.

## Goals
- Replace generic hero and rounded cards with technical editorial contact layout.
- Preserve `ContactForm` validation, submission, success, and error behavior.
- Preserve site settings email and social URLs.
- Add responsive desktop, tablet, and mobile layouts.

## Non-goals
- No backend, schema, auth, admin, or global design changes.
- No temporary Figma asset URLs.
- No fake contact channels or hardcoded external profile URLs when settings are absent.

## Approach
Rebuild `app/contact/page.tsx` and `components/contact/ContactForm.tsx` using cream/coral/blue/green/ink tokens, telemetry strip, editorial intro, CSS dispatch schematic, logistics panel, channel rows, protocol validator, archive CTA, and existing live form behavior. Use CSS illustration fallback where no local exact asset exists.

## Constraints
- Existing Next.js, React, TypeScript, Tailwind v4 stack.
- Preserve server settings query and form action contract.
- Semantic labels, keyboard focus, clear loading/error/success states.
- Responsive stacking at mobile widths.

## Verification
Run TypeScript, focused ESLint, build, and diff checks. Verify configured email/social links, form states, and contact-only source scope.
