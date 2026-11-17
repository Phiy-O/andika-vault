# Homepage Contact and Footer Reference Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add reference-style homepage contact CTA and compact editorial footer.

**Architecture:** Create one homepage contact presentation component. Keep settings lookup in server components. Replace footer content without changing contact API, routes, or social settings behavior.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, lucide-react.

**Spec:** `docs/superpowers/specs/2026-11-17-home-contact-footer-reference-design.md`

## Global Constraints

- No inline homepage contact form.
- No API, DB, validation, or contact workflow changes.
- No changes to `/contact` page behavior.
- No new dependencies.
- Preserve accessibility and responsive behavior.

## Review Focus

- Missing email setting: fallback mail link remains valid.
- Missing social URLs: links do not expose broken decorative controls.
- Mobile CTA/footer: no horizontal overflow or clipped actions.
- Duplicate anchors: only contact CTA owns `id="contact"`.
- External links: retain safe `target` and `rel` behavior.

---

### Task 1: Add homepage contact CTA

**Files:**
- Create: `components/home/HomeContactSection.tsx`
- Modify: `components/home/index.ts`
- Modify: `app/page.tsx`

**Interfaces:**
- `HomeContactSection({ email }: { email?: string | null })`.
- Produces section `id="contact"`, `/contact` primary action, and mailto secondary action.

- [ ] **Step 1: Implement `HomeContactSection`**
  - Use coral background, 2px foreground border, offset shadow, readiness label, editorial heading, supporting copy, and two square bordered actions.
  - Fallback email: `andikapiyo12@gmail.com`.

- [ ] **Step 2: Export and render after milestones, before footer**
  - Pass `settings?.data?.email`.
  - Keep existing homepage data loading unchanged.

- [ ] **Step 3: Run `pnpm exec tsc --noEmit`**
  - Expected: PASS.

### Task 2: Rebuild compact footer

**Files:**
- Modify: `components/layout/Footer.tsx`

**Interfaces:**
- Preserve `getSiteSettings()` and social URL fields.
- Preserve external link safety.

- [ ] **Step 1: Replace multi-column footer content**
  - Remove duplicate `id="contact"`.
  - Render identity, role/description, social text links, `Back to top`, copyright, and compact metadata.
  - Keep settings-driven LinkedIn, GitHub, Instagram links.

- [ ] **Step 2: Align responsive layout**
  - Stack identity and links on mobile; keep compact row on desktop.
  - Use square borders, cream background, black rules, monospace metadata, no gradients or excessive rounding.

- [ ] **Step 3: Run `pnpm run lint`**
  - Expected: no new errors attributable to changed files; document baseline errors.

### Task 3: Verify homepage lower sections

**Files:**
- Modify only verified defects.

- [ ] **Step 1: Run `pnpm exec tsc --noEmit`**
- [ ] **Step 2: Run `pnpm run lint`**
- [ ] **Step 3: Review homepage at 320px, 768px, 1024px, and 1440px**
  - Confirm CTA actions, mailto behavior, footer links, focus states, and no horizontal overflow.
- [ ] **Step 4: Run `pnpm run build` with valid `DATABASE_URL`**
  - If DB credentials unavailable, record exact blocker.

## Completion Criteria

- Contact CTA visually matches reference lower-section hierarchy.
- Footer visually matches compact reference identity block.
- Existing contact workflow, settings, social links, and routes remain intact.
