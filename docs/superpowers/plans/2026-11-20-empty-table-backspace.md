# Empty Table Backspace Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Let Backspace delete a fully empty table from the paragraph below it while keeping non-empty tables protected.

**Spec:** `docs/superpowers/specs/2026-11-20-empty-table-backspace-design.md`

## Global Constraints

- Change only the existing Backspace guard in `LexKitEditor`.
- Do not add controls, routes, dependencies, or schema changes.
- Repository has no test runner; verification is `tsc`, targeted ESLint, and browser smoke.

---

### Task 1: Make the guard conditional on table emptiness

**Files:**
- Modify: `components/admin/LexKitEditor.tsx`

- [x] **Step 1: Add an emptiness check**

Inside the existing `KEY_BACKSPACE_COMMAND` handler, after confirming the previous sibling is a table and `$isElementNode(previous)`, check every row and cell with `getTextContent().trim()`. If any cell has content, keep the existing `event.preventDefault(); return true;`. If all cells are empty, `return false;` so Lexical's default deletion runs.

- [x] **Step 2: Verify TypeScript and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no output.

Run: `pnpm exec eslint components/admin/LexKitEditor.tsx`
Expected: no output.

- [x] **Step 3: Commit**

```bash
git add components/admin/LexKitEditor.tsx
git commit -m "fix: allow Backspace to delete empty tables"
```

---

### Task 2: Verify

- [x] **Step 1: Browser smoke**

With a temporary route mounting the real `BlogForm`, verify:
- Insert an empty table; Backspace from the empty paragraph below removes it.
- Type content into a cell; Backspace from the paragraph below leaves the table intact.
- Normal Backspace text deletion still works.

- [x] **Step 2: Report**

Summarize changes, verification, and limitations.
