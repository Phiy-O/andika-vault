# Focus Writing Surface and Tab Indentation — Design

Date: 2026-11-20
Status: Approved and implemented

## Intent

Make the Focus editor feel like a dedicated writing surface: a white paper area that stands apart from the cream admin background, and `Tab` that inserts indentation at the caret instead of moving browser focus.

## Goals

- Apply a pure white (`#fff`) writing surface only to the Focus editor.
- Make `Tab` insert a tab character in the Focus body editor, in both Visual (LexKit) and HTML source modes.
- Keep `Esc` as the way to leave Focus, and keep `Shift+Tab` available for backward keyboard navigation.
- Preserve existing table cell `Tab` navigation, the LexKit image/link prompt, and all main-form behavior.

## Non-goals

- No changes to the main admin form's body editor appearance or keyboard behavior.
- No changes to public article rendering or sanitization.
- No new dependencies or schema changes.

## Approaches Considered

1. **Focus-only variant (picked).** Add a `variant="focus"` prop through `FocusEditor` → `BodyEditor` → `LexKitEditor`. It changes only the Focus editor's surface color and Tab handling. Other editors stay untouched, so the admin form and accessibility navigation outside Focus are unaffected.
2. **Global editor change.** Make every body editor white and capture Tab everywhere. More visually consistent, but it changes the whole dashboard and traps Tab across the admin form, which harms accessibility.
3. **Use a modifier for indentation.** Keeps normal Tab navigation, but does not give the writing-mode keyboard behavior requested.

Option 1 was picked because it matches the chosen scope and keeps the keyboard tradeoff contained to a mode the user explicitly enters.

## Design

### White writing surface

- `FocusEditor` passes `variant="focus"` to `BodyEditor`.
- In the focus variant, the LexKit wrapper and contenteditable area use `bg-white` instead of `bg-background`; the HTML source textarea also uses `bg-white`.
- The existing black borders, square corners, and restrained shadow remain unchanged, so the white surface still belongs to the neobrutalist design language.

### Tab indentation

- **Visual mode:** `LexKitEditor` registers `KEY_TAB_COMMAND` at `COMMAND_PRIORITY_LOW` only when `variant="focus"`. A plain `Tab` prevents the default, inserts `\t` at the current selection with `selection.insertText("\t")`, and marks the command handled. `Shift+Tab` returns `false`, leaving normal backward navigation intact. The table extension's higher-priority Tab handler still wins inside table cells.
- **HTML mode:** the focus-variant textarea handles `Tab` locally by inserting `\t` at the caret through the existing `onChange` callback, then restores the caret after React re-renders. `Shift+Tab` is left alone.
- `white-space: pre-wrap` and `tab-size: 2` are applied to the focus contenteditable so the tab is visibly rendered as indentation while typing.

### Keyboard escape

- `Esc` continues to close the Focus dialog through the native dialog behavior.
- `Shift+Tab` remains available for moving backward out of the editor.
- Ctrl/Cmd+S still saves; Preview and Exit remain available in the top bar.

## Files Expected to Change

- `components/admin/blog/FocusEditor.tsx` — pass the focus variant.
- `components/admin/blog/BodyEditor.tsx` — variant prop, focus textarea styling and Tab handling.
- `components/admin/LexKitEditor.tsx` — variant prop, white editor surface, Tab command registration.

## Verification

- `pnpm exec tsc --noEmit`
- Targeted `pnpm exec eslint` on the three changed files
- Browser smoke check: white computed background in Focus, Tab inserts a tab in Visual mode, Tab inserts a tab in HTML mode, table-cell Tab navigation still works, `Esc` exits Focus, and the main form editor is unchanged.

No test framework exists in the repository, so verification is type-checking, lint, and manual/browser checks.
