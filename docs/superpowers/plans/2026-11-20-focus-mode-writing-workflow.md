# Focus Mode Writing Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the blog editor's Focus modal into a Blogger-style writing workflow with an editable title, top-bar Preview/Save/Exit, and preview stacking over the live draft.

**Architecture:** Keep the existing `FullscreenDialog` modal and `BlogForm` state. `FocusEditor` gains title/preview/visibility props and a writing-focused top bar; `PreviewArticle` already renders after `FocusEditor`, so it stacks above Focus once dialog scroll locking is shared. No route, draft persistence, or settings rail is added.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, LexKit/Lexical, native `<dialog>`.

**Spec:** `docs/superpowers/specs/2026-11-20-focus-mode-writing-workflow-design.md`

## Global Constraints

- Keep the existing neobrutalist admin design language and `admin-shell` tokens.
- Preserve `BlogForm` as the single source of truth for unsaved title/body/settings.
- Preserve server-side auth, validation, and sanitization; this change is client-side only.
- Do not add dependencies, routes, or database changes.
- Keep `Esc` = exit and `Ctrl/Cmd + S` = save.
- No test framework exists; verification is `tsc`, targeted ESLint, and browser smoke checks.

## Review Focus

- Focus opened with an empty title: Save stays disabled and the title input receives focus.
- Preview opened over Focus: closing Preview returns to Focus with the editor still mounted and background scrolling still locked.
- `Esc` while Preview is open closes Preview only; a second `Esc` exits Focus.
- `Ctrl/Cmd + S` while Preview is open does nothing; while Focus is open it submits the form.
- Narrow screens: the Focus top bar wraps without horizontal overflow, and the title/body remain usable.

---

### Task 1: Share the dialog body-scroll lock

**Files:**
- Modify: `components/admin/editor/FullscreenDialog.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: unchanged `FullscreenDialog` props. Internal `lockBodyScroll()` / `unlockBodyScroll()` helpers are module-scoped and not exported.

- [ ] **Step 1: Add the module-level lock counter and helpers**

Add above the component:

```ts
let bodyScrollLocks = 0;

function lockBodyScroll() {
  bodyScrollLocks += 1;
  document.body.style.overflow = "hidden";
}

function unlockBodyScroll() {
  bodyScrollLocks = Math.max(0, bodyScrollLocks - 1);
  if (bodyScrollLocks === 0) {
    document.body.style.overflow = "";
  }
}
```

- [ ] **Step 2: Split the dialog effect from the scroll-lock effect**

Keep one effect for `showModal()`/`close()` and add a separate effect:

```ts
useEffect(() => {
  if (!open) return;
  lockBodyScroll();
  return unlockBodyScroll;
}, [open]);
```

Remove the `document.body.style.overflow` lines and the overflow cleanup from the existing dialog effect.

- [ ] **Step 3: Verify TypeScript**

Run: `pnpm exec tsc --noEmit`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add components/admin/editor/FullscreenDialog.tsx
git commit -m "fix: share body scroll lock across stacked dialogs"
```

---

### Task 2: Add the Focus writing workflow

**Files:**
- Modify: `components/admin/blog/FocusEditor.tsx`
- Modify: `components/admin/BlogForm.tsx`

**Interfaces:**
- Consumes: `FullscreenDialog` from Task 1; existing `BodyEditor`, `editorButtonPrimaryClass`, `editorButtonSecondaryClass`.
- Produces: `FocusEditorProps` adds:
  - `onTitleChange: (value: string) => void`
  - `isVisible: boolean`
  - `onPreview: () => void`
- `BlogForm` passes `onTitleChange={handleTitleChange}`, `isVisible={isVisible}`, and `onPreview={() => setPreviewOpen(true)}`.

- [ ] **Step 1: Extend `FocusEditorProps` and imports**

Add `useEffect`, `useRef`, and icons `ArrowLeft`, `Eye`, `Loader2`; remove the now-unused `X` import. Add the three props listed above and destructure them.

- [ ] **Step 2: Focus the title when the dialog opens**

Add a title ref and effect:

```ts
const titleRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  if (!open) return;
  titleRef.current?.focus();
}, [open]);
```

- [ ] **Step 3: Replace the header with the writing top bar**

