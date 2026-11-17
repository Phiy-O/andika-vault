# Homepage Reference Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild public homepage composition to match supplied structured playful neobrutalism reference while preserving existing data and routes.

**Architecture:** Keep `app/page.tsx` as server data loader. Add homepage-only presentation components for reference sections. Reuse existing services, project/blog/certificate types, shared design tokens, and route links.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, lucide-react, Prisma-generated types.

**Spec:** `docs/superpowers/specs/2026-11-17-homepage-reference-rebuild-design.md`

## Global Constraints

- Homepage UI scope only; no DB, API, auth, or content-model changes.
- No new dependencies.
- Preserve existing real content, server data loading, links, and public routes.
- Keep responsive layouts usable at 320px, 768px, 1024px, and 1440px.
- Preserve keyboard focus, semantic headings, meaningful image alt text, and accessible navigation.

## Review Focus

- Empty visible content: sections render useful structure without broken grids or invalid headings.
- Long project/blog/certificate text: rows and cards wrap without horizontal overflow.
- Missing project thumbnails or settings: existing fallbacks remain functional.
- Mobile navigation and CTA controls: remain keyboard and touch accessible.
- Reference-only visual elements: do not fabricate factual portfolio content.

---

### Task 1: Add homepage reference presentation components

**Files:**
- Create: `components/home/HomeHero.tsx`
- Create: `components/home/HomeApproach.tsx`
- Create: `components/home/HomeCapabilities.tsx`
- Create: `components/home/HomeWriting.tsx`
- Create: `components/home/HomeMilestones.tsx`
- Create: `components/home/index.ts`

**Interfaces:**
- `HomeHero` consumes `resumeUrl?: string | null` and existing local visual asset.
- `HomeCapabilities` consumes `skills: Skill[]`.
- `HomeWriting` consumes `posts: BlogPost[]`.
- `HomeMilestones` consumes `certificates: Certificate[]`.
- Components produce semantic, responsive homepage sections with stable IDs: `top`, `approach`, `capabilities`, `writing`, `milestones`.

- [ ] **Step 1: Implement `HomeHero`**
  - Build reference-style two-column hero: editorial headline, supporting copy, two bordered actions, small metadata line, framed image area.
  - Keep `href="#projects"`, `/about`, and resume download behavior valid.
  - Use existing profile/project image; no new asset.

- [ ] **Step 2: Implement `HomeApproach`**
  - Build bordered full-width statement strip matching reference proportions.
  - Preserve existing approach copy.

- [ ] **Step 3: Implement `HomeCapabilities`**
  - Filter visible skills and group stable ordered skills into three display buckets: Frontend Engineering, Backend & Systems, Experiments & Exploration.
  - Render three bordered cards with skill names; no DB mutation.
  - Handle zero skills with three structurally valid cards and concise empty text.

- [ ] **Step 4: Implement `HomeWriting` and `HomeMilestones`**
  - Render visible sorted posts/certificates as compact bordered rows.
  - Keep links to existing blog and achievement routes.
  - Handle empty arrays with meaningful empty-state row.

- [ ] **Step 5: Export components from `components/home/index.ts`**

- [ ] **Step 6: Run `pnpm exec tsc --noEmit`**
  - Expected: PASS, or only pre-existing errors documented before proceeding.

### Task 2: Recompose homepage around reference hierarchy

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/projects/HomeProjectsSection.tsx`

**Interfaces:**
- `app/page.tsx` keeps existing service calls and passes typed data into sections.
- `HomeProjectsSection` keeps `projects: Project[]` input and existing project links.

- [ ] **Step 1: Replace current homepage section order**
  - Keep `Navbar` and `Footer`.
  - Render `HomeHero`, `HomeApproach`, projects, `HomeCapabilities`, `HomeWriting`, and `HomeMilestones` in reference order.
  - Remove homepage-only About markup and unused homepage imports.
  - Preserve `revalidate = 3600` and all existing service calls.

- [ ] **Step 2: Rework `HomeProjectsSection`**
  - Keep one featured project followed by two supporting projects.
  - Use reference-style metadata bars, bordered image frames, compact case-study actions, and responsive single-column fallback.
  - Preserve current thumbnail fallback and Cloudinary optimization.
  - Render useful empty state when no visible projects exist.

- [ ] **Step 3: Run `pnpm exec tsc --noEmit`**
  - Expected: PASS.

### Task 3: Align shared public shell styling

**Files:**
- Modify: `components/layout/Navbar.tsx`
- Modify: `components/layout/Footer.tsx`
- Modify: `app/globals.css` only if existing tokens or global rules block reference alignment.

**Interfaces:**
- Preserve current navigation routes, mobile menu behavior, social links, settings lookup, and accessibility labels.

- [ ] **Step 1: Refine navbar geometry**
  - Match reference compact height, logo/action balance, borders, coral action, and desktop nav density.
  - Keep mobile menu functional and focus-visible styles.

- [ ] **Step 2: Refine footer geometry**
  - Match reference coral CTA block and compact footer metadata without removing existing valid links.
  - Preserve responsive link layout and social settings.

- [ ] **Step 3: Remove obsolete homepage-only visual rules**
  - Delete only styles/classes no longer used by homepage composition.
  - Do not alter unrelated page styling.

- [ ] **Step 4: Run `pnpm run lint`**
  - Expected: PASS without newly introduced warnings.

### Task 4: Verify homepage build and responsive safety

**Files:**
- Modify only if verification reveals defects.

- [ ] **Step 1: Run `pnpm exec tsc --noEmit`**
- [ ] **Step 2: Run `pnpm run lint`**
- [ ] **Step 3: Run `pnpm run build`**
- [ ] **Step 4: Review rendered homepage at 320px, 768px, 1024px, and 1440px**
  - Confirm no horizontal overflow, clipped controls, broken image frames, or inaccessible interactive elements.
- [ ] **Step 5: Fix only verified defects and rerun affected checks**

## Completion Criteria

- Homepage hierarchy and visual treatment match supplied reference.
- Existing content, routes, data loading, and responsive behavior remain functional.
- TypeScript, lint, and build checks pass.
