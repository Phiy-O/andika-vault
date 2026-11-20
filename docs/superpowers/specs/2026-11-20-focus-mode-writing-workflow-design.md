# Focus Mode Writing Workflow — Design

Date: 2026-11-20
Status: Awaiting approval

## Intent

Make the blog editor's Focus mode behave like Blogger's post-writing screen: write the title and body in one place, preview the unsaved article, and save without leaving Focus. Keep the existing fullscreen modal and the project's neobrutalist visual language.

## Goals

- Edit the post title inside Focus mode.
- Put Exit, Preview, and Save in the Focus top bar.
- Preview the current unsaved draft over Focus mode and return to the same writing position.
- Keep `Esc` to exit and `Ctrl/Cmd + S` to save.
- Preserve all existing form state, validation, authorization, and sanitization.

## Non-goals

- No right settings rail for labels, permalink, date, or visibility. Those stay in the main form.
- No dedicated `/focus` route or draft persistence across reloads.
- No new LexKit editor capabilities.
- No changes to public article rendering.

## Approaches Considered

1. **Writing workflow inside the existing fullscreen modal (picked).** Keeps one React state tree, so unsaved title/body edits cannot be lost during navigation. The native dialog already provides focus trapping and `Esc`. Preview can layer above it without unmounting the editor.
2. **Full Blogger workspace with a settings rail.** Adds labels, permalink, date, and visibility inside Focus. More useful for finishing a post end-to-end, but duplicates the main form's controls and grows the change beyond the requested writing workflow.
3. **Dedicated Focus page.** Gives a real URL and browser-back behavior, but requires lifting or persisting the draft, handling refresh/back/forward, and guarding unsaved state. The added complexity is not justified for a single-author admin.

Option 1 was picked because it delivers the Blogger behavior the user asked for while preserving the current design and avoiding draft-state duplication.

## Design

### Top bar

- Left: `Exit` button with a back arrow, `Focus // Write` eyebrow, body-format label, and a read-only `Draft`/`Published` chip.
- Right: word count, read time, `Preview`, and `Save`.
- `Save` uses the existing form submit, is disabled while saving or while required fields are incomplete, and shows the existing spinner/label.
- The footer keeps the error message, keyboard hint, and incomplete-fields warning. Duplicate Exit/Save buttons are removed from the footer.

### Title

- A large editorial input sits at the top of the scrollable writing area, above the body editor.
- It is wired to the existing `handleTitleChange`, so creating a new post still auto-generates the slug.
- `Enter` in the title input does not submit the form.
- The input is labelled for assistive technology and marked required via `aria-required`.
- The title input receives focus when Focus opens.

### Preview over Focus

- The Focus `Preview` action opens the existing `PreviewArticle` dialog while Focus remains mounted.
- `PreviewArticle` is rendered after `FocusEditor`, so its native dialog stacks above Focus.
- `FullscreenDialog` gets a shared body-scroll lock counter so closing Preview does not unlock scrolling behind Focus.
- Preview keeps its current read-only shortcut behavior: `Ctrl/Cmd + S` is ignored while Preview is open.
- Closing Preview returns focus to the Focus dialog with the editor and cursor position intact.

### Responsive and accessibility

- The top bar wraps on narrow screens; the title scales down; the body keeps its existing tall editor height.
- All new controls have visible focus states and accessible labels.
- The dialog keeps its existing `aria-label` and native focus trap.

## Files Expected to Change

- `components/admin/blog/FocusEditor.tsx` — top bar, title input, preview/save actions, footer cleanup.
- `components/admin/BlogForm.tsx` — pass title change, preview, and visibility props.
- `components/admin/editor/FullscreenDialog.tsx` — shared scroll-lock counter for stacked dialogs.

## Verification

- `pnpm exec tsc --noEmit`
- Targeted `pnpm exec eslint` on changed files
- Browser smoke test: open Focus, edit title/body, open Preview, close Preview, save.

No test framework exists in the repository, so verification is type-checking, lint, and manual/browser checks.
