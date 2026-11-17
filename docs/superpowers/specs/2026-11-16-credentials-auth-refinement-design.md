# Credentials Auth Refinement Design

## Intent
Stabilize admin login while preserving NextAuth v4 Credentials authentication and avoiding database changes. Current 401 failures are hard to diagnose because environment configuration and credential validation lack clear boundaries.

## Goals
- Keep NextAuth v4 with JWT sessions.
- Authenticate one admin through environment variables.
- Normalize email input with trim and lowercase.
- Validate required auth configuration and bcrypt hash format.
- Add `admin` role to JWT and session.
- Make `requireAdmin()` enforce authenticated admin access.
- Keep `/admin` protected by `proxy.ts`.
- Return safe client-facing login errors without exposing secrets.

## Non-goals
- No Prisma schema changes.
- No admin management UI.
- No password reset UI.
- No custom session implementation.
- No new dependencies.

## Anti-goals
- Do not expose environment values, password hashes, or auth internals to clients.
- Do not silently accept malformed configuration.
- Do not weaken server-side authorization.

## Constraints
- Existing NextAuth v4 setup remains.
- Existing `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and `NEXTAUTH_SECRET` variables remain configuration source.
- Existing route `/auth/login` remains sign-in page.
- Existing `proxy.ts` remains request protection layer.

## Approaches
1. Keep Credentials + env, harden validation and role checks — selected. Lowest risk and smallest diff for one admin.
2. Move admin users into Prisma — rejected for now; adds schema, seed, migration, and management concerns.
3. Replace NextAuth with custom sessions — rejected; increases security and maintenance surface without current need.

## Design
`authorize()` validates credentials, normalizes email, validates configured email and bcrypt hash, compares password, and returns an admin user with role. JWT callback persists role. Session callback exposes role through typed session data. `requireAdmin()` returns true only for an authenticated session with admin role. Login UI handles failed responses consistently and redirects only after successful authentication.

Configuration validation must fail safely server-side. Client errors remain generic. A small runnable self-check or focused test should cover valid and malformed bcrypt configuration if project test tooling supports it.

## Builder decisions
- Use existing `bcryptjs` dependency.
- Keep JWT strategy because current setup already uses it.
- Treat email comparison case-insensitively after trimming both configured and submitted values.
- Use generic authentication failure messages for clients.
