# Admin Editor Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild all four admin create/edit pages on one neobrutalist editor kit that matches the Projects workspace and the Admin Project Editor reference.

**Architecture:** A new `components/admin/editor/` kit provides the shell, status strip, record header, numbered sections, right rail, live preview, form controls, dirty guard, and sticky action bar. Each existing form keeps its state and fetch logic but composes real fields inside the shell. No server, schema, or API changes.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Lucide icons, existing Prisma models, existing Cloudinary uploader, LexKit/Lexical.

**Spec:** `docs/superpowers/specs/2026-11-18-admin-editor-workspace-design.md`

## Global Constraints

- Do not change APIs, server actions, services, repositories, validations, Prisma schema, auth, or `lib/prisma.ts`.
- Preserve every form payload key, endpoint, HTTP method, toast message, and redirect target.
- Use existing admin tokens only: background `#faf6ee`, surface `#fffdf7`, wash `#f3ede3`, foreground `#1b1b1b`, muted `#58413f`, coral `#f16b5e`, deep accent `#a9362e`, success `#006c49`, alert `#b3261e`.
- Corners are square. Panels use 2px borders and hard offset shadows. No gradients, glassmorphism, soft shadows, or new dependencies.
- Primary button text is foreground on coral, never white.
- Use Space Grotesk (`font-space`) for headings/buttons, Inter (`font-sans`) for body, JetBrains Mono (`font-jet`) for labels/slugs/IDs.
- Do not introduce `any`. Use `unknown` plus `instanceof Error`, or existing helpers.
- Do not assign refs during render. The repo lints `react-hooks/refs` as an error; use a lazy `useState` initializer or an effect instead.
- Every file under `components/admin/editor/` starts with `"use client";` because the kit uses hooks or is composed into client forms.
- Every task ends with `pnpm exec tsc --noEmit` and focused `pnpm exec eslint <paths>`. Run the full build in Task 8.
- There is no component test runner in this repo. Do not invent one or add dependencies. Verification is typecheck, focused lint, build, and the explicit manual/browser checks named in each task.
- Admin credentials are not known to the agent. Do not claim authenticated visual or mutation checks passed unless a real login was performed.
- `lib/prisma.ts` is uncommitted user work. Never stage or commit it.
- Stage exact files per task. Do not use `git add -A` or `git commit -a`.
- Delete the duplicated local `Field`/`Toggle` helpers and the old inline error block and submit/cancel footer from every rewritten form; the editor kit owns those.

## Review Focus

1. **Draft preview:** a signed-in admin opening a hidden project or article must still reach the public detail page (existing pages allow this), so the editor action says "Preview draft" and the rail links out instead of disabling.
2. **Server validation error:** submitting invalid data must keep every entered value, show the error alert, and not redirect.
3. **Media lifecycle:** replace and remove remain state-only until save; the Cloudinary signature flow, 5 MB limit, accepted types, and server cleanup behavior are unchanged.
4. **Unsaved guard:** refresh/close and Cancel/Back prompt only when the form is dirty and not saving; a clean or successfully saved form never prompts.
5. **LexKit inside the form:** opening the insert-link/image dialog, then closing or confirming it, must not submit the article form; article content survives the dialog.

---

### Task 1: Editor state and form controls

**Files:**
- Create: `components/admin/editor/useEditorState.ts`
- Create: `components/admin/editor/EditorField.tsx`
- Create: `components/admin/editor/EditorToggle.tsx`

**Interfaces:**
- Consumes: React 19, Lucide `ChevronDown`.
- Produces:
  - `useEditorDirty(values: unknown): boolean`
  - `useUnsavedGuard(options: { dirty: boolean; saving: boolean }): void`
  - `confirmDiscard(dirty: boolean): boolean`
  - `EditorField(props: { id?: string; label: string; required?: boolean; hint?: React.ReactNode; counter?: React.ReactNode; className?: string; children: React.ReactNode }): React.ReactElement`
  - `EditorSelect(props: React.SelectHTMLAttributes<HTMLSelectElement> & { id?: string }): React.ReactElement`
  - `editorInputClass`, `editorTextareaClass`, `editorMonoInputClass`: string constants
  - `EditorToggle(props: { id?: string; label: string; description?: string; checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }): React.ReactElement`

- [ ] **Step 1: Create `useEditorState.ts`**

Implementation rules:
- `useEditorDirty` captures `JSON.stringify(values)` once with a lazy `useState` initializer, then compares `JSON.stringify(values)` on later renders. Do not write a ref during render; the repo's `react-hooks/refs` rule treats that as an error.
- `useUnsavedGuard` attaches `beforeunload` only when `dirty && !saving`; the handler calls `event.preventDefault()` and sets `event.returnValue = ""`; remove the listener on cleanup.
- `confirmDiscard(true)` calls `window.confirm("You have unsaved changes. Leave this page?")`; `confirmDiscard(false)` returns `true` without prompting.

- [ ] **Step 2: Create `EditorField.tsx`**

Export these exact strings:

```ts
export const editorInputClass =
  "h-10 w-full border-2 border-line bg-background px-3 font-sans text-sm text-foreground outline-none transition-colors placeholder:text-muted/60 focus:border-foreground focus-visible:outline-2 focus-visible:outline-purple focus-visible:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-60";

export const editorTextareaClass =
  "min-h-24 w-full border-2 border-line bg-background px-3 py-2.5 font-sans text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted/60 focus:border-foreground focus-visible:outline-2 focus-visible:outline-purple focus-visible:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-60";

export const editorMonoInputClass = `${editorInputClass} font-jet text-[12px] tracking-[.02em]`;
```

