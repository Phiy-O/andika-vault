# Blog Body Editor — HTML Mode, Focus Mode, and Full Preview

- **Date:** 2026-11-20
- **Status:** Approved for implementation
- **Scope:** Admin blog create/edit form (`/admin/blog/new`, `/admin/blog/[id]/edit`)

## Intent

The blog form currently exposes only the LexKit visual editor. The owner cannot
inspect or paste the raw HTML that will be stored, cannot write in a
distraction-free full-screen surface, and cannot see the complete rendered
article before saving. The request is to author articles in HTML and to see the
whole article while creating it.

## Goals

1. Add a `Visual / HTML` switch to the Body section. HTML mode edits the exact
   source string that will be saved.
2. Save newly created or edited bodies as `bodyFormat: "html"`. Legacy markdown
   records keep `"markdown"` until their body is actually edited.
3. Add a full-screen Focus mode for writing, with the same Visual/HTML switch.
4. Add a full-screen rendered preview of the current, unsaved article that
   matches `/blog/[slug]`.
5. Reuse the public article components and the production sanitizer so preview
   and published output cannot drift.
6. Keep the admin design language, keyboard access, and server-side
   authorization.

## Non-Goals

- A Markdown editing mode or Markdown-to-HTML conversion UI.
- Syntax highlighting, HTML linting, or auto-formatting in HTML mode.
- Persisting previews, draft snapshots, or autosave.
- Changes to the public article page layout or typography.
- New rich-text editor capabilities.

## Approaches Considered

### HTML authoring

- **Replace the rich editor with a raw HTML textarea.** Simplest, but removes
  the formatting workflow and makes routine edits harder.
- **Add a Visual/HTML toggle (chosen).** Keeps the LexKit workflow and adds a
  source view. Switching to Visual re-imports the current HTML so both views
  describe the same content.
- **Separate full-document HTML editor.** Rejected: the body is a fragment, and
  a full document would break the public article shell.

### Full-width writing

- **Expand the body section in place.** Less code, but the page still scrolls
  and the metadata rail remains present.
- **Full-screen native dialog (chosen).** Focused writing surface, native focus
  trap and `Esc`, no layout jump. Content stays in the form state, so exiting
  never discards work.
- **Dedicated focus route.** Rejected as unnecessary navigation and state
  duplication.

### Full article preview

- **Link to the saved public page.** Cannot show unsaved changes.
- **Client-side conversion with `sanitize-html`.** Instant, but ships the
  sanitizer to the admin bundle and risks output drift.
- **Admin-guarded server action plus public components (chosen).** Runs the same
  `buildArticleContent` conversion and sanitizer as the public page, returns
  sanitized HTML and heading IDs, and keeps the heavy dependency on the server.

## Design

### Body modes

`BlogForm` owns:

- `body` — the source string.
- `bodyMode` — `"visual" | "html"`.
- `bodyFormat` — `"html" | "markdown"`, initialized from the record.
- `editorEpoch` — a counter used to remount the visual editor after an
  out-of-band body change (HTML mode, focus mode, preview close).

A new `BodyEditor` client component renders:

- A segmented `Visual / HTML` control with `aria-pressed`.
- The existing `LexKitEditor` in Visual mode.
- A monospace `<textarea>` in HTML mode with spellcheck off, a character count,
  and the same focus border treatment as the visual editor.

Rules:

- New records start in Visual mode and save `bodyFormat: "html"`.
- Editing a body through Visual mode sets `bodyFormat: "html"` because LexKit
  exports HTML.
- Editing through HTML mode sets `bodyFormat: "html"`.
- A legacy markdown record shows a short note: it is stored as Markdown and any
  body edit will save it as HTML.
- The hint under the field reflects the active mode.

### Focus mode

A `FocusEditor` client component wraps a native `<dialog>` rendered inside the
form. It contains:

- A compact header: record title, `Visual / HTML` control, word count, read
  time, and an exit button.
