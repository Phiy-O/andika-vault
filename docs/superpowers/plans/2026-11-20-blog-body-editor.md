# Blog Body Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Visual/HTML body switch, a full-screen focus writer, and a full rendered article preview to the admin blog create/edit form.

**Architecture:** `BlogForm` owns body source, format, mode, and overlay state. Small client components (`BodyEditor`, `FocusEditor`, `PreviewArticle`, `FullscreenDialog`) render the editing surfaces. A new admin-guarded server action runs the same pure `buildArticleContent` pipeline as `/blog/[slug]` so preview HTML matches production.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, LexKit/Lexical, Zod, sanitize-html.

**Spec:** `docs/superpowers/specs/2026-11-20-blog-body-editor-design.md`

## Global Constraints

- Use `pnpm` only.
- All admin server mutations/preview calls must start with `await requireAdmin()`.
- Server action responses use `{ data?: T; error?: string }`.
- Rich text is sanitized with `sanitizeContent()` before public rendering.
- Do not introduce `any`, new warnings, new dependencies, or a different response convention.
- Preserve the existing admin design language: `font-jet` metadata, 2px `border-line`, offset shadows, `bg-purple` accents, no excessive rounding.
- Native `<dialog>` provides focus trapping; every overlay must close with `Esc`, have a labelled close button, and lock body scroll while open.
- Verify with `pnpm exec tsc --noEmit`, `pnpm run lint`, and `pnpm run build`.
- There is no test runner in this repository; each task's verification is the type checker plus focused code review.

## Review Focus

- **Switching Visual → HTML → Visual must not lose or duplicate content.** The visual editor only reads its `content` prop on mount, so every out-of-band body change must remount it.
- **Legacy Markdown records must not silently change format on save.** `bodyFormat` flips to `html` only when the body is actually edited.
- **Preview must match the public page for unsaved input.** It must use `buildArticleContent` and `sanitizeContent`, not a client-side approximation.
- **`sanitize-html` must not enter the admin client bundle.** Do not re-export the content builder from a module imported by client components.
- **Ctrl/Cmd+S must save while Focus mode is open but stay blocked by confirm/delete dialogs.**

---

### Task 1: Extract the article content builder

**Files:**
- Create: `src/lib/article-content.ts`
- Modify: `components/blog/detail/article-content.ts`
- Modify: `app/blog/[slug]/page.tsx:10-15`
- Modify: `components/blog/detail/ArticleSidebar.tsx:5`

**Interfaces:**
- Produces:
  - `export type TocHeading = { id: string; label: string }`
  - `export function buildArticleContent(body: string): { html: string; headings: TocHeading[] }`
- Consumes: `sanitizeContent` from `@/src/lib/sanitize`.

- [ ] **Step 1: Create `src/lib/article-content.ts`**

Move these functions verbatim from `components/blog/detail/article-content.ts`: `decodeEntities`, `textFromHtml`, `addHeadingIds`, `escapeHtml`, `formatInline`, `plainTextToHtml`, `buildArticleContent`, plus the `namedEntities` map and the `TocHeading` type. Import `sanitizeContent` from `./sanitize`. Keep the existing behavior: HTML input when trimmed body starts with `<`, otherwise the Markdown-ish fallback, then `addHeadingIds`.

- [ ] **Step 2: Remove the moved code from `components/blog/detail/article-content.ts`**

Delete the moved helpers, the `sanitizeContent` import, and the `TocHeading` type. Keep `CategoryTheme`, `getCategoryTheme`, `DEFAULT_BLOG_THUMBNAIL`, `formatArticleDate`, `formatReadTime`, `formatTag`, and `slugFileName`. Do not re-export the moved module.

- [ ] **Step 3: Update public imports**

In `app/blog/[slug]/page.tsx`, import `buildArticleContent` and `type TocHeading` from `@/src/lib/article-content`; keep `formatArticleDate` and `formatReadTime` from the component module. In `ArticleSidebar.tsx`, import `type TocHeading` from `@/src/lib/article-content`.

