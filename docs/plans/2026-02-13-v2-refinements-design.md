# Tsundoku v2 Refinements

## Goals

Make Tsundoku ready for public release: fix PWA installation, simplify the add flow, improve mobile navigation, and add notes + store URL fields.

---

## 1. PWA Fix: Service Worker Registration

**Problem:** Serwist builds `public/sw.js` but nothing registers it. The app cannot be installed.

**Solution:** Create `src/components/ServiceWorkerRegistrar.tsx` — a `"use client"` component that calls `navigator.serviceWorker.register('/sw.js')` on mount. Render it in `src/app/layout.tsx`.

```tsx
"use client";
import { useEffect } from "react";

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);
  return null;
}
```

---

## 2. Mobile Navigation: Emoji-Only Tabs

**Problem:** 4 tabs with short labels overflow on narrow screens.

**File:** `src/components/StageTabs.tsx`

**Changes:**
- Remove the `sm:hidden` short-label span entirely
- Show only emoji + count badge by default
- Add the full label back at `sm:inline` breakpoint
- Remove `whitespace-nowrap` and `overflow-x-auto` from container (tabs will fit)
- Use `flex-1` on each tab so they distribute evenly

---

## 3. Data Model: Add `notes` and `storeUrl`

**File:** `src/lib/types.ts`
```typescript
export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  stage: Stage;
  createdAt: number;
  updatedAt: number;
  notes?: string;       // Personal reading notes
  storeUrl?: string;    // Link to online store page
}
```

**File:** `src/lib/db.ts`
- Add Dexie version 2 migration (no new indexes needed — these fields aren't queried)

**File:** `src/lib/books.ts`
- Update `addBook` to accept optional `notes` and `storeUrl`
- Update `updateBook` to allow editing `notes` and `storeUrl`

---

## 4. Simplify Add Flow

### 4a. Remove URL Scraping and Photo Add

**Delete:**
- `src/app/add/url/page.tsx`
- `src/app/add/photo/page.tsx`
- `src/app/api/scrape/route.ts`
- `src/lib/scraper.ts`

**Uninstall:** `cheerio` dependency

### 4b. Update Add Page

**File:** `src/app/add/page.tsx`

Reduce to 2 methods:
- Scanner un code-barres (ISBN from back cover)
- Saisie manuelle (title, author, OpenLibrary suggestions)

### 4c. Update BookForm

**File:** `src/components/BookForm.tsx`

Add fields:
- **Lien boutique** — optional URL input with basic validation
- **Notes** — optional textarea, placeholder: "Recommandé par..., offert par..."
- **Cover photo picker** — when no cover URL from OpenLibrary, show a button to take/upload a photo (reuses `CameraCapture` component)
- **OpenLibrary contribution link** — when search returns no results, show "Livre introuvable ? Ajoutez-le sur OpenLibrary" linking to `https://openlibrary.org/books/add`

### 4d. Update Scan Flow

**File:** `src/app/add/scan/page.tsx`

After ISBN lookup succeeds, show `BookConfirmation` with:
- Pre-filled title/author/cover from OpenLibrary
- Editable **store URL** field
- Editable **notes** field

### 4e. Update BookConfirmation

**File:** `src/components/BookConfirmation.tsx`

Add optional `storeUrl` and `notes` fields (editable) below the book preview.

---

## 5. Fix ISBN Barcode Scanning

**Already partially fixed** (Search API fallback + timeouts in previous commit). Remaining work:

**File:** `src/components/BarcodeScanner.tsx`
- Verify `html5-qrcode` works correctly with back camera on iOS and Android
- Ensure the scanner cleanup doesn't race with the success callback
- Test with real ISBN barcodes (EAN-13 format)

**File:** `src/lib/open-library.ts`
- Already has Books API + Search API fallback with 8s timeouts
- Already has try-catch wrapping

**File:** `src/app/add/scan/page.tsx`
- Already has try-catch around `getBookByISBN`

If scanning still fails after testing, consider adding `formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13]` to restrict to barcode-only (skip QR detection for speed).

---

## 6. Book Detail Page

**File:** `src/app/book/[id]/page.tsx`

### Store URL
Below the author line, if `book.storeUrl` exists:
```
[external-link icon] Voir en boutique
```
Opens in new tab (`target="_blank" rel="noopener"`).

### Notes Section
Below the stage badge, new section:
- **Has notes:** Display in a styled block (`bg-cream rounded-xl p-4 text-sm`) with "Modifier" button
- **No notes:** Subtle "Ajouter des notes" button
- **Edit mode:** Inline textarea with Enregistrer/Annuler buttons
- Uses `updateBook(id, { notes })` to persist

---

## 7. Settings Page

**File:** `src/app/settings/page.tsx`

### Stats Section (new, above Backup)
- "Votre bibliothèque" heading
- Total book count
- Per-stage breakdown: emoji + label + count in a compact list

### About Section (update existing)
- Add GitHub repo link
- Add author credit
- Keep the tsundoku definition

---

## 8. Cleanup

### Files to Delete
- `src/app/add/url/page.tsx`
- `src/app/add/photo/page.tsx`
- `src/app/api/scrape/route.ts`
- `src/lib/scraper.ts`

### Dependencies to Remove
- `cheerio`

### Files to Keep
- `src/components/CameraCapture.tsx` — repurposed as cover picker in BookForm

---

## Implementation Order

1. Data model migration (types + db + books CRUD)
2. Service worker registration
3. Mobile tabs (emoji-only)
4. BookForm updates (notes, storeUrl, cover picker, OL link)
5. BookConfirmation updates (notes, storeUrl)
6. Scan flow updates (notes, storeUrl after ISBN lookup)
7. Book detail page (notes editor, store link)
8. Settings page (stats, credits)
9. Delete removed files + uninstall cheerio
10. Add page simplification (2 methods)
11. Final testing + build verification