`EditorField` layout:
- Wrapper `div` with `className` and `space-y-1.5`.
- Header row: label in `font-jet text-[9px] font-bold uppercase tracking-[.1em] text-muted`; coral `*` via `text-purple` when required; counter on the right in `font-jet text-[8px] text-muted`.
- If `id` is passed, render `<label htmlFor={id}>`; otherwise render a `<span>` with the same classes. Forms must give every labelable control a matching id (inputs, textareas, selects, date fields, tag inputs, URL fields).
- Children render below the header.
- Hint renders in `font-jet text-[8px] leading-4 tracking-[.08em] text-muted`. Do not uppercase hints, because they contain public paths and slugs.

`EditorSelect`:
- Relative wrapper; native `<select>` with `editorInputClass`, `appearance-none`, `pr-9`; `ChevronDown` absolute right-3 top-1/2 -translate-y-1/2, pointer-events-none.

- [ ] **Step 3: Create `EditorToggle.tsx`**

Use a real checkbox with `role="switch"` and a visible label:

```tsx
<label htmlFor={id} className="flex min-h-11 cursor-pointer items-start gap-3 py-1.5">
  <span className="relative mt-0.5 inline-block h-6 w-11 shrink-0">
    <input id={id} type="checkbox" role="switch" className="peer sr-only" checked={checked} onChange={(event) => onChange(event.target.checked)} disabled={disabled} />
    <span aria-hidden="true" className="absolute inset-0 border-2 border-line bg-background transition-colors peer-checked:bg-purple peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-purple peer-disabled:opacity-50" />
    <span aria-hidden="true" className="absolute left-1 top-1 size-3 border border-line bg-foreground transition-transform peer-checked:translate-x-5 motion-reduce:transition-none" />
  </span>
  <span className="min-w-0">
    <span className="block font-space text-[12px] font-bold">{label}</span>
    {description && <span className="mt-1 block text-[11px] leading-5 text-muted">{description}</span>}
  </span>
</label>
```

Both visual spans must be siblings of the input so `peer-checked` reaches them. The input stays focusable through the label even with `sr-only`.

- [ ] **Step 4: Verify**

Run:

```powershell
pnpm exec tsc --noEmit
pnpm exec eslint components/admin/editor/useEditorState.ts components/admin/editor/EditorField.tsx components/admin/editor/EditorToggle.tsx
```

Expected: both commands exit 0 with no output.

- [ ] **Step 5: Commit**

```powershell
git add components/admin/editor/useEditorState.ts components/admin/editor/EditorField.tsx components/admin/editor/EditorToggle.tsx
git commit -m "feat(admin): add editor state and form controls"
```

---

### Task 2: Editor shell, section, rail, header, and preview

**Files:**
- Create: `components/admin/editor/EditorSection.tsx`
- Create: `components/admin/editor/EditorRail.tsx`
- Create: `components/admin/editor/EditorHeader.tsx`
- Create: `components/admin/editor/EditorPreview.tsx`
- Create: `components/admin/editor/EditorShell.tsx`

**Interfaces:**
- Consumes: Task 1 exports; `shortRecordId`, `copyText` from `components/admin/workspace/utils`; `useToast`; Lucide `ArrowLeft`, `Copy`, `ExternalLink`, `Loader2`.
- Produces:
  - `EditorShell(props: { onSubmit: (event: React.FormEvent<HTMLFormElement>) => void; section: string; mode: "new" | "edit"; recordId?: string; header: React.ReactNode; rail: React.ReactNode; error?: string; dirty: boolean; saving: boolean; submitLabel: string; cancelLabel?: string; onCancel: () => void; children: React.ReactNode }): React.ReactElement`
  - `EditorHeader(props: { eyebrow: string; eyebrowNote: string; title: string; description: string; meta?: React.ReactNode; actions?: React.ReactNode }): React.ReactElement`
  - `EditorHeaderActions(props: { backLabel: string; onBack: () => void; publicHref?: string | null; publicLabel: string; publicDisabledReason?: string; submitLabel: string; saving: boolean }): React.ReactElement`
  - `EditorMetaChip(props: { children: React.ReactNode; mono?: boolean }): React.ReactElement`
  - `EditorPathChip(props: { value: string; label?: string }): React.ReactElement`
  - `EditorSection(props: { index: string; title: string; meta?: string; children: React.ReactNode }): React.ReactElement`
  - `EditorRail({ children }: { children: React.ReactNode }): React.ReactElement`
  - `EditorPanel(props: { index: string; title: string; meta?: string; children: React.ReactNode }): React.ReactElement`
  - `EditorPreview(props: { title: string; description?: string; image?: string | null; imageAlt?: string; iconSrc?: string | null; eyebrow?: string; badges?: string[]; path?: string; href?: string; draft?: boolean; emptyLabel?: string }): React.ReactElement`

- [ ] **Step 1: Create `EditorSection.tsx`**

Use `useId` for the heading id. Render `<section aria-labelledby={headingId} className="border-2 border-line bg-surface shadow-[3px_3px_0_var(--foreground)]">`.

Header strip:
- `flex flex-wrap items-center justify-between gap-2 border-b-2 border-line bg-admin-wash px-3 py-2.5`
- Index `grid size-6 shrink-0 place-items-center bg-foreground font-jet text-[9px] font-bold text-background`
- Title `font-space text-[12px] font-bold uppercase tracking-[.04em]`
- Meta `font-jet text-[8px] font-bold uppercase tracking-[.1em] text-muted`
- Content `p-4 sm:p-5`

