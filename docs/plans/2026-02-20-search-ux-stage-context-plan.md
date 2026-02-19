# Search UX & Stage-Aware Add Flow — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix two UX issues: (1) make Open Library search non-intrusive with compact autocomplete in add mode and opt-in search in edit mode, and (2) make the + button and add flow respect the currently active stage tab.

**Architecture:** Refactor `OpenLibraryAutocomplete` to be compact (3 results, no covers). Add a `mode` prop to `BookForm` to switch between inline autocomplete (add) and opt-in search modal (edit). Use URL query params (`?stage=`) as source of truth for active tab, threaded through AddButton → /add → /add/manual → addBook() → navigate back.

**Tech Stack:** Next.js 16 (App Router, useSearchParams, useRouter), React 19, TypeScript, Tailwind CSS v4

---

### Task 1: Add author parameter to Open Library search

**Files:**
- Modify: `src/lib/open-library.ts`
- Modify: `src/lib/open-library.test.ts` (create — no test file exists yet)

**Step 1: Create test file**

Create `src/lib/open-library.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchBooks } from "./open-library";

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("searchBooks", () => {
  it("returns empty array for short queries", async () => {
    const results = await searchBooks("a");
    expect(results).toEqual([]);
  });

  it("sends query with author when provided", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ docs: [] }),
    });
    vi.stubGlobal("fetch", mockFetch);

    await searchBooks("Le Petit Prince", "Saint-Exupéry");

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("Le+Petit+Prince");
    expect(calledUrl).toContain("Saint-Exup");
  });

  it("sends query without author when not provided", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ docs: [] }),
    });
    vi.stubGlobal("fetch", mockFetch);

    await searchBooks("Le Petit Prince");

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("Le+Petit+Prince");
    expect(calledUrl).not.toContain("Saint");
  });

  it("limits results to specified count", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          docs: [
            { title: "Book 1" },
            { title: "Book 2" },
            { title: "Book 3" },
            { title: "Book 4" },
            { title: "Book 5" },
          ],
        }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const calledUrl = () => (mockFetch.mock.calls[0][0] as string);

    await searchBooks("test", undefined, 3);
    expect(calledUrl()).toContain("limit=3");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/open-library.test.ts`
Expected: FAIL — `searchBooks` doesn't accept author/limit params yet.

**Step 3: Update `searchBooks` signature**

Edit `src/lib/open-library.ts`. Change the function signature and query construction:

```ts
export async function searchBooks(
  query: string,
  author?: string,
  limit: number = 5
): Promise<OpenLibraryResult[]> {
  if (!query || query.length < 2) return [];
  const fullQuery = author ? `${query} ${author}` : query;
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(fullQuery)}&limit=${limit}&fields=title,author_name,cover_i,isbn`;
  // ... rest unchanged
