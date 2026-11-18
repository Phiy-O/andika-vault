# Admin Editor Workspace - Design

Date: 2026-11-18
Status: Draft for approval
Scope: Admin create/edit pages for Projects, Articles, Achievements, Skills

## 1. Why this exists

The three admin list workspaces (Projects, Articles, Achievements) now follow the
studio design language: cream background, coral accent, 2px black borders,
offset shadows, Space Grotesk headings, and JetBrains Mono micro-labels.

The create and edit pages were never updated. They still use the old dark form
kit: `rounded-lg` controls, `#17151c` select backgrounds, purple focus rings,
plain stacked fields, and small page-level headings. Opening "New Project" from
the Projects workspace feels like leaving the product.

The admin design reference `Admin Project Editor - Portfolio Content Studio`
shows the intended editor experience: a status strip, a strong record header
with modes and actions, numbered section panels, and a right rail for
publishing, preview, and record metadata. That is the target.

## 2. Intent

Bring every admin create/edit page to the same visual and structural quality as
the management workspaces, using one shared editor kit so the four modules stay
consistent and future modules inherit the pattern.

## 3. Goals

- A shared `components/admin/editor/` kit used by all four modules.
- A predictable editor anatomy: status strip, record header, numbered sections,
  right rail, sticky action bar.
- Exact preservation of existing create/update behavior, payloads, endpoints,
  validation, auth, toasts, and redirects.
- Accurate adaptation to the real schema. No invented statuses, revisions,
  blocks, or autosave.
- Low-risk refinements that the theme and workflow invite: dirty-state feedback,
  unsaved-changes guard, Ctrl/Cmd+S, live record preview, character/word counts,
  better uploads, keyboard-accessible screenshot ordering.
- Responsive, accessible, and consistent at 1440, 1024, 768, and 390 widths.

## 4. Non-goals

- No database, Prisma, API route, server action, validation, or auth changes.
- No revision history, audit trail, block editor, autosave, or collaborative
  editing.
- No new "archived" or extra publishing states. `isVisible` remains the only
  public/draft switch.
- No changes to the list workspaces, public pages, sidebar, or navbar.
- No new dependencies.
- No rich-text upgrade for the project body. It stays an HTML/Markdown textarea.
- No dual "Save draft" / "Publish" buttons that silently change `isVisible`.
  Visibility stays an explicit control in the rail.

## 5. Anti-goals

- A cosmetic color swap that leaves four separate form implementations.
- Copying reference features that have no schema support.
- A generic dashboard form that loses the editorial studio character.
- Rounded cards, glassmorphism, gradients, or floating decorative elements.
- Changing working behavior while restyling it.

## 6. Constraints

- `AGENTS.md` layered architecture and security rules apply. This is a UI-only
  change; server authorization stays untouched.
- Admin tokens live in `.admin-shell` in `app/globals.css` and already provide
  the needed palette. No token changes are expected.
- LexKit must keep its dynamic client-only loading and HTML output.
- Cloudinary uploads must keep using `/api/cloudinary/signature` and the
  existing server-side cleanup behavior.
- The layout must work inside `AdminMain` (`max-w-[1500px]`, `px-4 sm:px-6`)
  under the 64px sticky `AdminNavbar`.
- `lib/prisma.ts` currently has an uncommitted build-pool fix. It is unrelated
  to this work and must not be included in editor commits.

## 7. Approaches considered

### A. Shared editor kit (chosen)

Build `components/admin/editor/` primitives and compose each module's form from
them. One shell, one set of controls, one action bar, module-specific sections
and previews.

Why: matches the existing `components/admin/workspace/` approach, gives the
reference's structure, and prevents the four forms from drifting again.

### B. Restyle each form in place

Only replace colors, radii, borders, and typography. Fast and low risk, but no
status strip, no section hierarchy, no rail, and four copies of layout logic.
Rejected because visual parity is the goal, not just color parity.

### C. Bespoke two-column layout per module

Build the full layout separately in each form. Reaches parity now, but creates
four copies of the same chrome. Rejected for maintenance cost.

## 8. Design

### 8.1 Page anatomy

Text sketch at desktop width:

```text
+----------------------------------------------------------------------------------+
| [SYNC READY] Workspace // Projects / Editor      [UNSAVED CHANGES] [EDIT MODE]    |
+----------------------------------------------------------------------------------+
| Editor // Projects / Record 04A2                                                  |
| Edit Project                                                            [actions] |
| Personal Portfolio Platform                                                       |
| /projects/personal-portfolio-platform   Updated today 14:32   Product             |
+-----------------------------------------------+----------------------------------+
| 01 // IDENTITY                                | 01 // PUBLISHING                  |
| +-------------------------------------------+ | Published        [switch]        |
| | Title *                                   | | Featured         [switch]        |
| | [_______________________________________] | | Sort order       [ 0 ]           |
| +-------------------------------------------+ |----------------------------------|
| 02 // CLASSIFICATION                          | 02 // PUBLIC PREVIEW              |
| +-------------------------------------------+ | [thumbnail]                       |
| | Category [Product v]  Format [HTML v]     | | PRODUCT / LIVE                    |
| | Tech stack [React] [Next.js] [+]          | | Personal Portfolio Platform       |
| +-------------------------------------------+ | ...                               |
| 03 // MEDIA & ASSETS                          | /projects/personal-portfolio-...  |
| ...                                           |----------------------------------|
| 04 // LINKS                                   | 03 // RECORD                      |
| ...                                           | Mode        EDIT                  |
| 05 // BODY                                    | ID          04A2                  |
| ...                                           | Updated     today 14:32           |
+-----------------------------------------------+----------------------------------+
| [UNSAVED] Ctrl/Cmd+S save                    [Cancel]   [Update Project]         |
+----------------------------------------------------------------------------------+
```

On screens below `xl`, the rail moves below the sections. On mobile, all
two-column field rows collapse to one column and the action bar spans the
viewport width inside the admin main area.

### 8.2 Status strip

Reuse the workspace status bar pattern so editors and workspaces feel related:

- Left: coral `SYNC READY` chip; `Workspace // <Module>`; `/ Editor`; record
  mode (`New record` or `Record 04A2`).
- Right: dirty state chip (`Unsaved changes` coral, `All changes saved` with a
  green dot), `Mode // New|Edit`, and a small `Live database` chip.
- `aria-live="polite"` on the dirty state.
- Same `min-h-11`, 2px border, surface background, 2px offset shadow as the
  workspace strip.

### 8.3 Record header

- Eyebrow: `Editor // <Module>` accent, `/`, `New record` or `Record {shortId}`.
- H1: `New Project`, `Edit Project`, `New Post`, `Edit Post`, `New Certificate`,
  `Edit Certificate`, `New Skill`, `Edit Skill`. Space Grotesk, 32-40px,
  tracking -0.05em, weight 700.
- Subtitle: one sentence. Create mode explains what the record is for; edit
  mode names the record. Example: `Update "Personal Portfolio Platform".`
- Metadata row: public path chip (`/projects/{slug}`), last updated relative
  (edit only), module context chip (category, read time, issuer, or skill
  category). Path chip includes a copy button.
- Actions: `Back to <module>` secondary, `View public page` secondary (edit
  only, disabled with an explanation when the record is not published or has no
  public route), primary submit (`Create Project` / `Update Project`, etc.).

### 8.4 Section panels

`EditorSection` renders a bordered surface panel with a header strip:

- Index square (`01`, `02`, ...) in inverse foreground/background, JetBrains
  Mono.
- Section label in Space Grotesk, uppercase, small.
- Right-side meta in JetBrains Mono: `REQUIRED FIELDS`, `OPTIONAL`, counts, or
  format hints.
- Content padded 16-20px, fields in one or two columns.

Section composition per module:

**Projects**

1. `01 // Identity` - title, slug with live public path hint, description with
   character count.
2. `02 // Classification` - category, body format, tech stack tag editor.
3. `03 // Media & Assets` - thumbnail (required), screenshots (0/10, reorder,
   remove, add).
4. `04 // External Links` - GitHub URL, live URL.
5. `05 // Body` - HTML/Markdown textarea with format hint and word count.

**Articles**

1. `01 // Identity` - title, slug, excerpt with character count.
2. `02 // Classification & Schedule` - category (preset + custom), published
   date, computed read time (read-only), tags.
3. `03 // Media` - thumbnail.
4. `04 // Body` - LexKit editor.

**Achievements**

1. `01 // Identity` - title, issuer, description with character count.
2. `02 // Credential` - issue date, credential URL.
3. `03 // Media` - certificate image.

**Skills**

1. `01 // Identity` - name, category.
2. `02 // Icon` - bordered icon grid with selected state and resolved icon path.

`sortOrder` and `isVisible` live in the rail, not in a section, for every
module. This keeps publishing controls in one predictable place.

### 8.5 Right rail

Three panels, each with a numbered header strip:

1. **Publishing**
   - `Published` switch mapped to `isVisible`, with `Published`/`Draft` chip and
     a one-line explanation.
   - `Featured` switch for Projects only.
   - `Sort order` numeric input with "Lower numbers appear first."
2. **Public preview**
   - A live card built from current form state, styled like a studio record
     card, not like the public hover card.
   - Projects: thumbnail, category, title, description, tech chips, public path.
   - Articles: thumbnail, category + read time, title, excerpt, public path.
   - Achievements: image or certificate placeholder, issuer + date, title,
     credential chip.
   - Skills: icon in a bordered square, name, category, "About page" note.
   - If `isVisible` is false, show a `DRAFT` overlay/badge and do not link out.
   - Empty states are intentional: "Add a thumbnail to preview this record."