- [ ] **Step 2: Create `EditorRail.tsx`**

- `EditorRail`: `<aside aria-label="Editor settings and preview" className="space-y-5 xl:sticky xl:top-[88px]">`.
- `EditorPanel`: same panel chrome and header strip as `EditorSection`, but content `p-4`.

- [ ] **Step 3: Create `EditorHeader.tsx`**

`EditorHeader`:
- Eyebrow `font-jet text-[9px] font-bold uppercase tracking-[.12em]`; accent span `text-purple` for `eyebrow`, separator `/`, muted `eyebrowNote`.
- H1 `font-space text-foreground` with `fontSize: "clamp(30px, 3.4vw, 40px)"`, `lineHeight: 1.05`, `fontWeight: 700`, `letterSpacing: "-.05em"`, `margin: "4px 0 0"`.
- Description `mt-1.5 max-w-[680px] font-sans text-[13px] leading-6 text-muted`.
- Meta row `mt-4 flex flex-wrap items-center gap-2`.
- Header outer `mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between`.
- Actions wrapper `flex shrink-0 flex-wrap items-center gap-3 lg:pt-5`.

`EditorMetaChip`: `inline-flex h-6 max-w-full items-center gap-1.5 border border-line bg-background px-2 font-jet text-[8px] font-bold uppercase tracking-[.06em]`; use `font-sans normal-case tracking-normal text-[11px]` when `mono={false}`. Long children must truncate with `truncate`.

`EditorPathChip`: render an `EditorMetaChip` with the path value in mono, plus a `Copy` icon button (`type="button"`, `aria-label="Copy public path"`, `title="Copy path"`). On click call `copyText(value)` from `components/admin/workspace/utils`, then `showToast("Public path copied")` from `useToast`. If the clipboard rejects, show `showToast("Could not copy path")`. Keep the layout from wrapping; truncate the path text.

`EditorHeaderActions`:
- Back: `button type="button"` with `ArrowLeft`, secondary style, `disabled={saving}`.
- Public: if `publicHref`, `<a href={publicHref} target="_blank" rel="noreferrer">` with `ExternalLink`, label `publicLabel`; otherwise wrap a disabled `button type="button"` in a `<span title={publicDisabledReason}>` so the explanation is reachable on hover.
- Submit: `button type="submit"` with primary style, `disabled={saving}`, and label `saving ? "Saving..." : submitLabel`; include a spinning `Loader2` while saving.
- Secondary style: `inline-flex h-10 items-center gap-2 border-2 border-line bg-surface px-4 font-jet text-[9px] font-bold uppercase tracking-[.08em] shadow-[2px_2px_0_var(--foreground)] transition-transform hover:-translate-y-0.5 hover:bg-admin-wash disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transform-none`.
- Primary style: `inline-flex h-10 items-center gap-2 border-2 border-line bg-purple px-4 font-space text-[12px] font-bold tracking-[-.01em] text-foreground shadow-[3px_3px_0_var(--foreground)] transition-transform hover:-translate-y-0.5 hover:bg-[#ef7e70] disabled:cursor-wait disabled:opacity-60 motion-reduce:transform-none`.

- [ ] **Step 4: Create `EditorPreview.tsx`**

Render a non-interactive card with an optional link on the path row:
- Card `relative border-2 border-line bg-background`.
- Media area `relative aspect-video overflow-hidden border-b-2 border-line` when `image`; use `next/image` with `fill`, `sizes="330px"`, `unoptimized`, `object-cover`, alt `imageAlt ?? title`.
- Icon area when `iconSrc`: `grid place-items-center border-b-2 border-line bg-admin-wash p-6`, `next/image` width/height 56, unoptimized.
- Neither: dashed area `grid min-h-28 place-items-center border-b-2 border-dashed border-line bg-admin-wash p-4 text-center font-jet text-[8px] uppercase tracking-[.08em] text-muted` with `emptyLabel ?? "No preview asset yet."`.
- Draft badge: absolute top-2 left-2 `border border-line bg-purple px-2 py-1 font-jet text-[8px] font-bold uppercase tracking-[.08em]`.
- Body `space-y-2 p-3`: eyebrow `font-jet text-[8px] font-bold uppercase tracking-[.1em] text-amber`, title `font-space text-[15px] font-bold leading-tight`, description `line-clamp-3 text-[11px] leading-5 text-muted`, badges row of bordered chips, path row.
- Path row: if `href`, `<a href={href} target="_blank" rel="noreferrer" className="... underline-offset-2 hover:underline">`; else a `<span>`. Use `break-all font-jet text-[9px] text-muted`.

- [ ] **Step 5: Create `EditorShell.tsx`**

Structure:

```tsx
<form ref={formRef} onSubmit={onSubmit} className="pb-4">
  <StatusStrip />
  {header}
  {error && <div ref={errorRef} role="alert" className="mb-5 border-2 border-admin-alert bg-[#f9e8e6] px-4 py-3 font-sans text-sm leading-6 text-admin-alert shadow-[2px_2px_0_var(--foreground)]">{error}</div>}
  <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
    <div className="min-w-0 space-y-5">{children}</div>
    {rail}
  </div>
  <ActionBar />
</form>
```

