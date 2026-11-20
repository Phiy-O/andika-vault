# Focus Writing Surface Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Give the Focus blog editor a white writing surface and make `Tab` insert indentation in both Visual and HTML typing modes, while keeping `Esc` as the exit and leaving the main form unchanged.

**Architecture:** Add a `variant="focus"` prop through `FocusEditor` → `BodyEditor` → `LexKitEditor`. `LexKitEditor` uses a focus-specific extension set for the white surface and registers a low-priority `KEY_TAB_COMMAND` for Tab indentation. `BodyEditor` handles Tab locally in HTML mode. No route, dependency, or public rendering changes.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, LexKit/Lexical, native `<dialog>`.

**Spec:** `docs/superpowers/specs/2026-11-20-focus-writing-surface-design.md`

## Global Constraints

- Change only Focus mode; the main admin form editor must keep its current appearance and Tab behavior.
- Keep table-cell Tab navigation, the image/link prompt, and native dialog `Esc`.
- Preserve `Ctrl/Cmd + S` and all existing form state, auth, validation, and sanitization.
- No new dependencies, no globals.css theme changes, no public article rendering changes.
- Repository has no test runner; verification is `tsc`, targeted ESLint, and browser smoke checks.

## Review Focus

- Focus Visual editor has a computed white background; main form editor does not.
- `Tab` inserts `\t` at the caret in Visual mode and in HTML source mode.
- `Shift+Tab` is not swallowed and still navigates backward.
- `Tab` inside a table cell still navigates cells instead of inserting a tab character.
- `Esc` still exits Focus.

---

### Task 1: Add the focus variant to LexKitEditor

**Files:**
- Modify: `components/admin/LexKitEditor.tsx`

**Interfaces:**
- Produces: `LexKitEditorProps` gains `variant?: "default" | "focus"`.
- Consumes: nothing new beyond existing `lexical` imports.

- [x] **Step 1: Extract the extension list into a factory**

Replace the module-level `extensions` constant with a `buildExtensions(focus: boolean)` function that returns the same extension array, but sets the `contentEditable` class to:

```ts
focus
  ? "lexkit-editor-content prose max-w-none focus:outline-none px-4 py-4 min-h-[360px] text-sm text-foreground cursor-text bg-white whitespace-pre-wrap [tab-size:2]"
  : "lexkit-editor-content prose max-w-none focus:outline-none px-4 py-4 min-h-[360px] text-sm text-foreground bg-background cursor-text"
```

Keep `placeholder`, `styles.contentEditable.caretColor`, and all other extensions unchanged. Define:

```ts
const extensions = buildExtensions(false);
const focusExtensions = buildExtensions(true);
const { Provider, useEditor } = createEditorSystem<typeof extensions>();
```

- [x] **Step 2: Add the variant prop and select extensions**

Extend `Props` with `variant?: "default" | "focus"`. In `LexKitEditor`, pass `variant` into `EditorShell` and render `<Provider extensions={variant === "focus" ? focusExtensions : extensions}>`.

- [x] **Step 3: Register Tab indentation only in focus mode**

In `EditorShell`, destructure `variant`, import `KEY_TAB_COMMAND` and `COMMAND_PRIORITY_LOW` from `lexical`, and add:

```ts
useEffect(() => {
  if (variant !== "focus") return;

  return editor.registerCommand(
    KEY_TAB_COMMAND,
    (event: KeyboardEvent) => {
      if (event.shiftKey) return false;
      event.preventDefault();
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.insertText("\t");
        }
      });
      return true;
    },
    COMMAND_PRIORITY_LOW
  );
}, [editor, variant]);
```

Do not raise the priority: the table extension's higher-priority handler must still win inside table cells.

- [x] **Step 4: Verify TypeScript**

Run: `pnpm exec tsc --noEmit`
Expected: no output.

- [x] **Step 5: Commit**

```bash
git add components/admin/LexKitEditor.tsx
git commit -m "feat: add focus variant with Tab indentation to LexKit editor"
```

---