3. **Record**
   - Definition rows: mode, short ID, created, updated. In create mode, show
     "Created when saved" instead of timestamps.
   - Articles also show read time and word count; Projects show screenshot count;
     Achievements show credential presence.

The rail is sticky at `top-[88px]` on `xl` (64px navbar + 24px breathing room)
and static below the sections on smaller screens.

### 8.6 Action bar

- Sticky to the bottom of the viewport while scrolling, in normal document flow.
- Left: dirty indicator and `Ctrl/Cmd + S` hint.
- Right: `Cancel` secondary and the primary submit.
- Solid background (no blur), 2px top border, matching horizontal padding.
- Buttons share the primary/secondary styles from the workspace header:
  2px border, offset shadow, hover translate, `motion-reduce` disabled.
- Saving state: disable both buttons, spinner in the primary, label
  `Saving...`; dirty indicator becomes `Saving changes`.
- Server error: form-level alert panel with `role="alert"` and a persistent
  "Save failed" chip in the action bar.

### 8.7 Component kit

New files under `components/admin/editor/`:

| File | Responsibility |
|---|---|
| `EditorShell.tsx` | `<form>` wrapper, status strip, grid layout, rail slot, action bar, save shortcut, dirty guard |
| `EditorHeader.tsx` | Eyebrow, title, subtitle, metadata chips, header actions |
| `EditorSection.tsx` | Numbered bordered section with header strip |
| `EditorRail.tsx` | Rail layout plus `EditorPanel` with numbered header |
| `EditorField.tsx` | Label, required marker, hint, counter, error slot; exported control classes |
| `EditorToggle.tsx` | Square neobrutalist switch with `role="switch"` and visible label |
| `EditorPreview.tsx` | Live record preview card and empty state |
| `useEditorState.ts` | Dirty snapshot, `beforeunload`, cancel confirmation, save shortcut helpers |

`EditorShell` props (shape, not final signature):

```ts
{
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  status: { section: string; mode: "new" | "edit"; recordId?: string };
  header: React.ReactNode;
  children: React.ReactNode;      // sections
  rail: React.ReactNode;          // panels
  actions: { submitLabel: string; saving: boolean; dirty: boolean };
  error?: string;
}
```

The four forms keep their state, effects, payload construction, and fetch calls.
Only their rendered structure changes. Duplicated local `Field` and `Toggle`
helpers are removed from all four forms.

### 8.8 Visual tokens

Use existing admin tokens only:

- Background `#faf6ee`, surface `#fffdf7`, wash `#f3ede3`.
- Foreground `#1b1b1b`, muted `#58413f`, line `#1b1b1b`.
- Accent `#f16b5e` (coral), deep accent `#a9362e`, success `#006c49`,
  alert `#b3261e`.
- Sans: Inter. Headings/buttons: Space Grotesk. Micro-labels/URLs: JetBrains
  Mono.
- Corners: square (`rounded-none`).
- Borders: 2px on panels and primary controls, 1px on nested chips.
- Shadows: 2-4px hard offsets, no soft shadows.
- Focus: existing global coral `:focus-visible` outline plus a foreground border
  change on controls.
- Primary button text uses foreground on coral, not white, to keep contrast.

### 8.9 Behavior details

**Dirty tracking**

- Serialize the initial form state once on mount; recompute a comparable
  snapshot on each render. `dirty = current !== initial`.
- Register `beforeunload` only while dirty and not saving.
- `Cancel` and header `Back` confirm before navigating when dirty.
- Do not intercept sidebar/navbar links globally. That would be surprising and
  brittle in the App Router.

**Keyboard save**

- Ctrl+S / Cmd+S calls `requestSubmit()` on the form, preventing the browser's
  save dialog. Ignored while saving.
- Shortcut hint is visible in the action bar.

**Preview**

- Pure client rendering from current state. No network, no sanitization changes.
- `next/image` previews use `unoptimized` like the existing uploader.
- Preview never blocks submit or validation.

**Validation and errors**

- Keep native `required` validation.
- Keep the same server error message handling. Because the API joins Zod issues
  into one string, errors stay at form level; no fake per-field mapping.
- On error, scroll the alert into view and keep all entered values.
- Keep existing toasts and redirects.

**Media**

- `ImageUploader` is restyled and gains drag-and-drop, a Replace action, and a
  visible Remove action. Upload path, size limit, accepted types, and cleanup
  semantics are unchanged.