- [ ] **Step 4: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/article-content.ts components/blog/detail/article-content.ts app/blog/[slug]/page.tsx components/blog/detail/ArticleSidebar.tsx
git commit -m "refactor: extract article content builder for reuse"
```

---

### Task 2: Add the admin-only preview action

**Files:**
- Modify: `src/actions/blog-post.ts`

**Interfaces:**
- Consumes: `buildArticleContent`, `TocHeading` from `@/src/lib/article-content`.
- Produces: `export async function previewBlogArticle(input: { body: string }): Promise<{ data?: { html: string; headings: TocHeading[] }; error?: string }>`

- [ ] **Step 1: Add the action**

At the top of `src/actions/blog-post.ts`, add `import { z } from "zod";` and the content-builder imports. Add a module-level schema:

```ts
const previewBodySchema = z.object({
  body: z.string().max(1_000_000, "Body is too large to preview"),
});
```

Add the exported action:

```ts
export async function previewBlogArticle(input: {
  body: string;
}): Promise<ActionResult<{ html: string; headings: TocHeading[] }>> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  try {
    const parsed = previewBodySchema.parse(input);
    return { data: buildArticleContent(parsed.body) };
  } catch (e) {
    return { error: actionError(e, "Failed to render preview") };
  }
}
```

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/actions/blog-post.ts
git commit -m "feat: add admin-only blog preview action"
```

---

### Task 3: Add shared dialog and body-editor primitives

**Files:**
- Create: `components/admin/editor/FullscreenDialog.tsx`
- Create: `components/admin/blog/BodyEditor.tsx`
- Modify: `components/admin/editor/EditorSection.tsx`

**Interfaces:**
- Produces:
  - `export function FullscreenDialog({ open, onClose, label, shortcut, children }: { open: boolean; onClose: () => void; label: string; shortcut?: boolean; children: ReactNode })`
  - `export type BodyMode = "visual" | "html"`
  - `export function BodyModeToggle({ mode, onChange }: { mode: BodyMode; onChange: (mode: BodyMode) => void })`
  - `export function BodyEditor({ content, onChange, mode, onModeChange, editorKey, tall, className }: { content: string; onChange: (html: string) => void; mode: BodyMode; onModeChange: (mode: BodyMode) => void; editorKey: number; tall?: boolean; className?: string })`
  - `EditorSection` accepts `actions?: ReactNode`.

- [ ] **Step 1: Implement `FullscreenDialog`**

Use a ref to the native `<dialog>`. On `open` true call `dialog.showModal()` only when `!dialog.open`; on false call `dialog.close()` when open. Set `document.body.style.overflow = "hidden"` while open and restore it in cleanup. Render children only when `open` so embedded editors remount with fresh content. Set `data-editor-shortcut={shortcut ? "allow" : undefined}` and `aria-label={label}`. Class:

```text
fixed inset-0 z-50 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-background p-0 text-foreground backdrop:bg-foreground/60 open:flex open:flex-col
```

Wire `onClose` to the dialog's `onClose` event so `Esc` notifies the parent.

- [ ] **Step 2: Implement `BodyEditor` and `BodyModeToggle`**

`BodyModeToggle` renders two `<button type="button">` controls inside a `role="group" aria-label="Body editing mode"` wrapper with a 2px `border-line`; the active option uses `bg-foreground text-background`, inactive uses `text-muted hover:bg-admin-wash`. Both set `aria-pressed`.

`BodyEditor` renders the toggle row (with a right-aligned `font-jet` status: `Visual editor · exports HTML` or `${content.length.toLocaleString()} chars`) and then:

- Visual: `LexKitEditor` loaded with `next/dynamic(..., { ssr: false })`, keyed by `editorKey`. In `tall` mode add `[&_[contenteditable=true]]:min-h-[calc(100dvh-20rem)]` to the wrapper.
- HTML: a `<textarea>` with `value={content}`, `onChange={(e) => onChange(e.target.value)}`, `spellCheck={false}`, `autoCapitalize="off"`, `autoCorrect="off"`, `aria-label="Body HTML source"`, and class `min-h-[420px] w-full resize-y border-2 border-line bg-background px-3 py-3 font-jet text-[12px] leading-6 text-foreground outline-none transition-colors focus:border-foreground`; in `tall` mode use `min-h-[calc(100dvh-22rem)]` instead of `min-h-[420px]`.

- [ ] **Step 3: Add the `actions` slot to `EditorSection`**

Add `actions?: ReactNode` to the props. In the header, wrap `meta` and `actions` in a right-aligned flex container; render `meta` as the existing `<span>` and `actions` after it. Keep the current appearance when neither is present.

- [ ] **Step 4: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add components/admin/editor/FullscreenDialog.tsx components/admin/blog/BodyEditor.tsx components/admin/editor/EditorSection.tsx
git commit -m "feat: add fullscreen dialog and body editor modes"
```

---

### Task 4: Wire body modes and Focus mode into `BlogForm`

**Files:**
- Create: `components/admin/blog/FocusEditor.tsx`
- Modify: `components/admin/BlogForm.tsx`
- Modify: `components/admin/editor/EditorShell.tsx:49-61`

**Interfaces:**
- Consumes: `BodyEditor`, `BodyMode`, `BodyModeToggle`, `FullscreenDialog`.
- Produces: `FocusEditor({ open, onClose, title, body, onBodyChange, mode, onModeChange, editorKey, readTime, wordCount, bodyFormat, saving, error })`.

- [ ] **Step 1: Implement `FocusEditor`**

Render `FullscreenDialog` with `shortcut` set. Header: `Focus // Body` label, truncated article title, word count and read time chips, and an `Exit focus` button (`aria-label="Exit focus mode"`). Main: `<BodyEditor tall ... />` inside a `min-h-0 flex-1 overflow-y-auto` container. Footer: show the form `error` when present in a bordered alert, then `Exit focus` (secondary) and `Save` (`type="submit"`, primary, disabled while saving, with a spinner when saving). Use the existing `editorButtonSecondaryClass` and `editorButtonPrimaryClass` from `EditorHeader`.

- [ ] **Step 2: Update `BlogForm` state and payload**

Replace the fixed `bodyFormat` with `useState<"html" | "markdown">(post?.bodyFormat === "markdown" ? "markdown" : "html")`. Add `bodyMode`, `focusOpen`, `editorEpoch`, and `previewOpen` (preview state can be added here but wired in Task 5). Add:

```ts
function handleBodyChange(value: string) {
  setBody(value);
  setBodyFormat("html");
}

function handleFocusClose() {
  setFocusOpen(false);
  setEditorEpoch((n) => n + 1);
}
```

Use the state value in the submit payload. Remove the `dynamic` import and the `LexKitEditor` constant from `BlogForm` (they move to `BodyEditor`).

- [ ] **Step 3: Replace the Body section**

Use `<EditorSection index="04" title="Body" meta={bodyFormat === "markdown" ? "Markdown (legacy)" : "HTML"} actions={<Focus button>}>`. The Focus button is `type="button"`, uses a compact `h-7 border border-line bg-surface px-2 font-jet text-[8px] font-bold uppercase tracking-[.08em]` style with a `Maximize2` icon, and calls `setFocusOpen(true)`.

Inside `<EditorField label="Body" required hint={...}>`:

- Show a `bodyFormat === "markdown"` notice: `This record is stored as Markdown. Editing the body will save it as HTML.` Style it as a bordered `bg-admin-wash` mono note.
- Render `<BodyEditor content={body} onChange={handleBodyChange} mode={bodyMode} onModeChange={setBodyMode} editorKey={editorEpoch} />`.
- Hint text: visual → `Visual editor. Saved as ${bodyFormat.toUpperCase()}. Read time and word count update automatically.`; HTML → `Raw HTML source. Saved as ${bodyFormat.toUpperCase()}. Public output is sanitized on render.`
- Do not pass an `id` to `EditorField`; the textarea and group provide their own labels.

