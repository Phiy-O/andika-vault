# Editor Tools Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent Backspace from deleting a table from the paragraph below it, replace the manual image URL prompt with local file upload plus clipboard paste through Cloudinary, and remove the HTML Embed toolbar button.

**Architecture:** Extract the existing client upload logic into `src/lib/upload-image.ts`. Configure LexKit's existing `imageExtension` with that handler and a file input. Register a high-priority `KEY_BACKSPACE_COMMAND` guard in `LexKitEditor`. Keep the HTML Embed extension registered but remove its toolbar button.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, LexKit/Lexical, Cloudinary signed uploads.

**Spec:** `docs/superpowers/specs/2026-11-20-editor-tools-fix-design.md`

## Global Constraints

- Preserve existing Cloudinary signed-upload security: signature comes from `/api/cloudinary/signature`; the secret never reaches the client.
- Preserve auth, validation, sanitization, and public article rendering.
- Do not add dependencies, routes, or schema changes.
- Do not change table cell Backspace behavior or normal text deletion.
- Repository has no test runner; verification is `tsc`, targeted ESLint, and browser smoke.

## Review Focus

- Backspace in the empty paragraph below a table leaves the table intact.
- Normal Backspace deletion in text and inside table cells still works.
- Insert Image opens a file picker; selecting a file inserts an image with a Cloudinary `src`.
- Pasting a copied image inserts/uploads it.
- HTML Embed toolbar button is removed; existing embeds still render.

---

### Task 1: Extract the shared Cloudinary upload helper

**Files:**
- Add: `src/lib/upload-image.ts`
- Modify: `components/admin/ImageUploader.tsx`

**Interfaces:**
- Produces: `export async function uploadImageFile(file: File): Promise<string>` and `export const ACCEPTED_IMAGE_TYPES: readonly string[]`, `export const MAX_IMAGE_SIZE_MB = 5`.

- [ ] **Step 1: Create the helper**

Move the existing constants and `handleFile` upload body from `ImageUploader` into `src/lib/upload-image.ts`:

```ts
"use client";

export const MAX_IMAGE_SIZE_MB = 5;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
] as const;

export function isAcceptedImage(file: File): boolean {
  return ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number]);
}

export async function uploadImageFile(file: File): Promise<string> {
  if (!isAcceptedImage(file)) throw new Error("Unsupported image type");
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    throw new Error(`Image must be ${MAX_IMAGE_SIZE_MB}MB or smaller`);
  }

  const sigRes = await fetch("/api/cloudinary/signature");
  if (!sigRes.ok) throw new Error("Session expired, please sign in again");
  const sig = await sigRes.json();

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", String(sig.timestamp));
  form.append("signature", sig.signature);
  form.append("folder", sig.folder);
  form.append("resource_type", sig.resourceType ?? "image");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    { method: "POST", body: form }
  );
  if (!res.ok) throw new Error("Upload failed, please try again");

  const data = await res.json();
  return data.secure_url as string;
}
```

Keep all behavior identical to the existing `ImageUploader` upload path.

- [ ] **Step 2: Refactor ImageUploader to use it**

In `ImageUploader.tsx`, import `uploadImageFile`, `ACCEPTED_IMAGE_TYPES`, `MAX_IMAGE_SIZE_MB`, and `isAcceptedImage`. Replace the local constants and the fetch/signature block in `handleFile` with:

```ts
const url = await uploadImageFile(file);
onChange(url);
```

Keep the existing user-facing Indonesian error messages by mapping helper errors, or keep validation in `ImageUploader` and call the helper only for the upload. Do not change the component's visible behavior.

- [ ] **Step 3: Verify TypeScript**

Run: `pnpm exec tsc --noEmit`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/lib/upload-image.ts components/admin/ImageUploader.tsx
git commit -m "refactor: extract shared Cloudinary image upload helper"
```

---

### Task 2: Replace image URL prompt with file picker and paste

**Files:**
- Modify: `components/admin/LexKitEditor.tsx`

**Interfaces:**
- Consumes: `uploadImageFile` from Task 1.
- Produces: no new exported API.

- [ ] **Step 1: Configure the image extension**

In the extension list, replace `imageExtension,` with:

```ts
imageExtension.configure({
    uploadHandler: uploadImageFile,
    forceUpload: true,
    pasteListener: { insert: true, replace: true },
}),
```

- [ ] **Step 2: Remove the prompt state and Modal**

Delete:
- the `Modal` import,
- the `prompt` state,
- `addImage` and `submitPrompt`,
- the `<Modal>` URL prompt block near the end of the JSX,
- the `CodeXml` icon import if it becomes unused after the next step.

- [ ] **Step 3: Add a hidden file input and file-picker action**

Add `const fileInputRef = useRef<HTMLInputElement>(null);` and replace the old `addImage` callback with:

```ts
const pickImage = useCallback(() => {
    fileInputRef.current?.click();
}, []);
```

Render near the end of the editor JSX:

```tsx
<input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(event) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadError("");
            commands.insertImage({ file, alt: "" });
        }
        event.target.value = "";
    }}