Status strip:
- `mb-4 flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-2 border-line bg-surface px-2.5 py-2 shadow-[2px_2px_0_var(--foreground)]`.
- Left: coral chip `inline-flex h-5 items-center gap-1.5 bg-purple px-2 font-jet text-[9px] font-bold uppercase tracking-[.08em]` with a `size-1.5 bg-surface` dot and text `Sync ready`; then `Workspace // {section}` in foreground, `/ Editor` in muted, and mode.
- Mode: `New record` or `Record {shortRecordId(recordId)}`.
- Right: dirty chip, `Mode // New|Edit`, and a `Live database` chip hidden below `sm` (`hidden h-6 items-center gap-1.5 border border-line bg-background px-2 font-jet text-[8px] font-bold uppercase tracking-[.06em] sm:inline-flex`) with a `size-1.5 bg-admin-success` dot.
- Dirty chip text: `Saving changes` while saving, `Unsaved changes` when dirty, then `No changes yet` in new mode or `All changes saved` in edit mode. Dirty uses `bg-purple text-foreground`; clean uses `border border-line bg-background` with a `bg-admin-success` dot. Put `aria-live="polite"` on the text.

Action bar:
- `sticky bottom-0 z-30 -mx-4 mt-6 border-t-2 border-line bg-background px-4 py-3 sm:-mx-6 sm:px-6`.
- Left: dirty/save state and `font-jet text-[8px] uppercase tracking-[.08em] text-muted` hint `Ctrl/Cmd + S to save`.
- Right: Cancel button (`type="button"`, secondary) calling `onCancel`; submit button (`type="submit"`, primary) with `submitLabel` / `Saving...`.
- Both disabled while `saving`.

Behavior:
- `useUnsavedGuard({ dirty, saving })`.
- `useEffect` keydown: if `(metaKey || ctrlKey) && key.toLowerCase() === "s"`, `preventDefault()`, then `if (!saving && !document.querySelector("dialog[open]")) formRef.current?.requestSubmit()`. The dialog guard keeps Ctrl/Cmd+S from submitting the article while the LexKit insert prompt is open. Remove the listener on cleanup.
- `useEffect` on `error`: `errorRef.current?.scrollIntoView({ block: "nearest", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })`.
- Do not intercept other keys or global navigation.

- [ ] **Step 6: Verify**

```powershell
pnpm exec tsc --noEmit
pnpm exec eslint components/admin/editor
```

Expected: exit 0.

- [ ] **Step 7: Commit**

```powershell
git add components/admin/editor
git commit -m "feat(admin): add editor shell, header, sections, rail, and preview"
```

---

### Task 3: Media uploader and shared modal refresh

**Files:**
- Modify: `components/admin/ImageUploader.tsx`
- Modify: `components/ui/Modal.tsx`

**Interfaces:**
- Consumes: existing Cloudinary signature endpoint, `next/image`, Lucide `Upload`, `X`, `Loader2`, `RefreshCw`.
- Produces:
  - `ImageUploader(props: { value: string; onChange: (url: string) => void; label?: string; aspect?: "video" | "certificate" }): React.ReactElement`
  - `Modal` keeps its exact existing props and export name.

- [ ] **Step 1: Restyle `ImageUploader` and add drag/drop**

Keep `MAX_SIZE_MB = 5`, `ACCEPTED`, `handleFile`, `handleRemove`, and the hidden input logic unchanged.

Add:
- `aspect?: "video" | "certificate"` default `"video"`.
- `dragging` state.
- `onDragOver={(event) => { event.preventDefault(); setDragging(true); }}`; `onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false); }}`; `onDrop={(event) => { event.preventDefault(); setDragging(false); const file = event.dataTransfer.files?.[0]; if (file) void handleFile(file); }}` on the empty-state wrapper.
- Empty state: `border-2 border-dashed p-6 text-center`, `border-purple bg-admin-wash` while dragging, otherwise `border-line bg-surface`. A `type="button"` inside opens the picker; show `Upload` icon, `label`, and `PNG, JPG, WebP, GIF or SVG. Max 5 MB.` Text uses existing sans sizes.
- Filled state: image frame `relative border-2 border-line bg-admin-wash` with `aspect-video` or `aspect-[4/3]`; `next/image` fill, `sizes="320px"`, `unoptimized`, `object-cover`.
- Actions row below: `Replace` secondary button that opens the picker; `Remove` bordered alert button calling `handleRemove`. Disable both while uploading.
- Uploading overlay: `absolute inset-0 grid place-items-center bg-background/80` with `Loader2 animate-spin` and `Uploading...`.
- Error: `role="alert"`, `mt-2 font-jet text-[9px] uppercase tracking-[.06em] text-admin-alert`.
- Keep `onChange("")` as the only removal action. Do not call Cloudinary deletion from the client.

- [ ] **Step 2: Restyle `Modal` and fix accidental submits**

Keep all props and the dialog/scroll-lock logic. Change only presentation plus button types:
- Panel: `w-full border-2 border-line bg-surface shadow-[4px_4px_0_var(--foreground)]` (no rounded corners, no soft shadow).
- Header: `flex items-center justify-between gap-4 border-b-2 border-line px-5 py-4`; title `font-space text-base font-bold tracking-[-.02em]`.
- Close button: `type="button"`, `grid size-11 place-items-center border-2 border-line bg-background text-foreground transition-colors hover:bg-admin-wash`.
- Content: `px-5 py-5`.
- Footer: `flex justify-end gap-3 border-t-2 border-line px-5 py-4`.
- Cancel: `type="button"`, secondary style.
- Confirm: `type="button"`, primary coral style with foreground text.
- Backdrop: `backdrop:bg-foreground/60`.

- [ ] **Step 3: Verify**

```powershell
pnpm exec tsc --noEmit
pnpm exec eslint components/admin/ImageUploader.tsx components/ui/Modal.tsx
```

Expected: exit 0.

- [ ] **Step 4: Commit**