Render `<FocusEditor ... />` inside the `EditorShell` children, after the Body section, with `open={focusOpen}`, `onClose={handleFocusClose}`, `title`, `body`, `onBodyChange={handleBodyChange}`, `mode`, `onModeChange={setBodyMode}`, `editorKey={editorEpoch}`, `readTime={computedReadTime}`, `wordCount={words}`, `bodyFormat`, `saving`, and `error`.

- [ ] **Step 4: Narrow the Ctrl/Cmd+S guard**

In `EditorShell`, replace the `!document.querySelector("dialog[open]")` condition with a check that ignores dialogs marked `data-editor-shortcut="allow"`:

```ts
const blockingDialog = document.querySelector(
  "dialog[open]:not([data-editor-shortcut='allow'])"
);
if (!saving && !blockingDialog) formRef.current?.requestSubmit();
```

- [ ] **Step 5: Verify**

Run: `pnpm exec tsc --noEmit && pnpm run lint`
Expected: no errors and no new warnings.

- [ ] **Step 6: Commit**

```bash
git add components/admin/blog/FocusEditor.tsx components/admin/BlogForm.tsx components/admin/editor/EditorShell.tsx
git commit -m "feat: add focus mode and HTML body editing"
```

---

### Task 5: Add the full article preview

**Files:**
- Create: `components/admin/blog/PreviewArticle.tsx`
- Modify: `components/admin/editor/EditorHeader.tsx`
- Modify: `components/blog/detail/ArticleSidebar.tsx`
- Modify: `components/admin/BlogForm.tsx`
- Modify: `app/admin/blog/new/page.tsx`
- Modify: `app/admin/blog/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: `previewBlogArticle`, `TocHeading`, `ArticleHeader`, `ArticleFigure`, `ArticleSidebar`, `formatArticleDate`, `formatReadTime`, `FullscreenDialog`.
- Produces:
  - `export function PreviewArticle({ open, onClose, title, slug, excerpt, category, tags, thumbnail, body, readTime, publishedAt, isVisible, bodyFormat, publicHref, author })`
  - `EditorHeaderActions` accepts `onPreview?: () => void` and `previewLabel?: string`.
  - `ArticleSidebar` accepts `scrollRootRef?: RefObject<HTMLElement | null>`.
  - `BlogForm` accepts `previewAuthor?: { name: string; role: string; bio: string; githubUrl?: string }`.

- [ ] **Step 1: Implement `PreviewArticle`**

Use `FullscreenDialog` without `shortcut`. On `open` and `body` change, call `previewBlogArticle({ body })`; track `loading`, `error`, and a `reload` counter for a Retry button. Reset preview data when opening.

Header bar: `Preview` chip, `Published`/`Draft` chip, `/blog/{slug || "your-slug"}`, an `Open saved page ↗` link when `publicHref` exists, and a labelled close button. Main area scrolls (`min-h-0 flex-1 overflow-y-auto`) and renders the public article shell in this order:

```tsx
<ArticleHeader title={title || "Untitled post"} slug={slug} excerpt={excerpt} category={category || "Article"} date={formatArticleDate(publishedAt)} readTime={formatReadTime(readTime)} author={author.name} format={bodyFormat.toUpperCase()} />
<ArticleFigure title={...} slug={...} category={...} tags={tags} date={...} readTime={...} author={author.name} authorRole={author.role} thumbnail={thumbnail} />
```

Then the public two-column section (`px-[5.5vw] py-16 max-md:py-10`, `grid grid-cols-1 gap-8 lg:grid-cols-12`) with `<article className="min-w-0 lg:col-span-8">` containing either a `role="status"` skeleton, a bordered error with Retry, or `<div id="article-body" className="article-prose prose-content" dangerouslySetInnerHTML={{ __html: data.html }} />`. Render `<ArticleSidebar headings={...} readTime={formatReadTime(readTime)} context={[...]} scrollRootRef={scrollRef} />` with fallback heading `[{ id: "article-body", label: "Article Overview" }]` when there are no headings. Attach `scrollRef` to the scrolling main container.

- [ ] **Step 2: Scope sidebar scroll tracking**

In `ArticleSidebar`, add `scrollRootRef?: RefObject<HTMLElement | null>`. In the effect, choose the scroll target: the ref's element when present, otherwise `window`. Attach the scroll listener to that target and branch cleanup to avoid union-type overload errors. When a scroll root exists, compute the heading offset as `scrollRoot.getBoundingClientRect().top + 120`; otherwise keep `120`. Keep the `window` resize listener.

- [ ] **Step 3: Add the header Preview action**

In `EditorHeaderActions`, add optional `onPreview` and `previewLabel`. When provided, render a secondary button (`editorButtonSecondaryClass`) between the public link and the submit button, with an `Eye` icon and `previewLabel ?? "Preview"`, disabled while saving.

- [ ] **Step 4: Wire `BlogForm` and pages**

Add `previewAuthor` to `BlogForm` props with defaults matching the public page (`Andika`, `Software Engineer`, the existing bio fallback). Pass `onPreview={() => setPreviewOpen(true)}` to `EditorHeaderActions`. Render `<PreviewArticle ... />` inside the `EditorShell` children with the current form values, `publicHref={isEdit && slug ? `/blog/${slug}` : null}`, and `author={previewAuthor}`.

Update `new/page.tsx` to be async, call `getSiteSettings()`, and pass `previewAuthor`. Update `edit/page.tsx` similarly after loading the post. Use the public page's fallbacks for name, role, and bio.

- [ ] **Step 5: Verify**

Run: `pnpm exec tsc --noEmit && pnpm run lint`
Expected: no errors and no new warnings.

- [ ] **Step 6: Commit**

```bash
git add components/admin/blog/PreviewArticle.tsx components/admin/editor/EditorHeader.tsx components/blog/detail/ArticleSidebar.tsx components/admin/BlogForm.tsx app/admin/blog/new/page.tsx app/admin/blog/[id]/edit/page.tsx
git commit -m "feat: add full article preview to blog editor"
```

---

### Task 6: Final verification and documentation

**Files:**
- Modify: `docs/design-system.md` only if it has an admin editor component section that needs the new patterns.

- [ ] **Step 1: Run the full checks**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm run lint`
Expected: no errors and no new warnings.