/>
```

- [ ] **Step 4: Add an inline upload error**

Add `const [uploadError, setUploadError] = useState("");`. In the image-extension config, wrap the upload handler:

```ts
uploadHandler: (file) =>
    uploadImageFile(file).catch((error) => {
        setUploadError(error instanceof Error ? error.message : "Image upload failed");
        throw error;
    }),
```

Render a small alert above the toolbar when `uploadError` is non-empty. Clear it when a new file is picked.

- [ ] **Step 5: Remove the HTML Embed toolbar button**

Delete the `HTML Embed` `TbBtn` from the insert group. Keep `htmlEmbedExtension` in the extension array so existing embeds still render.

- [ ] **Step 6: Verify TypeScript and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no output.

Run: `pnpm exec eslint components/admin/LexKitEditor.tsx components/admin/ImageUploader.tsx src/lib/upload-image.ts`
Expected: no output.

- [ ] **Step 7: Commit**

```bash
git add components/admin/LexKitEditor.tsx
git commit -m "feat: add image file picker and paste, remove embed tool"
```

---

### Task 3: Guard Backspace at the table boundary

**Files:**
- Modify: `components/admin/LexKitEditor.tsx`

**Interfaces:**
- Consumes: `KEY_BACKSPACE_COMMAND`, `COMMAND_PRIORITY_EDITOR`, `$getSelection`, `$isRangeSelection` (all already imported or to be added from `lexical`).

- [ ] **Step 1: Register the guard**

Add to `EditorShell` next to the existing Tab effect:

```ts
useEffect(() => {
    if (!editor) return;

    return editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        (event) => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection) || !selection.isCollapsed()) return false;
            if (selection.anchor.offset !== 0) return false;

            const anchorNode = selection.anchor.getNode();
            const element = anchorNode.getTopLevelElement();
            if (!element || element.getType() !== "paragraph") return false;

            const previous = element.getPreviousSibling();
            if (!previous || previous.getType() !== "table") return false;

            event.preventDefault();
            return true;
        },
        COMMAND_PRIORITY_EDITOR
    );
}, [editor]);
```

Do not modify the table extension or Lexical defaults. All non-boundary Backspace cases must return `false`.

- [ ] **Step 2: Verify TypeScript and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no output.

Run: `pnpm exec eslint components/admin/LexKitEditor.tsx`
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add components/admin/LexKitEditor.tsx
git commit -m "fix: prevent Backspace from deleting a table"
```

---

### Task 4: Verify the workflow end to end

**Files:**
- No code changes expected.

- [ ] **Step 1: Run full type check**

Run: `pnpm exec tsc --noEmit`
Expected: no output.

- [ ] **Step 2: Run targeted lint**

Run: `pnpm exec eslint components/admin/LexKitEditor.tsx components/admin/ImageUploader.tsx src/lib/upload-image.ts`
Expected: no output.

- [ ] **Step 3: Browser smoke check**

Using a temporary route that mounts the real `BlogForm`, verify:
- Insert a table, place the caret in the empty paragraph below it, press Backspace — the table remains.
- Backspace still deletes normal text and works inside table cells.
- Insert Image opens a file input instead of a URL prompt.
- Selecting an image file inserts an `<img>` whose `src` becomes a Cloudinary URL.
- Pasting a copied image inserts/uploads it.
- The HTML Embed button is gone and existing embeds still render.

- [ ] **Step 4: Report**

Summarize changed files, verification output, and any checks that could not be performed.

---

## Self-Review

**Spec coverage:** Backspace guard, file picker + paste upload, and embed-tool removal are covered by Tasks 1–4. Non-goals are respected.

**Step scan:** Each step names exact files, symbols, and commands. No TBDs.

**Type consistency:** `uploadImageFile` is produced in Task 1 and consumed in Task 2. `KEY_BACKSPACE_COMMAND` is imported and used in Task 3.

**Review Focus:** All five behaviors are covered by the Task 4 browser smoke checks.
