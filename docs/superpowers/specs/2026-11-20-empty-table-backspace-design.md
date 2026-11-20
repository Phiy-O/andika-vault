# Empty Table Backspace Fix — Design

Date: 2026-11-20
Status: Approved and implemented

## Intent

Allow the user to delete a table that has no content using Backspace from the empty paragraph below it, while keeping the existing protection for tables that still contain content.

## Goals

- Backspace below an empty table removes the table.
- Backspace below a non-empty table still does nothing (existing protection).
- No change to Backspace anywhere else.

## Non-goals

- No new delete button or toolbar control.
- No change to table insertion, cell editing, or public rendering.

## Design

The current `KEY_BACKSPACE_COMMAND` guard in `components/admin/LexKitEditor.tsx` blocks the boundary unconditionally. Change it to inspect the previous sibling table:

- If the previous sibling is not a table, return `false`.
- If it is a table, walk its rows and cells and check `getTextContent().trim()`.
- If any cell has content, `preventDefault()` and return `true` (keep the table).
- If all cells are empty, return `false` and let Lexical's default Backspace behavior remove the table.

Only the "empty paragraph directly below a table at offset 0" case is affected.

## Files Expected to Change

- `components/admin/LexKitEditor.tsx`

## Verification

- `pnpm exec tsc --noEmit`
- Targeted `pnpm exec eslint`
- Browser smoke: empty table is removed by Backspace below it; a table with cell content remains.

No test framework exists, so verification is type-checking, lint, and manual/browser checks.