Left side:
- `Exit` button (`type="button"`, `ArrowLeft`, `onClose`, disabled while saving).
- `Focus // Write` eyebrow plus `bodyFormat.toUpperCase()`.
- Read-only `Published`/`Draft` chip from `isVisible`.

Right side:
- Word count and read-time chips (existing markup).
- `Preview` button (`type="button"`, `Eye`, `onPreview`, disabled while saving).
- `Save` button (`type="submit"`, disabled while `saving || !canSave`, `Loader2` while saving).

Use `editorButtonSecondaryClass` for Exit/Preview and `editorButtonPrimaryClass` for Save.

- [ ] **Step 4: Add the editable title above the body editor**

Inside the existing `mx-auto w-full max-w-5xl` wrapper, before `BodyEditor`:

```tsx
<input
  ref={titleRef}
  value={title}
  onChange={(event) => onTitleChange(event.target.value)}
  onKeyDown={(event) => {
    if (event.key === "Enter") event.preventDefault();
  }}
  placeholder="Post title"
  aria-label="Post title"
  aria-required="true"
  autoComplete="off"
  className="mb-5 w-full border-0 border-b-2 border-line bg-transparent px-0 py-3 font-space text-2xl font-bold tracking-[-.04em] text-foreground outline-none transition-colors placeholder:text-muted/40 focus:border-purple sm:text-3xl"
/>
```

- [ ] **Step 5: Simplify the footer**

Keep the error block and keyboard/incomplete-fields hints. Remove the duplicate Exit and Save buttons from the footer.

- [ ] **Step 6: Wire the new props in `BlogForm`**

Add to `<FocusEditor ...>`:

```tsx
onTitleChange={handleTitleChange}
isVisible={isVisible}
onPreview={() => setPreviewOpen(true)}
```

- [ ] **Step 7: Verify TypeScript and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no output.

Run: `pnpm exec eslint components/admin/blog/FocusEditor.tsx components/admin/BlogForm.tsx components/admin/editor/FullscreenDialog.tsx`
Expected: no output.

- [ ] **Step 8: Commit**

```bash
git add components/admin/blog/FocusEditor.tsx components/admin/BlogForm.tsx
git commit -m "feat: add Blogger-style focus writing workflow"
```

---

### Task 3: Verify the workflow end to end

**Files:**
- No code changes expected.

- [ ] **Step 1: Run the full type check**

Run: `pnpm exec tsc --noEmit`
Expected: no output.

- [ ] **Step 2: Run targeted lint**

Run: `pnpm exec eslint components/admin/blog/FocusEditor.tsx components/admin/BlogForm.tsx components/admin/editor/FullscreenDialog.tsx`
Expected: no output.

- [ ] **Step 3: Browser smoke check in the authenticated admin**

Open `/admin/blog/new`, start Focus, then verify:
- The title input is focused and editable; the header shows Exit, Draft, word count, read time, Preview, Save.
- Typing a title updates the main form title and auto-generates the slug for a new post.
- Preview opens over Focus with the unsaved title/body; closing Preview returns to Focus without remounting the editor.
- Background scrolling stays locked while Preview is open over Focus.
- `Esc` closes Preview first, then Focus.
- `Ctrl/Cmd + S` is ignored while Preview is open and saves while Focus is open.
- At a narrow viewport, the top bar wraps without horizontal overflow.

- [ ] **Step 4: Report**

Summarize changed files, verification output, and any checks that could not be performed in this environment.

---

## Self-Review

**Spec coverage:** Editable title, top bar actions, preview stacking, scroll lock, keyboard behavior, and non-goals are covered by Tasks 1–3. No settings rail or route is added.

**Step scan:** Each step names the exact file, prop, command, or markup. No TBD or vague validation steps.

**Type consistency:** `onTitleChange`, `isVisible`, and `onPreview` are defined in Task 2 and consumed in the same task. `FullscreenDialog` props stay unchanged in Task 1.

**Review Focus:** The five failure modes are covered by the Task 3 browser smoke checks, since the repository has no automated UI test runner.

**Proportion:** Three small tasks for three files; no implementation bodies beyond the fixed scroll-lock helpers and the title input contract.
