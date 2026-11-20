# Editor Tools Fix — Table Backspace, Image Upload, HTML Embed Removal

Date: 2026-11-20
Status: Approved and implemented

## Intent

Fix three editor-tool problems: a table disappearing when Backspace is pressed in the empty paragraph below it, an Insert Image control that only accepts a manually pasted URL, and an HTML Embed toolbar button the owner does not want.

## Goals

- Backspace at the start of the empty paragraph directly below a table must not delete the table.
- Insert Image opens the local device file picker and uploads through the existing signed Cloudinary flow.
- Copying an image from a browser (e.g. Google Images) and pasting it into the editor uploads it to Cloudinary and inserts it.
- Remove the HTML Embed toolbar button.
- Keep the existing neobrutalist admin styling, sanitization, auth, and public rendering.

## Non-goals

- No change to how existing HTML embeds render; the extension stays registered.
- No change to public article rendering or sanitization.
- No new dependencies or database/schema changes.
- No manual image-URL input in the editor toolbar.

## Root Cause Investigation

- Reproduced with the owner that the trigger is the empty paragraph directly below a table.
- LexKit does not register a table-specific Backspace deletion handler; its Backspace handler only removes a selected image node. The table loss comes from Lexical's default Backspace block-merging behavior when an empty top-level paragraph is removed and merged into the previous block (the table).
- Image upload infrastructure already exists: `/api/cloudinary/signature` issues signed upload params, and `ImageUploader` contains the client upload logic. LexKit's `imageExtension` already supports `uploadHandler`, `forceUpload`, and clipboard-image paste; it is currently unconfigured.

## Design

### Table Backspace guard

- In `LexKitEditor`, register `KEY_BACKSPACE_COMMAND` at `COMMAND_PRIORITY_EDITOR`.
- When the selection is collapsed at offset 0 of a top-level paragraph whose previous sibling's type is `"table"`, call `event.preventDefault()` and return `true` so the default merge cannot remove the table.
- All other Backspace cases return `false` and behave exactly as before (including normal text deletion inside table cells).
- Use the node's `getType() === "table"` string check instead of importing `@lexical/table` directly, avoiding a new direct dependency.

### Image handling

- Extract the Cloudinary client upload logic from `ImageUploader` into a small shared client helper (e.g. `src/lib/upload-image.ts`) that validates type/size, gets a signature, uploads, and returns `secure_url`.
- Reuse that helper in both `ImageUploader` and LexKitEditor.
- Configure `imageExtension` with:
  - `uploadHandler: uploadImageFile`
  - `forceUpload: true`
  - `pasteListener: { insert: true, replace: true }`
- Replace the URL prompt Modal with a hidden `<input type="file" accept="image/*">`. The toolbar button triggers the picker; on file selection, call `commands.insertImage({ file, alt: "" })`. LexKit inserts an object-URL placeholder immediately, then replaces it with the Cloudinary URL when the upload finishes.
- Clipboard image pastes are handled by LexKit's existing paste listener and go through the same upload handler.
- Remove the now-unused prompt state, URL input, `Modal` import, and link-prompt branch.
- Show upload failures in a small inline `role="alert"` inside the editor rather than silently failing.

### HTML Embed

- Remove only the `HTML Embed` toolbar button and its now-unused `CodeXml` icon import.
- Keep `htmlEmbedExtension` registered so previously saved embeds continue to render.

## Files Expected to Change

- `components/admin/LexKitEditor.tsx` — Backspace guard, image config, file picker, toolbar removal, inline error.
- `components/admin/ImageUploader.tsx` — use the shared upload helper.
- `src/lib/upload-image.ts` (new) — shared client-side Cloudinary upload helper.
- `docs/superpowers/specs/2026-11-20-editor-tools-fix-design.md` — this document.

## Revision After Review

The final review found that LexKit's built-in `uploadHandler` inserts a `blob:` image node before the upload completes and leaves that `blob:` persisted on failure, and that its paste path uploads the same file twice. The implementation therefore uploads first at the app level (file picker and a `PASTE_COMMAND` handler) and only inserts an image node with the returned Cloudinary URL. LexKit's own image paste listener is disabled. This keeps failed or in-flight uploads out of saved content and performs one upload per image.

## Verification

- `pnpm exec tsc --noEmit`
- Targeted `pnpm exec eslint` on changed files
- Browser smoke checks:
  - Create a table, click the empty paragraph below it, press Backspace — table remains.
  - Insert Image opens a file input; selecting a file inserts an `<img>` whose `src` becomes a Cloudinary URL.
  - Pasting an image uploads it and inserts it.
  - HTML Embed button is gone; existing embeds still render.
  - Normal Backspace text deletion still works.

No test framework exists, so verification is type-checking, lint, and manual/browser checks.