- The shared `BodyEditor` filling the viewport.
- A footer with `Exit focus` and `Save` actions.

Behavior:

- Opening locks body scroll; closing restores it.
- `Esc` closes without discarding state.
- `Ctrl/Cmd + S` submits the form while focus mode is open. `EditorShell`'s
  existing shortcut guard is narrowed so only blocking dialogs (confirm/delete)
  suppress the shortcut.
- Closing focus mode increments `editorEpoch` so the inline editor remounts with
  the latest body.

### Full preview

A `PreviewArticle` client component renders a native full-screen dialog:

- Header bar: `Preview`, draft/published status, close button, and an optional
  `Open public page` link when the record has a saved slug.
- Body: the real `ArticleHeader`, `ArticleFigure`, article prose container, and
  `ArticleSidebar` in the public page's layout and colors.
- Preview content is loaded from a new `previewBlogArticle` server action.

Server action:

- `requireAdmin()` first.
- Zod-validates a `{ body: string }` payload with a sane maximum length.
- Calls the same pure `buildArticleContent` used by the public page.
- Returns `{ data: { html, headings } }` or `{ error }` in the established
  action-response shape.
- Never writes to the database.

`buildArticleContent` and `TocHeading` move to `src/lib/article-content.ts`.
The public article page and the sidebar type import are updated to the new
module. There is deliberately no re-export from
`components/blog/detail/article-content.ts`: the preview renders public
components on the client, and a re-export would pull `sanitize-html` into the
admin client bundle.

### Shared component changes

- `EditorSection` gains an optional `actions?: ReactNode` slot in its header so
  the Body section can host the `Focus` control without abusing `meta`. The
  full preview lives in the page header actions, next to `View Article`.
- `EditorShell`'s shortcut guard ignores the focus dialog via a data attribute.
- `ArticleSidebar`'s heading tracking is scoped to the preview dialog: it
  currently listens to `window` scroll, so the preview passes a scroll container
  or the component is given an optional scroll root. If scoping proves invasive,
  the preview renders the sidebar without active-section tracking.

### Accessibility and responsive behavior

- Native dialogs provide focus trapping and `Esc`; visible close buttons carry
  `aria-label`.
- All mode switches are real buttons with pressed state.
- HTML textarea is labelled and keyboard operable.
- Focus and preview layouts use full viewport height with internal scrolling;
  controls stay reachable at 320 px and up.
- Preview prose keeps the public article's contrast and reading measure.
- Motion is limited to existing border/shadow transitions and respects reduced
  motion.

### Security

- Preview requires an admin session on the server.
- Preview HTML passes through `sanitizeContent` exactly like the public page.
- HTML mode does not bypass public rendering sanitization.
- No secrets, database writes, or client-trusted roles are introduced.

## Files Expected to Change

- `components/admin/BlogForm.tsx`
- `components/admin/editor/EditorSection.tsx`
- `components/admin/editor/EditorShell.tsx`
- `components/admin/blog/BodyEditor.tsx` (new)
- `components/admin/blog/FocusEditor.tsx` (new)
- `components/admin/blog/PreviewArticle.tsx` (new)
- `src/actions/blog-post.ts`
- `src/lib/article-content.ts` (new)
- `components/blog/detail/article-content.ts` (remove moved helpers)
- `components/blog/detail/ArticleSidebar.tsx` (optional scroll root, type import)
- `app/blog/[slug]/page.tsx` (import path)
- `app/admin/blog/new/page.tsx` and `app/admin/blog/[id]/edit/page.tsx` (preview author settings)
- `components/admin/editor/FullscreenDialog.tsx` (new)
- `components/admin/editor/EditorHeader.tsx` (Preview action)

## Verification

- `pnpm exec tsc --noEmit`
- `pnpm run lint`
- `pnpm run build`
- Manual checks: create with HTML, switch modes without data loss, focus mode
  with `Esc` and `Ctrl/Cmd+S`, preview unsaved changes, mobile widths, keyboard
  tab order, and a markdown legacy record.