```powershell
git add components/admin/ImageUploader.tsx components/ui/Modal.tsx
git commit -m "feat(admin): refresh media uploader and shared modal"
```

---

### Task 4: Project editor

**Files:**
- Modify: `components/admin/ProjectForm.tsx`
- Modify: `app/admin/projects/new/page.tsx`
- Modify: `app/admin/projects/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: all editor kit exports from Tasks 1-3; `slugify`; `useToast`; `responseError`, `formatDate`, `formatRelativeTime`, `formatCategory`, and `shortRecordId` from `components/admin/workspace/utils`; Prisma `Project`.
- Produces: the same `ProjectForm` export and behavior.

- [ ] **Step 1: Preserve state and payload, add editor state**

Keep every existing state value and `handleTitleChange`, tag helpers, `moveScreenshot`, and the payload object exactly as they are.

Add:

```ts
const dirty = useEditorDirty({ title, slug, description, body, bodyFormat, thumbnail, screenshots, techStack, githubUrl, liveUrl, category, featured, isVisible, sortOrder });
useUnsavedGuard({ dirty, saving });
```

Replace `catch (e: any)` with a `catch (error)` that sets:
```ts
setError(error instanceof Error ? error.message : "Failed to save project")
```
Replace the `res.json()` error parsing with `throw new Error(await responseError(res, "Failed to save project"))`.

Add:
```ts
function handleCancel() { if (confirmDiscard(dirty)) router.back(); }
function handleBack() { if (confirmDiscard(dirty)) router.push("/admin/projects"); }
```

- [ ] **Step 2: Rebuild the JSX with the editor kit**

Use `<EditorShell ...>` with:
- `section="Projects"`, `mode={isEdit ? "edit" : "new"}`, `recordId={project?.id}`, `onSubmit={handleSubmit}`, `error`, `dirty`, `saving`, `submitLabel={isEdit ? "Update Project" : "Create Project"}`, `onCancel={handleCancel}`.
- Header: eyebrow `Editor // Projects`, eyebrowNote `New record` or `Record {shortRecordId(project.id)}`; title `New Project` / `Edit Project`; description `Create a case study for your portfolio.` / `Update "{project.title}".`.
- Meta chips: `/projects/{slug || "your-slug"}`, `formatRelativeTime(project.updatedAt)` for edit, `formatCategory(category)`. Reuse `formatCategory` from workspace utils.
- Header actions: `backLabel="Back to Projects"`, `onBack={handleBack}`, `publicHref={isEdit && slug ? \`/projects/${slug}\` : null}`, `publicLabel={isVisible ? "View Project" : "Preview Draft"}`, `publicDisabledReason="Save the project before previewing it."`, submit label and `saving`.

Sections:
1. `01 // Identity`, meta `Required fields`: title (`id="project-title"`, required), slug (`id="project-slug"`, mono, required, hint `Public path: /projects/{slug || "your-slug"}`), description (`id="project-description"`, required, rows 4, counter `{description.length} characters`).
2. `02 // Classification`, meta `Metadata`: category `EditorSelect` with Product/Tool; body format `EditorSelect` with HTML/Markdown; tech stack field with input + Add button and removable bordered chips. Keep Enter-to-add and duplicate guard.
3. `03 // Media & Assets`, meta `{screenshots.length}/10 screenshots`: thumbnail `ImageUploader` aspect video, required hint `Required for the project cover.`; screenshots list.
   - Each row: `border-2 border-line bg-background p-2`, index badge, drag handle, 96x64 thumbnail, up/down buttons (`ArrowUp`, `ArrowDown`) calling `moveScreenshot(i, i - 1)` / `moveScreenshot(i, i + 1)` with disabled bounds, remove `X` button with the existing confirm text.
   - The up/down/remove icon buttons use `size-11` (44px), `aria-label` (for example `Move screenshot 2 up`), and `title`. Keep drag start/over/drop/end handlers.
   - Show a new uploader only when `screenshots.length < 10`, label `Add screenshot`.
4. `04 // External Links`, meta `Optional`: GitHub URL and live URL, mono inputs, icon hints.
5. `05 // Body`, meta `{words} words`: textarea rows 16, mono, required, hint `Format: {bodyFormat.toUpperCase()}`. Compute `words` from `body.trim().split(/\s+/).filter(Boolean).length`.

Rail:
1. `Publishing`: `EditorToggle label="Published"` mapped to `isVisible`, description `Visible on the public site. Turn off to keep this record as a draft.`; `EditorToggle label="Featured"`; sort order number input with hint `Lower numbers appear first.`
2. `Public Preview`: `<EditorPreview ... />` with thumbnail or first screenshot, `eyebrow={featured ? "Featured project" : "Project"}`, badges `[formatCategory(category), bodyFormat.toUpperCase()]`, path, `href={isEdit && slug ? \`/projects/${slug}\` : undefined}`, `draft={!isVisible}`, empty label `Add a thumbnail to preview this record.`
3. `Record`: definition list rows Mode, ID (`shortRecordId(project.id)`), Created (`formatDate(project.createdAt)`), Updated (`formatRelativeTime(project.updatedAt)`), Screenshots (`{screenshots.length}/10`). Create mode uses `Created when saved` and `-` for ID.

Remove the old inline error block, the old page-level `Field`/`Toggle` helpers, and the old submit/cancel footer.

- [ ] **Step 3: Trim the pages**

`app/admin/projects/new/page.tsx`:
```tsx
import { ProjectForm } from "@/components/admin/ProjectForm";
export default function NewProjectPage() { return <ProjectForm />; }
```

