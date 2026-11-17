# Achievements Figma Design Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild `/achievements` to match Figma node `313:1741` while preserving live certificate behavior.

**Architecture:** Keep existing server certificate loading and client filtering/modal state. Replace listing presentation with achievements-local sections: milestone masthead, counters, archive panel, featured recognition, toolbar, year groups, certificate cards, and CTA.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Prisma-backed service.

**Spec:** `docs/superpowers/specs/2026-11-17-achievements-figma-design.md`

## Global Constraints

- Modify achievements scope only.
- Preserve certificate service, search, category filtering, load more, and modal behavior.
- No new dependency.
- No temporary Figma asset URLs.
- Keep semantic HTML, keyboard access, focus states, and responsive behavior.

## Review Focus

- Empty certificate results show a readable state.
- Long certificate titles and descriptions wrap without overflow.
- Missing certificate images preserve usable card layout.
- Modal trigger remains keyboard accessible.
- Year grouping handles certificates across multiple years.

---

### Task 1: Preserve certificate data contract

**Files:**
- Modify: `app/achievements/page.tsx`
- Inspect/modify: `components/achievements/AchievementsContent.tsx`

- [ ] Replace Prisma full-model cast with exact local certificate view type if list selector is lean.
- [ ] Keep service query and modal-compatible fields unchanged.
- [ ] Add/retain a small self-check for any extracted year grouping function if non-trivial logic moves out of component.
- [ ] Run `pnpm exec tsc --noEmit`.

### Task 2: Implement Figma-matched achievements layout

**Files:**
- Modify: `components/achievements/AchievementsContent.tsx`

- [ ] Build cream editorial canvas and 1200px content container.
- [ ] Add milestone masthead with archive labels, title, description, counters, and CSS technical archive panel.
- [ ] Add featured recognition card using first filtered certificate, issuer, date, description, credential action, and modal action.
- [ ] Add category/search toolbar with real counts and existing filter behavior.
- [ ] Group certificate cards by issue year and render dense responsive two-column sections.
- [ ] Add verification stamp and continuation CTA without inventing backend behavior.
- [ ] Preserve certificate modal and load-more behavior.

### Task 3: Responsive/accessibility finish

**Files:**
- Modify: `components/achievements/AchievementsContent.tsx`

- [ ] Verify 320px, 768px, 1024px, and 1440px layouts.
- [ ] Ensure modal triggers, filters, search, and load-more controls have keyboard access and visible focus.
- [ ] Ensure heading hierarchy, labels, alt text, status text, and empty state are semantic.
- [ ] Run `pnpm exec tsc --noEmit`.
- [ ] Run `pnpm exec eslint app/achievements/page.tsx components/achievements/AchievementsContent.tsx`.
- [ ] Run `pnpm run build`.

### Task 4: Final scope review

- [ ] Review git diff for achievements-only source changes.
- [ ] Confirm no temporary Figma URLs remain.
- [ ] Confirm certificate links/modal/filter behavior remains intact.
- [ ] Report verification and limitations.
