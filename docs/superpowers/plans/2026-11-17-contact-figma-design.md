# Contact Figma Design Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild `/contact` to match Figma node `313:2354` while preserving real contact behavior.

**Architecture:** Keep server settings loading in `app/contact/page.tsx` and existing form submission contract. Replace page presentation with contact-local technical editorial sections and update `ContactForm` styling/state feedback.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4.

**Spec:** `docs/superpowers/specs/2026-11-17-contact-figma-design.md`

## Global Constraints

- Contact scope only.
- Preserve form validation, submission, success, error, settings email, and social URLs.
- No new dependency.
- No temporary Figma asset URLs.
- Keep semantic labels, keyboard focus, and mobile stacking.

## Review Focus

- Form errors remain visible and understandable after visual rebuild.
- Submission loading state prevents duplicate submissions.
- Missing settings URLs do not create misleading external links.
- Long messages and email addresses wrap without overflow.
- Mobile two-column desktop layout stacks without clipped controls.

---

### Task 1: Inspect and preserve form contract

**Files:**
- Inspect/modify: `components/contact/ContactForm.tsx`
- Modify: `app/contact/page.tsx`

- [ ] Preserve current server action, field names, validation, success, error, and loading behavior.
- [ ] Remove generic `PageHero`, CTA, rounded styling, and replace page wrapper with contact-local structure.
- [ ] Preserve configured social URLs and email fallback behavior.
- [ ] Run `pnpm exec tsc --noEmit`.

### Task 2: Implement technical contact layout

**Files:**
- Modify: `app/contact/page.tsx`

- [ ] Add telemetry strip with gateway, handshake, and protocol labels.
- [ ] Add editorial contact header, encrypted dispatch label, availability status, and highlighted title.
- [ ] Add CSS dispatch schematic, logistics panel, and direct channel rows.
- [ ] Add protocol validator and archive CTA links.
- [ ] Preserve dynamic email/social URLs and use meaningful disabled/fallback behavior for absent URLs.
- [ ] Add responsive stacking and accessibility states.

### Task 3: Restyle contact form

**Files:**
- Modify: `components/contact/ContactForm.tsx`

- [ ] Match technical form card, labels, fields, presets, textarea, consent control, submit button, and diagnostic footer.
- [ ] Preserve all existing validation and response feedback.
- [ ] Ensure inputs have labels, focus states, error associations, and disabled state.
- [ ] Run focused ESLint.

### Task 4: Verify contact page

- [ ] Run `pnpm exec tsc --noEmit`.
- [ ] Run `pnpm exec eslint app/contact/page.tsx components/contact/ContactForm.tsx`.
- [ ] Run `pnpm run build`.
- [ ] Run `git diff --check`.
- [ ] Review 320px, 768px, 1024px, and 1440px layouts.
- [ ] Confirm contact-only source scope and no temporary Figma URLs.
