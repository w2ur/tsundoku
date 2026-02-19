# Design: Search UX Fix & Stage-Aware Add Flow

**Date**: 2026-02-20
**Status**: Approved

## Context

Two UX issues found during real usage:

1. **Open Library search overlay**: When adding or editing a book, the search dropdown overlays form fields. In edit mode, trying to edit the author triggers accidental taps on search results. The popup is too large and intrusive.

2. **Add button ignores active stage**: The + button always adds books to "a_acheter" (wishlist) regardless of which tab the user is viewing. After adding, the app navigates to the home page defaulting to the "tsundoku" tab — not where the user was.

## Design

### Issue 1: Open Library Search UX

#### Add mode — Compact inline autocomplete

- Max **3 results** instead of 5
- **Compact rows**: title + author in small text, no cover thumbnails
- Positioned with `absolute` + `max-height` + `overflow-y: auto` — never pushes form fields
- Dismisses on blur or outside tap
- Triggers on 2+ chars with 300ms debounce (unchanged)
- Selecting a result fills title + author + cover as before

#### Edit mode — Opt-in search

- `BookForm` receives `mode: "add" | "edit"` prop
- In edit mode, the title field is a **plain `<input>`** — no autocomplete
- A small "Rechercher sur Open Library" link appears below the title field
- Tapping it opens a **bottom sheet / modal** with search input and results
- Selecting a result fills form fields and closes the modal
- No accidental taps — search is fully opt-in

#### Author-enhanced search

- When the author field has a value and a title search triggers, concatenate `title + " " + author` as the query string
- Open Library's `q=` parameter supports multi-word queries and this narrows results significantly
- If author is empty, search by title alone (current behavior)

### Issue 2: Stage-Aware Add Flow

#### URL as source of truth

1. **KanbanBoard** reads `?stage=` from URL on mount via `useSearchParams`. Falls back to `"tsundoku"` if absent.
2. **Tab switching** updates URL: `router.replace("/?stage=bibliotheque")` — no history pollution.
3. **AddButton** reads current `?stage=` and links to `/add?stage=bibliotheque`.
4. **Add flow** (`/add`, `/add/manual`, confirmation): reads `?stage=` and passes it to `addBook()` instead of hardcoding `"a_acheter"`.
5. **After adding**: navigate to `/?stage=<stage>` so the user lands on the column where their book was added.

#### Flow example

User on "Bibliothèque" tab → taps + → `/add?stage=bibliotheque` → adds book → saved with `stage: "bibliotheque"` → navigates to `/?stage=bibliotheque` → user sees new book.

## Files Changed

| File | Action | Description |
|------|--------|-------------|
| `src/components/OpenLibraryAutocomplete.tsx` | Edit | Compact layout (3 results, no covers), absolute positioning, accept `author` prop for search |
| `src/components/BookForm.tsx` | Edit | Add `mode` prop, plain input in edit mode, search modal trigger, pass author to autocomplete |
| `src/components/KanbanBoard.tsx` | Edit | Read/write `?stage=` URL param for active tab |
| `src/components/AddButton.tsx` | Edit | Pass current `?stage=` to `/add` link |
| `src/app/add/page.tsx` | Edit | Forward `?stage=` param to manual/scan routes |
| `src/app/add/manual/page.tsx` | Edit | Read `?stage=`, pass to `addBook()`, navigate back to `/?stage=` |
| `src/app/book/[id]/page.tsx` | Edit | Pass `mode="edit"` to BookForm |
| `src/lib/open-library.ts` | Edit | Accept optional `author` param in `searchBooks()`, concatenate to query |
| `src/lib/books.ts` | Edit | Accept optional `stage` param in `addBook()` instead of hardcoding |
