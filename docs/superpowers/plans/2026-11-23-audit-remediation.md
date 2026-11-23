# Audit Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the critical and high-priority issues found in the 2026-11-23 codebase audit, in the recommended sequence.

**Architecture:** Keep the existing UI → actions/API routes → services → repositories → Prisma layering. Add small shared helpers for cross-cutting concerns (public cache invalidation, transient retry, validation). Every mutation stays behind `requireAdmin()`.

**Tech Stack:** Next.js 16, React 19, TypeScript, Zod 4, Prisma 7 + pg adapter, pnpm.

**Spec:** `AGENTS.md` plus the audit report delivered in conversation on 2026-11-23.

## Global Constraints

- Use `pnpm` exclusively.
- Server actions return `{ data?, error? }`.
- Every admin mutation calls `await requireAdmin()` first.
- Never introduce `any` as a shortcut; never expose secrets to the client.
- No unnecessary `"use client"`; keep DB access in repositories.
- Verify each task with `pnpm exec tsc --noEmit` and the relevant test script.

## Review Focus

- Partial PATCH with only `{ isVisible }` must not erase sibling fields (Zod 4 defaults).
- Direct invocation of exported server actions must never bypass authorization.
- The real admin UI delete path (API route) must revalidate public content.
- pg pool-queue timeout and `AggregateError` connection failures must be retried.
- Runtime DB pool sizing must not turn ordinary page concurrency into hard failures.

---

### Task 1: Stop partial updates from erasing content

**Files:**
- Modify: `src/lib/validations/blog-post.ts`, `project.ts`, `certificate.ts`, `skill.ts`
- Test: `scripts/test-validation.ts` (new), `package.json` (`test` script)

**Interfaces:**
- Produces: update schemas whose omitted fields stay `undefined` after `.parse()`.

- [ ] **Step 1:** Write failing tests asserting `projectUpdateSchema.parse({ isVisible: false })` has no `screenshots`, `techStack`, `bodyFormat`, `sortOrder` keys; same pattern for blog/certificate/skill.
- [ ] **Step 2:** Run `pnpm test` and watch it fail.
- [ ] **Step 3:** Rebuild update schemas with `.optional()` overrides that remove `.default()` effects.
- [ ] **Step 4:** Run `pnpm test` and confirm green.
- [ ] **Step 5:** Commit.

### Task 2: Close unauthenticated Server Action reads

**Files:**
- Modify: `src/actions/message.ts`, `skill.ts`, `blog-post.ts`, `project.ts`
- Test: `scripts/test-action-guards.ts` (new)

**Interfaces:**
- Produces: every admin-only read action returns `{ error: "Unauthorized" }` without an admin session.

- [ ] **Step 1:** Write failing source-level tests asserting the guarded actions contain `requireAdmin()` and public detail actions use visible lookups.
- [ ] **Step 2:** Run and watch fail.
- [ ] **Step 3:** Add guards; switch public single-item lookups to visible variants or remove unused actions.
- [ ] **Step 4:** Run tests + `tsc`.
- [ ] **Step 5:** Commit.

### Task 3: Make the real delete path revalidate public content

**Files:**
- Modify: `app/api/admin/blog/[id]/route.ts`, `projects/[id]/route.ts`, `certificates/[id]/route.ts`, `skills/[id]/route.ts`
- Test: `scripts/test-revalidation-wiring.ts` (new)

- [ ] **Step 1:** Write failing tests asserting every DELETE handler calls `revalidatePublicContent` (directly or through the action).
- [ ] **Step 2:** Run and watch fail.
- [ ] **Step 3:** Revalidate after successful deletes, preserving Cloudinary cleanup.
- [ ] **Step 4:** Run tests + build.
- [ ] **Step 5:** Commit.

### Task 4: Harden transient connection detection

**Files:**
- Modify: `src/lib/prisma-retry.ts`, `scripts/test-prisma-retry.ts`

- [ ] **Step 1:** Add failing cases for `timeout exceeded when trying to connect` and `AggregateError.errors`.
- [ ] **Step 2:** Run and watch fail.
- [ ] **Step 3:** Extend message regex and traverse `errors` arrays.
- [ ] **Step 4:** Run and confirm green.
- [ ] **Step 5:** Commit.

### Task 5: Make DB pool sizing safe at runtime

**Files:**
- Modify: `lib/prisma.ts`, `next.config.ts` (comment accuracy)

- [ ] **Step 1:** Decide and document: keep small pool for build workers, larger configurable pool at runtime via `PRISMA_POOL_MAX`.
- [ ] **Step 2:** Implement with validation and no secret exposure.
- [ ] **Step 3:** `tsc` + build.
- [ ] **Step 4:** Commit.

### Task 6: Repo hygiene / tooling

**Files:**
- Modify: `tsconfig.json`, `eslint.config.mjs`, `package.json`
- Delete: tracked scratch artifacts; stale `.worktrees/` gitlink (after user confirmation)
- Create: `.github/workflows/ci.yml`, missing design docs (or document their absence)

- [ ] **Step 1:** Exclude `.worktrees/**` and nested `**/.next/**` from tsc/eslint.
- [ ] **Step 2:** Add a real `test` script and CI workflow.
- [ ] **Step 3:** Remove scratch artifacts from the repo.
- [ ] **Step 4:** Verify `pnpm run lint` no longer explodes.
- [ ] **Step 5:** Commit.

### Deferred (later phases from the audit)

- Login rate limiting, contact subject/consent, Cloudinary cleanup correctness, unread messages, revalidation error isolation.
- Frontend: nested `<main>`, mobile nav focus trap, reduced motion, design-token cleanup, Projects admin dedupe, broken filters/#top link.
- Feature gaps: landing-page section management, server-side pagination, settings dirty guard.