```

**Step 4: Run test to verify it passes**

Run: `npm test -- src/lib/open-library.test.ts`
Expected: PASS

**Step 5: Run all tests**

Run: `npm test`
Expected: All pass (existing callers don't pass author/limit, default values maintain backward compat).

**Step 6: Commit**

```bash
git add src/lib/open-library.ts src/lib/open-library.test.ts
git commit -m "feat: add optional author and limit params to searchBooks"
```

---

### Task 2: Make OpenLibraryAutocomplete compact

**Files:**
- Modify: `src/components/OpenLibraryAutocomplete.tsx`

**Step 1: Update the component**

Edit `src/components/OpenLibraryAutocomplete.tsx`. Changes:

1. Add `author` and `limit` to Props interface:

```ts
interface Props {
  onSelect: (result: OpenLibraryResult) => void;
  value: string;
  onChange: (value: string) => void;
  onNoResults?: (empty: boolean) => void;
  author?: string;
  limit?: number;
}
```

2. Update the destructuring and search call:

```ts
export default function OpenLibraryAutocomplete({ onSelect, value, onChange, onNoResults, author, limit = 3 }: Props) {
```

3. In the `useEffect`, pass author and limit to `searchBooks`:

```ts
const data = await searchBooks(value, author, limit);
```

4. Add `author` to the useEffect dependency array:

```ts
}, [value, author]);
```

5. Replace the dropdown rendering to remove cover images and make it compact. Replace the entire `{isOpen && (` block:

```tsx
{isOpen && (
  <div className="absolute z-20 w-full mt-1 bg-white border border-forest/10 rounded-lg shadow-lg overflow-y-auto max-h-36">
    {results.map((result, i) => (
      <button
        key={`${result.title}-${i}`}
        type="button"
        onClick={() => {
          onSelect(result);
          setIsOpen(false);
        }}
        className="w-full px-3 py-2 text-left hover:bg-cream transition-colors border-b border-forest/5 last:border-b-0"
      >
        <p className="text-sm text-ink truncate">{result.title}</p>
        {result.author && (
          <p className="text-xs text-forest/40 truncate">{result.author}</p>
        )}
      </button>
    ))}
  </div>
)}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Zero warnings.

**Step 3: Commit**

```bash
git add src/components/OpenLibraryAutocomplete.tsx
git commit -m "feat: compact autocomplete with author-enhanced search"
```

---

### Task 3: Add mode prop to BookForm with edit-mode search modal

**Files:**
- Modify: `src/components/BookForm.tsx`

**Step 1: Update BookForm**

Edit `src/components/BookForm.tsx`. Changes:

1. Add `mode` to Props:

```ts
interface Props {
  initial?: Partial<BookFormData>;
  onSubmit: (data: BookFormData) => void;
  submitLabel?: string;
  mode?: "add" | "edit";
}
```

2. Update destructuring:

```ts
export default function BookForm({ initial, onSubmit, submitLabel = "Ajouter", mode = "add" }: Props) {
```

3. Add state for the search modal:

```ts
const [showSearchModal, setShowSearchModal] = useState(false);
const [searchQuery, setSearchQuery] = useState("");
const [searchResults, setSearchResults] = useState<OpenLibraryResult[]>([]);
const [searchLoading, setSearchLoading] = useState(false);
```

4. Add `searchBooks` to the import:

```ts
import { searchBooks, type OpenLibraryResult } from "@/lib/open-library";
```

5. Add search handler for edit mode:

```ts
async function handleEditSearch() {
  if (!searchQuery || searchQuery.length < 2) return;
  setSearchLoading(true);
  const results = await searchBooks(searchQuery, author);
  setSearchResults(results);
  setSearchLoading(false);
}

function handleSearchSelect(result: OpenLibraryResult) {
  setTitle(result.title);
  setAuthor(result.author);
  if (result.coverUrl) setCoverUrl(result.coverUrl);
  setShowSearchModal(false);
  setSearchQuery("");
  setSearchResults([]);
}
```

6. In the JSX, conditionally render autocomplete or plain input for the title field. Replace the `<OpenLibraryAutocomplete ... />` block:

```tsx
{mode === "add" ? (
  <OpenLibraryAutocomplete
    value={title}
    onChange={setTitle}
    onSelect={handleAutocompleteSelect}
    onNoResults={handleNoResults}
    author={author}
  />
) : (
  <div>
    <label className="block text-sm font-medium text-forest/70 mb-1">Titre</label>
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Titre du livre"
      className={inputClass}
    />
    <button
      type="button"
      onClick={() => {
        setSearchQuery(title);
        setShowSearchModal(true);
      }}
      className="mt-1 text-xs text-forest/40 underline hover:text-forest/60 transition-colors"
    >
      Rechercher sur Open Library
    </button>
  </div>
)}
```

7. Add the search modal at the end of the form, before the closing `</form>`:

```tsx
{showSearchModal && (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30" onClick={() => setShowSearchModal(false)}>
    <div
      className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-4 max-h-[70vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-sm font-semibold text-forest mb-3">Rechercher sur Open Library</h3>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleEditSearch()}
          placeholder="Titre du livre..."
          className={inputClass}
          autoFocus
        />
        <button
          type="button"
          onClick={handleEditSearch}
          disabled={searchLoading || searchQuery.length < 2}
          className="flex-shrink-0 px-3 py-2.5 bg-forest text-paper rounded-lg text-sm font-medium hover:bg-forest/90 disabled:opacity-40 transition-colors"
        >
          {searchLoading ? "..." : "Chercher"}
        </button>
      </div>
      {searchResults.length > 0 && (
        <div className="space-y-1">
          {searchResults.map((result, i) => (
            <button
              key={`${result.title}-${i}`}
              type="button"
              onClick={() => handleSearchSelect(result)}
              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-cream rounded-lg transition-colors"
            >
              {result.coverUrl ? (
                <img src={result.coverUrl} alt="" className="w-8 h-12 object-cover rounded" />
              ) : (
                <div className="w-8 h-12 bg-forest/5 rounded flex items-center justify-center">
                  <span className="text-forest/20 text-xs">?</span>
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink truncate">{result.title}</p>
                <p className="text-xs text-forest/50 truncate">{result.author}</p>
              </div>
            </button>
          ))}
        </div>
      )}
      {searchResults.length === 0 && !searchLoading && searchQuery.length >= 2 && (
        <p className="text-xs text-forest/40 text-center py-4">Aucun résultat</p>
      )}
    </div>
  </div>
)}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Zero warnings.

**Step 3: Commit**

```bash
git add src/components/BookForm.tsx
git commit -m "feat: add mode prop to BookForm with opt-in search modal in edit mode"
```

---

### Task 4: Pass mode="edit" from book detail page

**Files:**
- Modify: `src/app/book/[id]/page.tsx`

**Step 1: Add mode prop**

In `src/app/book/[id]/page.tsx`, find the `<BookForm` usage (around line 56) and add `mode="edit"`:

```tsx
<BookForm
  initial={{
    title: book.title,
    author: book.author,
    coverUrl: book.coverUrl,
    notes: book.notes,
    storeUrl: book.storeUrl,
  }}
  onSubmit={handleSave}
  submitLabel="Enregistrer"
  mode="edit"
/>
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Zero warnings.

**Step 3: Commit**

```bash
git add src/app/book/[id]/page.tsx
git commit -m "feat: use edit mode for BookForm on book detail page"
```

---

### Task 5: Stage-aware KanbanBoard with URL params

**Files:**
- Modify: `src/components/KanbanBoard.tsx`

**Step 1: Update KanbanBoard to read/write URL params**

Edit `src/components/KanbanBoard.tsx`:

1. Add imports:

```ts
import { useSearchParams, useRouter } from "next/navigation";
```

2. Replace the `useState` for `activeTab` with URL param logic. Inside the component, replace line 20 (`const [activeTab, setActiveTab] = useState<Stage>("tsundoku");`) with:

```ts
const searchParams = useSearchParams();
const router = useRouter();
const stageParam = searchParams.get("stage");
const activeTab: Stage = STAGES.includes(stageParam as Stage)
  ? (stageParam as Stage)
  : "tsundoku";

const setActiveTab = useCallback(
  (stage: Stage) => {
    router.replace(`/?stage=${stage}`, { scroll: false });
  },
  [router]
);
```

3. Add `useCallback` to the existing import from React (it's already imported).

4. Remove the `useState` import if it's no longer used (check — `useState` is NOT used elsewhere in this component, so it can be removed from the import).

**Step 2: Run all tests**

Run: `npm test`
Expected: All pass.

**Step 3: Verify build**

Run: `npm run build`
Expected: Zero warnings. Note: `useSearchParams()` requires the component to be wrapped in `<Suspense>`. Since `KanbanBoard` is used inside `page.tsx` (a client component), and Next.js App Router handles this, it should work. If a build warning appears about Suspense, wrap the `KanbanBoard` usage in `page.tsx` with `<Suspense>`.

**Step 4: Commit**

```bash
git add src/components/KanbanBoard.tsx
git commit -m "feat: sync active tab with URL query param"
```

---

### Task 6: Stage-aware AddButton

**Files:**
- Modify: `src/components/AddButton.tsx`

**Step 1: Update AddButton to pass stage param**

Edit `src/components/AddButton.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AddButton() {
  const searchParams = useSearchParams();
  const stage = searchParams.get("stage") || "tsundoku";

  return (
    <Link
      href={`/add?stage=${stage}`}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-forest text-paper shadow-lg hover:bg-forest/90 active:scale-95 transition-all"
      aria-label="Ajouter un livre"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
    </Link>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Zero warnings.

**Step 3: Commit**

```bash
git add src/components/AddButton.tsx
git commit -m "feat: pass active stage to add flow via URL param"
```

---

### Task 7: Forward stage param through add flow

**Files:**
- Modify: `src/app/add/page.tsx`
- Modify: `src/app/add/manual/page.tsx`
- Modify: `src/app/add/scan/page.tsx`

**Step 1: Update `/add/page.tsx` to forward stage param**

Edit `src/app/add/page.tsx`:

1. Add `"use client"` directive (already present) and imports:

```ts
import { useSearchParams } from "next/navigation";
```

2. Inside the component, read the param and build hrefs dynamically:

```ts
export default function AddPage() {
  const searchParams = useSearchParams();
  const stage = searchParams.get("stage") || "tsundoku";
```

3. Change the methods array hrefs to be dynamic. Replace the static `methods` array outside the component with dynamic hrefs inside. The simplest approach: keep methods as a static array but override hrefs in the render:

```tsx
{methods.map((m) => (
  <Link
    key={m.href}
    href={`${m.href}?stage=${stage}`}
    className="..."
  >
```

**Step 2: Update `/add/manual/page.tsx` to use stage param**

Edit `src/app/add/manual/page.tsx`:

1. Add import:

```ts
import { useSearchParams } from "next/navigation";
```

2. Inside the component, read the stage:

```ts
const searchParams = useSearchParams();
const stage = searchParams.get("stage") || "tsundoku";
```

3. Update `handleConfirm` to pass the stage to `addBook` and navigate back with the stage:

```ts
async function handleConfirm(extra: { notes?: string; storeUrl?: string }) {
  if (!pending) return;
  setLoading(true);
  await addBook({ ...pending, ...extra, stage: stage as Stage });
  router.push(`/?stage=${stage}`);
}
```

4. Add Stage import:

```ts
import type { Stage } from "@/lib/types";
```

**Step 3: Update `/add/scan/page.tsx` to use stage param**

Edit `src/app/add/scan/page.tsx`:

1. Add import:

```ts
import { useSearchParams } from "next/navigation";
import type { Stage } from "@/lib/types";
```

2. Inside the component:

```ts
const searchParams = useSearchParams();
const stage = searchParams.get("stage") || "tsundoku";
```

3. Update `handleConfirm`:

```ts
async function handleConfirm(extra: { notes?: string; storeUrl?: string }) {
  if (!bookData) return;
  setSaving(true);
  await addBook({ ...bookData, ...extra, isbn, stage: stage as Stage });
  router.push(`/?stage=${stage}`);
}
```

4. Also update the "Saisie manuelle" escape hatch link to forward the stage:

```tsx
<a
  href={`/add/manual?stage=${stage}`}
  className="text-sm text-forest/40 hover:text-forest/60 transition-colors"
>
  Saisie manuelle
</a>
```

**Step 4: Run all tests**

Run: `npm test`
Expected: All pass.

**Step 5: Verify build**

Run: `npm run build`
Expected: Zero warnings.

**Step 6: Commit**

```bash
git add src/app/add/page.tsx src/app/add/manual/page.tsx src/app/add/scan/page.tsx
git commit -m "feat: thread stage param through entire add flow"
```

---

### Task 8: Final verification

**Step 1: Run all tests**

Run: `npm test`
Expected: All pass.

**Step 2: Run build**

Run: `npm run build`
Expected: Zero warnings.

**Step 3: Visual check**

Run: `npm run dev`

Test these flows:

1. **Add mode autocomplete**: Go to `/add/manual`, type a title — should see max 3 compact results (no cover images), positioned absolutely, not pushing fields down.
2. **Author-enhanced search**: Type author first, then title — search should be more accurate.
3. **Edit mode**: Go to a book detail, click "Modifier" — title should be a plain input. Click "Rechercher sur Open Library" — modal should open.
4. **Stage-aware add**: On home, switch to "Bibliothèque" tab — URL should show `?stage=bibliotheque`. Tap + — should go to `/add?stage=bibliotheque`. Add a book — should land back on `/?stage=bibliotheque` and book should be in the library column.
5. **Default behavior**: Visit `/` without params — should default to "tsundoku" tab as before.

**Step 4: Version bump**

Since these are user-facing behavior changes, bump `package.json` version to `1.1.0` and add a changelog entry:

```ts
// Add to the beginning of the changelog array in src/lib/changelog.ts:
{
  version: "1.1.0",
  date: "2026-02-20",
  changes: [
    "Recherche Open Library plus compacte et moins intrusive",
    "Mode édition : recherche Open Library optionnelle (plus de clics accidentels)",
    "Le bouton + ajoute maintenant dans l'étape active",
    "Retour automatique à l'étape d'origine après ajout d'un livre",
  ],
},
```

Update `package.json` version from `"1.0.0"` to `"1.1.0"`.

**Step 5: Commit version bump**

```bash
git add package.json src/lib/changelog.ts
git commit -m "feat: bump version to 1.1.0 with search UX and stage-aware add flow"
```