`app/admin/projects/[id]/edit/page.tsx`: keep the service call and `notFound()`, return `<ProjectForm project={project} />`, remove the heading wrapper and `max-w-3xl`.

- [ ] **Step 4: Verify**

```powershell
pnpm exec tsc --noEmit
pnpm exec eslint components/admin/ProjectForm.tsx app/admin/projects
```

Expected: exit 0. If authenticated access is available, open `/admin/projects/new` and an edit record at 1280 and 390 widths; check section layout, toggle behavior, screenshot move buttons, preview updates, and sticky bar.

- [ ] **Step 5: Commit**

```powershell
git add components/admin/ProjectForm.tsx app/admin/projects
git commit -m "feat(admin): rebuild project create and edit pages"
```

---

### Task 5: Article editor and LexKit chrome

**Files:**
- Modify: `components/admin/BlogForm.tsx`
- Modify: `components/admin/LexKitEditor.tsx`
- Modify: `app/admin/blog/new/page.tsx`
- Modify: `app/admin/blog/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: editor kit; `LexKitEditor`; `CATEGORIES`; `slugify`; `useToast`; workspace utils.
- Produces: the same `BlogForm` and `LexKitEditor` exports and behavior.

- [ ] **Step 1: Preserve state and payload, add editor state**

Keep `computedReadTime`, category logic, tag helpers, payload keys, toast, and redirect.

Replace the unused `bodyFormat` state with a value:
```ts
const bodyFormat = (post?.bodyFormat as "html" | "markdown") ?? "html";
```
Use it in the payload and the body hint. This removes the current `setBodyFormat` unused-variable warning without adding a control the design did not ask for.

Add `useEditorDirty` over `{ title, slug, excerpt, body, bodyFormat, category, tags, publishedAt, thumbnail, isVisible, sortOrder }`, `useUnsavedGuard`, `confirmDiscard`, `responseError`, and the same `handleCancel` / `handleBack` pattern with `/admin/blog`. Include `body` directly: LexKit will stop emitting its mount-time import (Step 3), so no separate `bodyTouched` flag is needed. Replace `catch (e: any)` with `catch (error)` and `setError(error instanceof Error ? error.message : "Failed to save post")`; replace the `res.json()` error parsing with `throw new Error(await responseError(res, "Failed to save post"))`.

- [ ] **Step 2: Rebuild the JSX**

Shell: `section="Articles"`, header eyebrow `Editor // Articles`, title `New Post` / `Edit Post`, description `Write a new dispatch for your blog.` / `Update "{post.title}".`, path `/blog/{slug || "your-slug"}`, meta chips `category || "Article"` and `computedReadTime` (plus `formatRelativeTime(post.updatedAt)` in edit mode).

Sections:
1. `01 // Identity`: title (`id="blog-title"`, required), slug (`id="blog-slug"`, mono, required, hint `Public path: /blog/{slug || "your-slug"}`), excerpt (`id="blog-excerpt"`, required, rows 3, counter `{excerpt.length} characters`).
2. `02 // Classification & Schedule`: category `EditorSelect` with presets + `Custom...`; when custom, show the required text input below; published date `type="date"`; read time read-only box showing `computedReadTime`; tags input + Add + removable chips.
3. `03 // Media`: thumbnail `ImageUploader` aspect video.
4. `04 // Body`: `LexKitEditor key={post?.id ?? "new"} content={body} onChange={setBody}`; hint `Format: {bodyFormat.toUpperCase()}. Rich text. Read time and word count update automatically.`

LexKit mount handling (required): fix this inside `LexKitEditor`, not in the form.
- A first-callback or `bodyTouched` flag in the form is wrong: a new empty article's first real edit would be ignored. Instead suppress only the updates caused by the mount-time HTML import.
- Add `const suppressChanges = useRef(false);` to `EditorShell`.
- In the initialization effect, when `content` is non-empty set `suppressChanges.current = true` before `commands.importFromHTML(content)`, then reset it in a nested microtask after the import:
```ts
if (content) {
  suppressChanges.current = true;
  queueMicrotask(() => {
    commands.importFromHTML(content);
    queueMicrotask(() => {
      suppressChanges.current = false;
    });
  });
}
```
- In the existing update listener, keep updating `currentBlock` and `currentAlign`, but only call `onChangeRef.current(html)` when `!suppressChanges.current`.
- This keeps the form's `body` state at its stored value on load (clean), while every real edit emits normally.
- Keep `body` in the submitted payload and in the dirty snapshot.

Rail:
1. `Publishing`: Published toggle (`isVisible`), sort order.
2. `Public Preview`: article preview with thumbnail, eyebrow `{category || "Article"} / {computedReadTime}`, badges `tags.slice(0, 3)`, path, href `/blog/{slug}` when editing, `draft={!isVisible}`.
3. `Record`: Mode, ID, Created, Updated, Read time, Words (strip HTML tags with `body.replace(/<[^>]*>/g, "").trim().split(/\s+/).filter(Boolean).length`).

Header actions: `Back to Articles`, public label `View Article` / `Preview Draft`, public href only when editing, `publicDisabledReason="Save the article before previewing it."`.

- [ ] **Step 3: Restyle LexKit chrome**

