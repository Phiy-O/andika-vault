# Homepage Contact and Footer Reference Design

## Intent

Bring homepage lower section closer to supplied reference by separating contact CTA from footer and rebuilding footer as compact editorial identity block.

## Goals

- Add dedicated coral contact section before footer.
- Match reference CTA composition: readiness label, strong editorial heading, short description, `Get in touch` action, and email shortcut.
- Replace current multi-column footer with compact identity, role, social links, back-to-top action, and copyright metadata.
- Use existing settings email/social URLs and preserve `/contact` route.
- Keep keyboard focus, responsive stacking, readable contrast, and square bordered treatment.

## Non-goals

- No inline homepage contact form.
- No API, DB, validation, or contact workflow changes.
- No changes to `/contact` page behavior.
- No new dependencies.

## Approach

Create `components/home/HomeContactSection.tsx` for coral CTA. Modify `components/layout/Footer.tsx` into compact reference footer. Render contact section between milestones and footer in `app/page.tsx`. Existing settings lookup remains in server components.

## Design

- CTA uses `id="contact"`, `bg-[#e76f51]`, 2px foreground border, restrained offset shadow, responsive two-column layout.
- Primary link targets `/contact`; secondary link uses `mailto:${settings.email}` with safe fallback email.
- Footer uses cream background, top border, identity block, compact social text links, `/#top` link, role metadata, and copyright line.
- Remove duplicate `id="contact"` from footer.
- Preserve external link `target` and `rel` behavior.