- Thumbnail preview uses a 16:9 frame; certificate image uses a 4:3 frame.
- Screenshot rows keep drag reordering and gain keyboard-accessible
  Move up / Move down buttons. Remove still confirms. Max 10 is enforced in the
  UI and server schema.

**LexKit**

- Update only the chrome: cream surface, 2px border, square corners, toolbar
  wash, foreground text, coral active states. Remove `prose-invert` so article
  content is readable on the cream editor surface.
- Keep dynamic import, extension configuration, content initialization, focus
  guard, and HTML output unchanged.

### 8.10 Responsive and accessibility

- Grid: `xl:grid-cols-[minmax(0,1fr)_330px]`; sections and rail stack below xl.
- Field grids: two columns at `sm`, one column on mobile.
- No horizontal overflow from tags, URLs, or screenshot rows; long values
  truncate or wrap.
- Minimum 44px touch targets for switches, icon buttons, and screenshot
  controls.
- Sections use `<section aria-labelledby>`. Rail is `<aside>` with heading.
- Required fields keep `required` and a visible marker.
- Error alert uses `role="alert"`.
- Switches use `role="switch"`, `aria-checked`, and an associated visible label.
- Icons are decorative unless they carry meaning; icon-only buttons have
  `aria-label` and `title`.
- Respect `motion-reduce` for hover translation.
- Sticky action bar does not cover the final section; the form keeps bottom
  spacing and the bar remains in flow.

## 9. Files affected

New:

- `components/admin/editor/EditorShell.tsx`
- `components/admin/editor/EditorHeader.tsx`
- `components/admin/editor/EditorSection.tsx`
- `components/admin/editor/EditorRail.tsx`
- `components/admin/editor/EditorField.tsx`
- `components/admin/editor/EditorToggle.tsx`
- `components/admin/editor/EditorPreview.tsx`
- `components/admin/editor/useEditorState.ts`

Rewrite:

- `components/admin/ProjectForm.tsx`
- `components/admin/BlogForm.tsx`
- `components/admin/CertificateForm.tsx`
- `components/admin/SkillForm.tsx`

Update:

- `components/admin/ImageUploader.tsx` (visual + drag/drop + replace; same API)
- `components/admin/LexKitEditor.tsx` (chrome only)

Trim to form-only pages (header moves into `EditorShell`):

- `app/admin/projects/new/page.tsx`
- `app/admin/projects/[id]/edit/page.tsx`
- `app/admin/blog/new/page.tsx`
- `app/admin/blog/[id]/edit/page.tsx`
- `app/admin/certificates/new/page.tsx`
- `app/admin/certificates/[id]/edit/page.tsx`
- `app/admin/skills/new/page.tsx`
- `app/admin/skills/[id]/edit/page.tsx`

No changes to APIs, services, repositories, validations, schema, auth, or
`lib/prisma.ts`.

## 10. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Form regression while restructuring JSX | Keep state, payload construction, endpoint, method, toast, and redirect logic byte-for-byte where possible; diff payloads before completion |
| Dirty guard blocks legitimate navigation | Limit to `beforeunload` and explicit Cancel/Back; no global link interception |
| LexKit loses content or focus behavior | Only change class names and toolbar styles; keep initialization and listeners intact |
| Rail preview shows stale data | Derive preview entirely from current controlled state |
| Sticky bar overlaps content or admin chrome | Keep in normal flow, bottom padding, verify at 390/768/1024/1440 |
| Uploader refactor breaks Cloudinary flow | Reuse the existing `handleFile` logic; only add drop handling and replace UI |
| Published/Draft copy misrepresents data | Map explicitly to `isVisible`; no additional status invention |
| Four forms drift again | All shared chrome and controls live in `components/admin/editor/` |

## 11. Verification

- `pnpm exec tsc --noEmit`
- Focused `pnpm exec eslint` on every changed file
- `pnpm run build` (must still generate 53/53 pages)
- Dev smoke: public pages unchanged; `/admin/*` still redirects when signed out
- If admin authentication is available, exercise each create/edit flow:
  create, update, visibility toggle, upload, screenshot reorder, cancel guard,
  Ctrl/Cmd+S, error state, and public link.
- Visual checks at 1440, 1280, 1024, 768, and 390 widths.
- If credentials remain unavailable, report that interaction and visual checks
  for authenticated pages were not executed. Do not claim they passed.
- Leave `lib/prisma.ts` uncommitted and out of editor commits.

## 12. Left to the builder

- Exact prop names and file-internal structure of the editor kit.
- Whether `EditorHeader` remains separate or is folded into `EditorShell`.
- Exact spacing, font sizes within the stated ranges, and shadow offsets per
  nesting level.
- Preview card composition details that do not add fields.
- Whether the screenshot move controls are icon buttons or a small button pair.
- Where the dirty snapshot helper lives if `useEditorState` grows.