In `LexKitEditor.tsx`:
- `richTextExtension` classNames: `contentEditable: "prose max-w-none focus:outline-none px-4 py-4 min-h-[360px] text-sm text-foreground bg-background cursor-text"`, placeholder `"text-muted text-sm px-4 py-4"`; `caretColor: "#1b1b1b"`. Remove `prose-invert`.
- Wrapper: `overflow-visible border-2 border-line bg-background transition-colors`; focused `border-purple shadow-[2px_2px_0_var(--foreground)]`.
- Toolbar: `border-b-2 border-line bg-admin-wash px-2 py-1.5`.
- Dropdown panels: `border-2 border-line bg-surface p-1 shadow-[3px_3px_0_var(--foreground)]`; selected option `bg-purple text-foreground`, others `text-muted hover:bg-admin-wash hover:text-foreground`.
- Dropdown triggers and toolbar buttons: square hover states; active `bg-purple text-foreground`; retain `title`, aria labels, and `onMouseDown` preventDefault.
- Prompt input: square 2px bordered background input.
- Replace the render-time ref write `onChangeRef.current = onChange;` with an effect:
```ts
useEffect(() => {
  onChangeRef.current = onChange;
}, [onChange]);
```
The repo lints `react-hooks/refs` as an error, and the current render-time assignment fails it.
- Remove the unused `InsertBtn` helper (existing lint warning).
- Do not change extension configuration, focus/scroll guards, or HTML export. The only initialization change is the mount-import suppression described in Step 2.

- [ ] **Step 4: Trim the pages**

`new/page.tsx` returns `<BlogForm />`; edit keeps the service call and returns `<BlogForm post={post} />` without the old heading wrapper.

- [ ] **Step 5: Verify**

```powershell
pnpm exec tsc --noEmit
pnpm exec eslint components/admin/BlogForm.tsx components/admin/LexKitEditor.tsx app/admin/blog
```

Expected: exit 0. If authenticated access exists, open the article editor, type body content, open the insert-link dialog, press Escape/Close, confirm the form did not submit and content remains.

- [ ] **Step 6: Commit**

```powershell
git add components/admin/BlogForm.tsx components/admin/LexKitEditor.tsx app/admin/blog
git commit -m "feat(admin): rebuild article create and edit pages"
```

---

### Task 6: Achievement editor

**Files:**
- Modify: `components/admin/CertificateForm.tsx`
- Modify: `app/admin/certificates/new/page.tsx`
- Modify: `app/admin/certificates/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: editor kit; `ImageUploader`; `useToast`; workspace utils; Prisma `Certificate`.
- Produces: the same `CertificateForm` export and behavior.

- [ ] **Step 1: Preserve state and payload, add editor state**

Keep state, date conversion, payload, toast, and redirect. Add `useEditorDirty` over `{ title, issuer, issueDate, credentialUrl, image, description, isVisible, sortOrder }`, `useUnsavedGuard`, `confirmDiscard`, and `handleCancel` / `handleBack` with `/admin/certificates`. Replace `catch (e: any)` with `catch (error)` and `setError(error instanceof Error ? error.message : "Failed to save certificate")`; use `responseError(res, "Failed to save certificate")`.

- [ ] **Step 2: Rebuild the JSX**

Shell: `section="Achievements"`, eyebrow `Editor // Achievements`, title `New Certificate` / `Edit Certificate`, description `Log a verified milestone.` / `Update "{certificate.title}".`, path `/achievements`, meta chips `issuer` and `formatRelativeTime(certificate.updatedAt)` in edit mode.

Sections:
1. `01 // Identity`: title, issuer (2-column at sm), description (rows 4, counter).
2. `02 // Credential`: issue date, credential URL (mono, hint `Optional. Must start with http(s):// or /.`).
3. `03 // Media`: `ImageUploader aspect="certificate"`, label `Upload certificate image`.

Rail:
1. `Publishing`: Published toggle (`isVisible`), sort order.
2. `Public Preview`: certificate preview with image, eyebrow `issuer || "Achievement"`, badges `[formatDate(issueDate)]`, path `/achievements`, `href={isEdit && isVisible ? "/achievements" : undefined}` (the archive only shows visible saved records, so a new or draft record has no record preview), draft badge, empty label `Add a certificate image to preview this record.`
3. `Record`: Mode, ID, Created, Updated, Credential (`Added` / `Not added`).

Header actions: `Back to Achievements`, `publicLabel="View Achievements"`, `publicHref="/achievements"` (edit only), `publicDisabledReason="Save the certificate before viewing the archive."`. Do not use "Preview draft" because the archive only shows visible records.

- [ ] **Step 3: Trim the pages**

`new/page.tsx` returns `<CertificateForm />`; edit keeps the service call and returns `<CertificateForm certificate={certificate} />`.

- [ ] **Step 4: Verify**

```powershell
pnpm exec tsc --noEmit
pnpm exec eslint components/admin/CertificateForm.tsx app/admin/certificates
```

Expected: exit 0. If authenticated, check the 4:3 image frame, date input, credential hint, and preview.

- [ ] **Step 5: Commit**

```powershell
git add components/admin/CertificateForm.tsx app/admin/certificates
git commit -m "feat(admin): rebuild achievement create and edit pages"
```

---

### Task 7: Skill editor

**Files:**
- Modify: `components/admin/SkillForm.tsx`
- Modify: `app/admin/skills/new/page.tsx`
- Modify: `app/admin/skills/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: editor kit; `skillCategories`; Lucide `Check`; `next/image`; `formatCategory`, `formatDate`, `formatRelativeTime`, `shortRecordId`, `responseError` from `components/admin/workspace/utils`; Prisma `Skill`.
- Produces: the same `SkillForm` export and behavior.

- [ ] **Step 1: Preserve state and payload, add editor state**

Keep `ICON_OPTIONS`, `selectIcon`, payload, toast, and redirect. Add `useEditorDirty` over `{ name, iconSrc, category, sortOrder, isVisible }`, `useUnsavedGuard`, `confirmDiscard`, and `handleCancel` / `handleBack` with `/admin/skills`. Replace `catch (e: any)` with `catch (error)` and `setError(error instanceof Error ? error.message : "Failed to save skill")`; use `responseError(res, "Failed to save skill")`.

- [ ] **Step 2: Rebuild the JSX**

Shell: `section="Skills"`, eyebrow `Editor // Skills`, title `New Skill` / `Edit Skill`, description `Add a tool to the studio stack.` / `Update "{skill.name}".`, path `/about`, meta chips `formatCategory(category)` and `formatRelativeTime(skill.updatedAt)` in edit mode.