### Task 2: Thread the variant through BodyEditor and FocusEditor

**Files:**
- Modify: `components/admin/blog/BodyEditor.tsx`
- Modify: `components/admin/blog/FocusEditor.tsx`

**Interfaces:**
- Consumes: `LexKitEditor` variant from Task 1.
- Produces: `BodyEditorProps` gains `variant?: "default" | "focus"`; `FocusEditor` passes `variant="focus"`.

- [x] **Step 1: Add variant to BodyEditorProps and destructure it**

Add `variant?: "default" | "focus"` to `BodyEditorProps` and to the destructured props with a default of `"default"`.

- [x] **Step 2: Pass variant to LexKitEditor**

Change `<LexKitEditor key={editorKey} ... />` to also pass `variant={variant}`.

- [x] **Step 3: Style and handle Tab in the HTML textarea**

In the textarea branch, append the focus classes when `variant === "focus"`:

```ts
variant === "focus"
  ? "bg-white whitespace-pre-wrap [tab-size:2]"
  : "bg-background"
```

Add an `onKeyDown` handler:

```tsx
onKeyDown={(event) => {
  if (variant !== "focus" || event.key !== "Tab" || event.shiftKey) return;
  event.preventDefault();
  const textarea = event.currentTarget;
  const { selectionStart, selectionEnd } = textarea;
  const next =
    content.slice(0, selectionStart) + "\t" + content.slice(selectionEnd);
  onChange(next);
  requestAnimationFrame(() => {
    textarea.selectionStart = selectionStart + 1;
    textarea.selectionEnd = selectionStart + 1;
  });
}}
```

Keep all existing textarea attributes and classes otherwise unchanged.

- [x] **Step 4: Pass the variant from FocusEditor**

In `FocusEditor`, add `variant="focus"` to the `<BodyEditor ... />` call. Do not change the main form's `BodyEditor` usage in `BlogForm.tsx`.

- [x] **Step 5: Verify TypeScript and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no output.

Run: `pnpm exec eslint components/admin/LexKitEditor.tsx components/admin/blog/BodyEditor.tsx components/admin/blog/FocusEditor.tsx`
Expected: no output.

- [x] **Step 6: Commit**

```bash
git add components/admin/blog/BodyEditor.tsx components/admin/blog/FocusEditor.tsx
git commit -m "feat: use focus variant in the Focus body editor"
```

---

### Task 3: Verify the workflow end to end

**Files:**
- No code changes expected.

- [x] **Step 1: Run full type check**

Run: `pnpm exec tsc --noEmit`
Expected: no output.

- [x] **Step 2: Run targeted lint**

Run: `pnpm exec eslint components/admin/LexKitEditor.tsx components/admin/blog/BodyEditor.tsx components/admin/blog/FocusEditor.tsx`
Expected: no output.

- [x] **Step 3: Browser smoke check**

Using a temporary route that mounts the real `BlogForm`, verify:
- Focus Visual editor contenteditable has computed `background-color: rgb(255, 255, 255)`.
- The main form editor contenteditable does not have that white background.
- Pressing `Tab` in the Focus Visual editor inserts a `\t` at the caret.
- Switching to HTML mode, pressing `Tab` in the Focus textarea inserts a `\t` at the caret.
- `Tab` inside a table cell does not insert a tab character into the cell text.
- `Shift+Tab` is not swallowed by the editor.
- `Esc` closes Focus.

- [x] **Step 4: Report**

Summarize changed files, verification output, and any checks that could not be performed.

---

## Self-Review

**Spec coverage:** White surface, Visual and HTML Tab indentation, Esc/Shift+Tab escape, and preserved table navigation are covered by Tasks 1–3. The main form and public site are untouched.

**Step scan:** Each step names the exact file, prop, command, or class change. No TBDs.

**Type consistency:** `variant` is introduced in Task 1, consumed in Task 2, and passed in Task 2. `KEY_TAB_COMMAND` is imported in Task 1 where it is used.

**Review Focus:** All five failure modes are covered by the Task 3 browser smoke checks.
