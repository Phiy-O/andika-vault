# Admin Messages Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the admin messages page to use the same refined workspace components (WorkspaceHeader, WorkspaceToolbar, WorkspaceView, WorkspacePagination, WorkspaceEmptyState) as the projects, certificates, and skills admin pages. No WorkspaceUtilityDock (user requested no "3 boxes under the list").

**Architecture:** Create a new MessageWorkspace component following the pattern from SkillWorkspace. Reuse shared workspace components from `components/admin/workspace/` and create message-specific components (table, cards, badges, actions menu).

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
2. **Filter state persistence** - Search, status filters should work correctly with pagination
3. **Bulk actions** - Selection and bulk operations should work correctly
4. **Responsive behavior** - Table on desktop, cards on mobile, grid option available
5. **Error handling** - Load errors, action errors, and delete confirmations should display properly
6. **No WorkspaceUtilityDock** - User explicitly requested no pipeline stats section

---

### Task 1: Create Message Utility Functions

**Files:**
- Create: `app/admin/messages/_components/message-utils.ts`

**Interfaces:**
- Consumes: `Message` from `@prisma/client`, `WorkspaceSortOption`, `WorkspaceStatusTab` from `@/components/admin/workspace/types`
- Produces: `filterAndSortMessages`, `formatCount`, `sortOptions`, `shortcuts`, `getMessageStatusTabs`

- [ ] **Step 1: Write the failing test**

```typescript
import { filterAndSortMessages } from "@/app/admin/messages/_components/message-utils";
import type { Message } from "@prisma/client";

const mockMessages: Message[] = [
  { id: "1", name: "John", email: "john@test.com", message: "Hello", isRead: false, createdAt: new Date() },
  { id: "2", name: "Jane", email: "jane@test.com", message: "Hi", isRead: true, createdAt: new Date() },
];

const result = filterAndSortMessages({ messages: mockMessages, search: "john", status: "all", sort: "name" });
assert(result.length === 1);
assert(result[0].name === "John");
```

- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `message-utils.ts`** with:
  - `filterAndSortMessages` function (filter by search, status; sort by name, email, createdAt)
  - `formatCount` function
  - `sortOptions` array for WorkspaceToolbar
  - `shortcuts` array for keyboard shortcuts
  - `getMessageStatusTabs` for status tabs with counts
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

---

### Task 2: Create Message Badges Components

**Files:**
- Create: `app/admin/messages/_components/MessageBadges.tsx`

**Interfaces:**
- Consumes: `Message` from `@prisma/client`
- Produces: `MessageStatusBadge`

- [ ] **Step 1: Write the failing test**

```typescript
import { MessageStatusBadge } from "@/app/admin/messages/_components/MessageBadges";
import { render } from "@testing-library/react";

const message = { id: "1", name: "John", email: "j@test.com", message: "Hi", isRead: true, createdAt: new Date() };

const { container } = render(<MessageStatusBadge message={message} />);
assert(container.textContent?.includes("Read"));
```

- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `MessageBadges.tsx`** with:
  - `MessageStatusBadge` - displays read/unread status with Mail/MailOpen icons
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

---

### Task 3: Create Message Actions Menu

**Files:**
- Create: `app/admin/messages/_components/MessageActionsMenu.tsx`

**Interfaces:**
- Consumes: `Message`, `MessageActionHandlers` (busyIds, selectedIds, onToggleSelected, onToggleRead, onDelete)
- Produces: `MessageActionsMenu` component

- [ ] **Step 1: Write the failing test**

```typescript
import { MessageActionsMenu } from "@/app/admin/messages/_components/MessageActionsMenu";
import { render, screen } from "@testing-library/react";

const mockActions = { busyIds: new Set(), selectedIds: new Set(), onToggleSelected: vi.fn(), onToggleRead: vi.fn(), onDelete: vi.fn() };
const message = { id: "1", name: "John", email: "j@test.com", message: "Hi", isRead: false, createdAt: new Date() };

render(<MessageActionsMenu message={message} actions={mockActions} />);
const menuButton = screen.getByRole("button", { name: /actions/i });
await userEvent.click(menuButton);
assert(screen.getByRole("menuitem", { name: /mark as read/i }));
assert(screen.getByRole("menuitem", { name: /delete/i }));
```

- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `MessageActionsMenu.tsx`** with dropdown menu for:
  - Mark as read / Mark as unread (toggle)
  - Delete (confirmation)
  - Follows pattern from `SkillActionsMenu`
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

---

### Task 4: Create Message Table Component

**Files:**
- Create: `app/admin/messages/_components/MessagesTable.tsx`

**Interfaces:**
- Consumes: `Message[]`, `MessageActionHandlers`, `allSelected`, `someSelected`, `onSelectAll`, `selectDisabled`
- Produces: `MessagesTable` component

- [ ] **Step 1: Write the failing test**

```typescript
import { MessagesTable } from "@/app/admin/messages/_components/MessagesTable";
import { render, screen } from "@testing-library/react";

const messages = [{ id: "1", name: "John", email: "j@test.com", message: "Hi", isRead: false, createdAt: new Date() }];
const actions = { busyIds: new Set(), selectedIds: new Set(), onToggleSelected: vi.fn(), onToggleRead: vi.fn(), onDelete: vi.fn() };

render(<MessagesTable messages={messages} actions={actions} allSelected={false} someSelected={false} onSelectAll={vi.fn()} selectDisabled={false} />);
assert(screen.getByRole("columnheader", { name: /from/i }));
assert(screen.getByRole("columnheader", { name: /message/i }));
assert(screen.getByRole("columnheader", { name: /received/i }));
assert(screen.getByRole("columnheader", { name: /status/i }));
assert(screen.getByRole("columnheader", { name: /actions/i }));
```

- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `MessagesTable.tsx`** with columns:
  - Checkbox for selection
  - From (name + email)
  - Message (truncated)
  - Received (date)
  - Status (badge)
  - Actions (menu)
  - Follows pattern from `SkillsTable`
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

---

### Task 5: Create Message Cards Components

**Files:**
- Create: `app/admin/messages/_components/MessagesCards.tsx`

**Interfaces:**
- Consumes: `Message[]`, `MessageActionHandlers`, `selectDisabled`
- Produces: `MessagesListCards` (mobile list), `MessagesGrid` (grid view)

- [ ] **Step 1: Write the failing test**

```typescript
import { MessagesListCards, MessagesGrid } from "@/app/admin/messages/_components/MessagesCards";
import { render, screen } from "@testing-library/react";

const messages = [{ id: "1", name: "John", email: "j@test.com", message: "Hi", isRead: false, createdAt: new Date() }];
const actions = { busyIds: new Set(), selectedIds: new Set(), onToggleSelected: vi.fn(), onToggleRead: vi.fn(), onDelete: vi.fn() };

render(<MessagesListCards messages={messages} actions={actions} selectDisabled={false} />);
assert(screen.getByText("John"));
assert(screen.getByText("Hi"));

render(<MessagesGrid messages={messages} actions={actions} selectDisabled={false} />);
assert(screen.getByText("John"));
```

- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `MessagesCards.tsx`** with:
  - `MessagesListCards` - mobile card layout (similar to `SkillsListCards`)
  - `MessagesGrid` - grid layout (similar to `SkillsGrid`)
  - Each card shows name, email, message preview, status badge, actions menu
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

---

### Task 6: Create MessageWorkspace Component

**Files:**
- Create: `app/admin/messages/_components/MessageWorkspace.tsx`
- Modify: `app/admin/messages/page.tsx`

**Interfaces:**
- Consumes: `Message[]`, `initialSearch`, `loadError`
- Produces: `MessageWorkspace` component using shared workspace components (NO WorkspaceUtilityDock)

- [ ] **Step 1: Write the failing test**

```typescript
import { MessageWorkspace } from "@/app/admin/messages/_components/MessageWorkspace";
import { render, screen } from "@testing-library/react";

const messages = [
  { id: "1", name: "John", email: "j@test.com", message: "Hi", isRead: false, createdAt: new Date() },
  { id: "2", name: "Jane", email: "jane@test.com", message: "Hello", isRead: true, createdAt: new Date() },
];

render(<MessageWorkspace messages={messages} initialSearch="" loadError={undefined} />);
assert(screen.getByText("Messages"));
assert(screen.getByRole("heading", { level: 1, name: /messages/i }));
assert(screen.getByLabelText(/workspace status/i));
assert(screen.getByPlaceholderText(/search messages/i));
```

- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `MessageWorkspace.tsx`** with:
  - Uses `useAdminCollection` hook for state management (filtering, sorting, pagination, selection, bulk actions)
  - Uses `WorkspaceHeader` for header with sync status, title, description, public/new links (no public link for messages)
  - Uses `WorkspaceToolbar` for filters (status tabs, search, sort, view toggle)
  - Uses `WorkspaceBulkBar` for bulk actions (Mark as read, Delete)
  - Uses `WorkspaceView` for rendering table/cards/grid with pagination
  - Uses `WorkspaceEmptyState` for empty states
  - Uses `WorkspacePagination` for pagination
  - Uses `DeleteRecordsDialog` for delete confirmation
  - **NO WorkspaceUtilityDock** (user requested no pipeline stats)
  - Follows pattern from `SkillWorkspace` but adapted for messages
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Update `app/admin/messages/page.tsx` to use `MessageWorkspace`**
- [ ] **Step 6: Remove old `MessageListClient.tsx`**
- [ ] **Step 7: Commit**

---

### Task 7: Verify and Test

**Files:**
- Modify: `app/admin/messages/page.tsx`, `app/admin/messages/_components/*.tsx`

**Verification:**
- [ ] Run `pnpm exec tsc --noEmit` - TypeScript compilation passes
- [ ] Run `pnpm run lint` - Linting passes
- [ ] Run `pnpm run build` - Build passes
- [ ] Manual testing:
  - [ ] Page loads correctly with messages data
  - [ ] Search filter works
  - [ ] Status filter (All/Unread/Read) works
  - [ ] Sort options work
  - [ ] View toggle (List/Grid) works
  - [ ] Pagination works
  - [ ] Selection checkboxes work
  - [ ] Bulk actions (Mark as read, Delete) work
  - [ ] Individual actions (Mark as read, Delete) work
  - [ ] Empty state displays correctly
  - [ ] Responsive: table on desktop, cards on mobile
  - [ ] Keyboard shortcuts work (Cmd+K, V, Cmd+A)
  - [ ] Design matches other admin pages (Projects, Certificates, Skills)
  - [ ] **No WorkspaceUtilityDock/pipeline stats section**

---

## Execution Approach

This plan has 7 tasks that build on each other sequentially. Tasks 1-5 create utility components that Task 6 consumes. Task 7 verifies the complete implementation.

**Recommendation:** Use **subagent-driven-development** because:
- Each task produces a testable component that can be independently verified
- Tasks have clear interfaces between them
- A mistake in an early utility function would cascade to later tasks
- Fresh reviewer context per task catches interface mismatches early