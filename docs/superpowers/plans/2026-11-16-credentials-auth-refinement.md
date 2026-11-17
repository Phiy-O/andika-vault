# Credentials Auth Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make one-admin NextAuth Credentials login reliable, diagnosable, and role-enforced across UI, proxy, server actions, and admin APIs.

**Architecture:** Keep NextAuth v4 Credentials with JWT sessions and environment-backed credentials. Normalize and validate credentials in `src/lib/auth.ts`, persist `role: "admin"` through JWT/session callbacks, and require that role at every admin boundary.

**Tech Stack:** Next.js 16, NextAuth v4, TypeScript, bcryptjs, Zod only where existing boundaries already use it, pnpm.

**Spec:** `docs/superpowers/specs/2026-11-16-credentials-auth-refinement-design.md`

## Global Constraints

- No Prisma schema changes.
- No new dependencies.
- Keep `proxy.ts` for route protection.
- Never expose secrets, hashes, or auth internals to clients.
- Keep generic client-facing authentication errors.
- Preserve `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and `NEXTAUTH_SECRET` configuration names.

## Review Focus

- Missing auth env: fail safely without leaking values; cover with auth configuration self-check.
- Malformed bcrypt hash: reject before compare; cover with self-check.
- Email whitespace/case differences: authenticate after trim/lowercase; cover with auth test.
- Authenticated non-admin session: deny proxy, actions, and APIs; cover with boundary tests or focused checks.
- Failed `signIn()` / thrown client request: stop loading and show generic error; cover login handler behavior.

---

### Task 1: Harden auth configuration and role typing

**Files:**
- Modify: `src/lib/auth.ts`
- Modify: `src/types/next-auth.d.ts`
- Test/self-check: `src/lib/auth.self-check.ts` or existing test location after inspecting package scripts

**Interfaces:**
- Produces `authOptions` with credentials authorization returning `{ id: string; name: string; email: string; role: "admin" }`.
- Produces `requireAdmin(): Promise<boolean>` that returns true only for `session.user.role === "admin"`.
- Adds `role` to `Session.user`, `User`, and `JWT` typings.

- [ ] **Step 1: Add failing checks** for normalized email matching, valid bcrypt prefix/length acceptance, malformed hash rejection, and role-only `requireAdmin()` behavior.
- [ ] **Step 2: Run the focused check** with the repository’s available command; record expected failure before implementation.
- [ ] **Step 3: Implement auth hardening**: trim/lowercase configured and submitted email, reject missing or malformed required env config, validate bcrypt format before `bcrypt.compare`, return role `admin`, persist role in JWT/session, and make `requireAdmin()` role-aware. Keep failures safe and generic.
- [ ] **Step 4: Run focused checks and `pnpm exec tsc --noEmit`**; expected pass for auth checks and typecheck.
- [ ] **Step 5: Commit** `feat: harden admin credentials authentication`.

### Task 2: Enforce admin role at every server boundary

**Files:**
- Modify: `proxy.ts`
- Modify: all existing admin server actions under `src/actions/`
- Modify: all existing admin API routes under `app/api/admin/`

**Interfaces:**
- Every admin mutation and admin API returns/redirects unauthorized requests consistently through role-aware checks.
- `proxy.ts` permits only authenticated admin sessions for `/admin/:path*`.

- [ ] **Step 1: Inventory current session checks** and identify each admin route/action using `getServerSession()` or weaker checks.
- [ ] **Step 2: Add focused authorization checks** proving authenticated non-admin sessions are denied at proxy, action, and API boundaries.
- [ ] **Step 3: Replace weaker checks** with `requireAdmin()` or an equivalent role-aware proxy callback, without changing response convention `{ data?: T; error?: string }`.
- [ ] **Step 4: Run focused checks and `pnpm exec tsc --noEmit`**; expected unauthorized cases denied and types pass.
- [ ] **Step 5: Commit** `fix: enforce admin role across protected boundaries`.

### Task 3: Make login failure handling deterministic

**Files:**
- Modify: `app/auth/login/page.tsx`

**Interfaces:**
- Submit handler always clears loading state through success, failed result, or thrown request.
- Successful `signIn()` redirects to `/admin`; all failures show generic `Invalid credentials`.

- [ ] **Step 1: Add a focused self-check or component test** for failed result and thrown request cleanup if project tooling supports it; otherwise isolate handler logic only if existing structure permits without abstraction.
- [ ] **Step 2: Implement `try/finally` handling** around `signIn()`, preserve generic error text, and prevent redirect when `result?.error` exists.
- [ ] **Step 3: Run `pnpm exec tsc --noEmit` and focused check**; expected pass.
- [ ] **Step 4: Commit** `fix: stabilize admin login feedback`.

### Task 4: Full verification

**Files:**
- No product changes unless verification exposes auth defect.

- [ ] **Step 1: Run `pnpm exec tsc --noEmit`.
- [ ] **Step 2: Run `pnpm run lint`; distinguish pre-existing failures from auth changes.
- [ ] **Step 3: Run `pnpm run build`.
- [ ] **Step 4: Manually verify with a fresh dev server:** valid credentials authenticate, wrong password returns generic error, email case/whitespace works, `/admin` denies non-admin session, and protected APIs reject unauthorized access.
- [ ] **Step 5: Commit any final verification-only fixes** with focused message.