Sections:
1. `01 // Identity`: name, category `EditorSelect` using `skillCategories`.
2. `02 // Icon`: icon grid `grid grid-cols-4 gap-2 sm:grid-cols-7`.
   - Each button `type="button"`, `aria-pressed={iconKey === key}`, `aria-label={`Use ${key} icon`}`.
   - Selected: `border-2 border-line bg-purple shadow-[2px_2px_0_var(--foreground)]`; unselected: `border-2 border-line bg-background hover:bg-admin-wash`.
   - `h-14` grid cell, `Image` 26x26, `alt=""`; selected cell shows a small `Check` badge in the corner.
   - Below: selected icon preview and path in `font-jet text-[10px] text-muted break-all`.
   - If `iconSrc` is empty, show a hint `Select an icon for this skill.`

Rail:
1. `Publishing`: Published toggle (`isVisible`), sort order.
2. `Public Preview`: `EditorPreview` with `iconSrc`, title, eyebrow `formatCategory(category)`, path `/about`, `href={isEdit && isVisible ? "/about" : undefined}` (the About page only shows visible saved skills), draft badge, empty label `Select an icon to preview this skill.`
3. `Record`: Mode, ID, Created, Updated.

Header actions: `Back to Skills`, `publicLabel="View About Page"`, `publicHref="/about"` (edit only), `publicDisabledReason="Save the skill before viewing the About page."`.

- [ ] **Step 3: Trim the pages**

`new/page.tsx` returns `<SkillForm />`; edit keeps the service call and returns `<SkillForm skill={skill} />`.

- [ ] **Step 4: Verify**

```powershell
pnpm exec tsc --noEmit
pnpm exec eslint components/admin/SkillForm.tsx app/admin/skills
```

Expected: exit 0. If authenticated, check selected icon state, keyboard focus, and preview.

- [ ] **Step 5: Commit**

```powershell
git add components/admin/SkillForm.tsx app/admin/skills
git commit -m "feat(admin): rebuild skill create and edit pages"
```

---

### Task 8: Full verification and cleanup

**Files:**
- Review only; modify files only if verification finds a real failure.

**Interfaces:**
- Consumes: all previous tasks.
- Produces: a verified branch with no stray changes.

- [ ] **Step 1: Run the full typecheck**

```powershell
pnpm exec tsc --noEmit
```

Expected: no output, exit 0.

- [ ] **Step 2: Run focused lint on every changed area**

```powershell
pnpm exec eslint components/admin/editor components/admin/ProjectForm.tsx components/admin/BlogForm.tsx components/admin/CertificateForm.tsx components/admin/SkillForm.tsx components/admin/ImageUploader.tsx components/admin/LexKitEditor.tsx components/ui/Modal.tsx app/admin/projects app/admin/blog app/admin/certificates app/admin/skills
```

Expected: no new errors. Existing repo-wide warnings unrelated to these files are acceptable only if they also existed before; do not introduce `any`.

- [ ] **Step 3: Run the production build**

```powershell
pnpm run build
```

Expected: 53/53 pages generated, exit 0. If the dev server is running and `.next` is locked, stop the dev server first or reuse the existing build output; do not delete user data. A corrupted `.next/dev/types` file from a killed dev server is cleared by removing `.next` only after confirming no dev process is using it.

- [ ] **Step 4: Smoke the running app**

If a dev or production server is available, request:
- `/`, `/blog`, `/projects`, `/achievements`, `/about`, `/contact` -> 200
- `/admin/projects`, `/admin/blog`, `/admin/certificates`, `/admin/skills` -> 307 to login when signed out
- `/api/blog/rss`, `/sitemap.xml` -> 200

Do not start a second server on port 3000. Reuse the running one or note that it is unavailable.

- [ ] **Step 5: Authenticated verification**

If the user can supply a test login or confirms a way to sign in:
- Create and update one record per module.
- Toggle Published off and verify "Preview Draft" still opens the project/article detail page for the admin.
- Submit an invalid form (empty required field bypassed by devtools is not enough; trigger a server error such as a duplicate slug) and verify values remain.
- Replace and remove an image, then save, and confirm the saved record reflects the new URL.
- Reorder screenshots with drag and with the up/down buttons.
- Type in the article body, open/close the insert-link modal, confirm no submit and no content loss.
- Check 1440, 1280, 1024, 768, and 390 widths for overflow, rail stacking, and sticky bar overlap.

If no authenticated path exists, state that these checks were not executed. Do not claim they passed.

- [ ] **Step 6: Confirm the working tree**

```powershell
git status --porcelain
```

Expected: clean except `lib/prisma.ts`, which must remain uncommitted and untouched. If any editor files remain modified, commit them with a focused message; never include `lib/prisma.ts`.

- [ ] **Step 7: Final commit (only if Step 1-5 required fixes)**

```powershell
git add <the exact fixed files>
git commit -m "fix(admin): address editor verification findings"
```