Run: `pnpm run build`
Expected: successful production build.

- [ ] **Step 2: Manual checks with `pnpm dev`**

Verify on `/admin/blog/new`:

1. Visual mode edits and saves as HTML.
2. HTML mode accepts pasted raw HTML, preserves it on save, and Visual mode renders it after switching.
3. Focus mode opens full-screen, `Esc` exits, `Ctrl/Cmd+S` saves, and the inline editor shows focus-mode edits after exit.
4. Preview shows unsaved title, excerpt, thumbnail, body, and TOC, and renders sanitized output.
5. The markdown legacy notice appears when editing a seeded article.
6. At 320 px width, no horizontal page overflow; overlay controls remain reachable.

- [ ] **Step 3: Report**

Summarize changed files, decisions, checks run, and any manual checks that could not be performed.

---

## Self-Review Notes

- Spec coverage: HTML mode (Tasks 3–4), focus mode (Task 4), preview (Tasks 1–2, 5), security (Task 2), legacy format (Task 4), a11y/responsive (Tasks 3–5), verification (Task 6).
- Type consistency: `BodyMode`, `editorKey`, `previewBlogArticle`, `TocHeading`, `scrollRootRef`, and `previewAuthor` are defined once and reused with the same names.
- The content builder is not re-exported through a client-imported module, keeping `sanitize-html` server-side.
