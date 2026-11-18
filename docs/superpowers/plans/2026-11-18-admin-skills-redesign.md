# Admin Skills Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the admin skills page to use the same refined workspace components (WorkspaceHeader, WorkspaceToolbar, WorkspaceView, WorkspacePagination, WorkspaceEmptyState, WorkspaceUtilityDock) as the projects and certificates admin pages.

**Architecture:** Create a new SkillWorkspace component that follows the pattern established in ProjectsWorkspace and AchievementsWorkspace. Reuse shared workspace components from `components/admin/workspace/` and create skill-specific components (table, cards, grid, badges, actions menu) following the existing patterns.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Prisma 7

**Spec:** AGENTS.md (sections 3, 5, 7, 8), existing admin workspace components in `components/admin/workspace/`

## Global Constraints

- Use `pnpm` exclusively for package management
- Follow existing layered architecture: UI Components → Server Actions/API Routes → Services → Repositories → Prisma → PostgreSQL
- Use established server action response format: `{ data?: T; error?: string }`
- Follow Structured Playful Neobrutalism design direction
- Use semantic color tokens, not raw hex values
- Maintain accessibility (WCAG 2.1 AA)
- Reuse shared components instead of duplicating
- All admin mutations must call `await requireAdmin()` before executing
- Use Zod for validation
- Do not introduce new dependencies without approval

## Review Focus

1. **Keyboard navigation** - All interactive elements (filters, pagination, actions) must be keyboard accessible
2. **Filter state persistence** - Search, status, category filters should work correctly with pagination
3. **Bulk actions** - Selection and bulk operations should work correctly
4. **Responsive behavior** - Table on desktop, cards on mobile, grid option available
5. **Error handling** - Load errors, action errors, and delete confirmations should display properly

---

### Task 1: Create Skill Utility Functions

**Files:**
- Create: `app/admin/skills/_components/skill-utils.ts`
- Modify: `app/admin/skills/page.tsx`

**Interfaces:**
- Consumes: `SkillListItem` from `@/src/types`, `WorkspaceSortOption`, `WorkspaceStatusTab` from `@/components/admin/workspace/types`
- Produces: `filterAndSortSkills`, `formatCategory`, `formatCount`, `sortOptions`, `shortcutKeys`

- [ ] **Step 1: Write the failing test**

```typescript
// Test filtering and sorting logic
import { filterAndSortSkills, skillCategories } from "@/app/admin/skills/_components/skill-utils";
import type { SkillListItem } from "@/src/types";

const mockSkills: SkillListItem[] = [
  { id: "1", name: "React", iconSrc: "/icons/skills/react.svg", category: "frontend", sortOrder: 1, isVisible: true },
  { id: "2", name: "Node.js", iconSrc: "/icons/skills/nodejs.svg", category: "backend", sortOrder: 2, isVisible: false },
  { id: "3", name: "TypeScript", iconSrc: "/icons/skills/typescript.svg", category: "frontend", sortOrder: 3, isVisible: true },
];

const result = filterAndSortSkills({ skills: mockSkills, search: "react", status: "all", category: "all", sort: "name" });
assert(result.length === 1);
assert(result[0].name === "React");
```

- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `skill-utils.ts`** with:
  - `filterAndSortSkills` function (filter by search, status, category; sort by name, category, sortOrder, updated)
  - `formatCategory` function (capitalize category labels)
  - `formatCount` function (format numbers with K/M suffixes)
  - `sortOptions` array for WorkspaceToolbar
  - `shortcuts` array for WorkspaceUtilityDock
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

---

### Task 2: Create Skill Badges Components

**Files:**
- Create: `app/admin/skills/_components/SkillBadges.tsx`

**Interfaces:**
- Consumes: `SkillListItem` from `@/src/types`
- Produces: `SkillCategoryBadge`, `SkillStatusBadge`

- [ ] **Step 1: Write the failing test**

```typescript
import { SkillCategoryBadge, SkillStatusBadge } from "@/app/admin/skills/_components/SkillBadges";
import { render } from "@testing-library/react";

const skill = { id: "1", name: "React", iconSrc: "", category: "frontend", sortOrder: 1, isVisible: true };

const { container } = render(<SkillCategoryBadge category={skill.category} />);
assert(container.textContent?.includes("Frontend"));

const { container: c2 } = render(<SkillStatusBadge skill={skill} />);
assert(c2.textContent?.includes("Visible"));
```

- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `SkillBadges.tsx`** with:
  - `SkillCategoryBadge` - displays category with consistent styling (similar to ProjectCategoryBadge)
  - `SkillStatusBadge` - displays visibility status with Eye/EyeOff icons (similar to ProjectStatusBadge)
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

---

### Task 3: Create Skill Actions Menu

**Files:**
- Create: `app/admin/skills/_components/SkillActionsMenu.tsx`

**Interfaces:**
- Consumes: `SkillListItem`, `SkillActionHandlers` (busyIds, selectedIds, onToggleSelected, onToggleVisibility, onDelete)
- Produces: `SkillActionsMenu` component

- [ ] **Step 1: Write the failing test**

```typescript
import { SkillActionsMenu } from "@/app/admin/skills/_components/SkillActionsMenu";
import { render, screen } from "@testing-library/react";

const mockActions = { busyIds: new Set(), selectedIds: new Set(), onToggleSelected: vi.fn(), onToggleVisibility: vi.fn(), onDelete: vi.fn() };
const skill = { id: "1", name: "React", iconSrc: "", category: "frontend", sortOrder: 1, isVisible: true };

render(<SkillActionsMenu skill={skill} actions={mockActions} />);
const menuButton = screen.getByRole("button", { name: /actions/i });
await userEvent.click(menuButton);
assert(screen.getByRole("menuitem", { name: /edit/i }));
assert(screen.getByRole("menuitem", { name: /toggle visibility/i }));
assert(screen.getByRole("menuitem", { name: /delete/i }));
```

- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `SkillActionsMenu.tsx`** with dropdown menu for:
  - Edit (link to edit page)
  - Toggle visibility (published/draft)
  - Delete (confirmation)
  - Follows pattern from `ProjectActionsMenu` and `AchievementActionsMenu`
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

---

### Task 4: Create Skill Table Component

**Files:**
- Create: `app/admin/skills/_components/SkillsTable.tsx`

**Interfaces:**
- Consumes: `SkillListItem[]`, `SkillActionHandlers`, `allSelected`, `someSelected`, `onSelectAll`, `selectDisabled`
- Produces: `SkillsTable` component

- [ ] **Step 1: Write the failing test**

```typescript
import { SkillsTable } from "@/app/admin/skills/_components/SkillsTable";
import { render, screen } from "@testing-library/react";

const skills = [{ id: "1", name: "React", iconSrc: "/icons/skills/react.svg", category: "frontend", sortOrder: 1, isVisible: true }];
const actions = { busyIds: new Set(), selectedIds: new Set(), onToggleSelected: vi.fn(), onToggleVisibility: vi.fn(), onDelete: vi.fn() };

render(<SkillsTable skills={skills} actions={actions} allSelected={false} someSelected={false} onSelectAll={vi.fn()} selectDisabled={false} />);
assert(screen.getByRole("columnheader", { name: /skill/i }));
assert(screen.getByRole("columnheader", { name: /category/i }));
assert(screen.getByRole("columnheader", { name: /order/i }));
assert(screen.getByRole("columnheader", { name: /status/i }));
assert(screen.getByRole("columnheader", { name: /actions/i }));
```

- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `SkillsTable.tsx`** with columns:
  - Checkbox for selection
  - Skill (icon + name)
  - Category (badge)
  - Sort Order
  - Status (badge)
  - Actions (menu)
  - Follows pattern from `ProjectsTable`
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

---

### Task 5: Create Skill Cards and Grid Components

**Files:**
- Create: `app/admin/skills/_components/SkillsCards.tsx`

**Interfaces:**
- Consumes: `SkillListItem[]`, `SkillActionHandlers`, `selectDisabled`
- Produces: `SkillsListCards` (mobile list), `SkillsGrid` (grid view)

- [ ] **Step 1: Write the failing test**

```typescript
import { SkillsListCards, SkillsGrid } from "@/app/admin/skills/_components/SkillsCards";
import { render, screen } from "@testing-library/react";

const skills = [{ id: "1", name: "React", iconSrc: "/icons/skills/react.svg", category: "frontend", sortOrder: 1, isVisible: true }];
const actions = { busyIds: new Set(), selectedIds: new Set(), onToggleSelected: vi.fn(), onToggleVisibility: vi.fn(), onDelete: vi.fn() };

render(<SkillsListCards skills={skills} actions={actions} selectDisabled={false} />);
assert(screen.getByText("React"));
assert(screen.getByText("Frontend"));

render(<SkillsGrid skills={skills} actions={actions} selectDisabled={false} />);
assert(screen.getByText("React"));
```

- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `SkillsCards.tsx`** with:
  - `SkillsListCards` - mobile card layout (similar to `ProjectsListCards`/`AchievementsListCards`)
  - `SkillsGrid` - grid layout (similar to `ProjectsGrid`/`AchievementsGrid`)
  - Each card shows icon, name, category badge, status badge, actions menu
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

---

### Task 6: Create SkillWorkspace Component

**Files:**
- Create: `app/admin/skills/_components/SkillWorkspace.tsx`
- Modify: `app/admin/skills/page.tsx`

**Interfaces:**
- Consumes: `SkillListItem[]`, `initialSearch`, `loadError`
- Produces: `SkillWorkspace` component using all shared workspace components

- [ ] **Step 1: Write the failing test**

```typescript
import { SkillWorkspace } from "@/app/admin/skills/_components/SkillWorkspace";
import { render, screen } from "@testing-library/react";

const skills = [
  { id: "1", name: "React", iconSrc: "/icons/skills/react.svg", category: "frontend", sortOrder: 1, isVisible: true },
  { id: "2", name: "Node.js", iconSrc: "/icons/skills/nodejs.svg", category: "backend", sortOrder: 2, isVisible: false },
];

render(<SkillWorkspace skills={skills} initialSearch="" loadError={undefined} />);
assert(screen.getByText("Skills"));
assert(screen.getByRole("heading", { level: 1, name: /skills/i }));
assert(screen.getByLabelText(/workspace status/i));
assert(screen.getByPlaceholderText(/search skills/i));
```

- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `SkillWorkspace.tsx`** with:
  - Uses `useAdminCollection` hook for state management (filtering, sorting, pagination, selection, bulk actions)
  - Uses `WorkspaceHeader` for header with sync status, title, description, public/new links
  - Uses `WorkspaceToolbar` for filters (status tabs, search, category filter, sort, view toggle)
  - Uses `WorkspaceBulkBar` for bulk actions (publish, draft, delete)
  - Uses `WorkspaceView` for rendering table/cards/grid with pagination
  - Uses `WorkspaceEmptyState` for empty states
  - Uses `WorkspacePagination` for pagination
  - Uses `WorkspaceUtilityDock` for pipeline info and shortcuts
  - Uses `DeleteRecordsDialog` for delete confirmation
  - Follows pattern from `ProjectsWorkspace` and `AchievementsWorkspace`
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Update `app/admin/skills/page.tsx` to use `SkillWorkspace`**
- [ ] **Step 6: Commit**

---

### Task 7: Verify and Test

**Files:**
- Modify: `app/admin/skills/page.tsx`, `app/admin/skills/_components/*.tsx`

**Verification:**
- [ ] Run `pnpm exec tsc --noEmit` - TypeScript compilation passes
- [ ] Run `pnpm run lint` - Linting passes
- [ ] Run `pnpm run build` - Build passes
- [ ] Manual testing:
  - [ ] Page loads correctly with skills data
  - [ ] Search filter works
  - [ ] Status filter (All/Published/Draft) works
  - [ ] Category filter works
  - [ ] Sort options work
  - [ ] View toggle (List/Grid) works
  - [ ] Pagination works
  - [ ] Selection checkboxes work
  - [ ] Bulk actions (Publish, Draft, Delete) work
  - [ ] Individual actions (Edit, Toggle Visibility, Delete) work
  - [ ] Empty state displays correctly
  - [ ] Responsive: table on desktop, cards on mobile
  - [ ] Keyboard shortcuts work (Cmd+K, N, V, Cmd+A)
  - [ ] Design matches other admin pages (Projects, Certificates)

---

## Execution Approach

This plan has 7 tasks that build on each other sequentially. Tasks 1-5 create utility components that Task 6 consumes. Task 7 verifies the complete implementation.

**Recommendation:** Use **subagent-driven-development** because:
- Each task produces a testable component that can be independently verified
- Tasks have clear interfaces between them
- A mistake in an early utility function would cascade to later tasks
- Fresh reviewer context per task catches interface mismatches early