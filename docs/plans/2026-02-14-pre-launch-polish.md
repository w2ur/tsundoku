# Pre-Launch Polish

## Context

Final round of fixes and features before going public. Five changes: new PWA icon, default tab switch, welcome overlay, book editing, and PWA camera fix.

---

## 1. PWA Icon — Leaning Book Stack

Replace the current single open-book icon with a leaning stack design.

**Design:** 3-4 books stacked flat, one leaning at ~15 degrees. Forest green (#2D4A3E) background with rounded corners. Books in paper white (#FAF8F5) with spine lines in cream (#E8E4DF). Each book varies slightly in width. 積読 in serif below the pile, opacity 0.7.

**Files:**
- `public/icons/icon-192.svg` — redesign
- `public/icons/icon-512.svg` — redesign
- `public/icons/icon-maskable-512.svg` — redesign (no rounded corners, centered for safe zone)
- Generate PNGs: `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png` (180px)

---

## 2. Default Mobile Tab → Tsundoku

**File:** `src/components/KanbanBoard.tsx`

Change `useState<Stage>("a_acheter")` to `useState<Stage>("tsundoku")`.

---

## 3. Stage Label: "S'en séparer"

**File:** `src/lib/constants.ts`

Rename the `revendre` stage display label from "Revendre ou jeter" to "S'en séparer". Update emoji from 📤 to 👋.

---

## 4. Welcome Overlay

New component `src/components/WelcomeGuide.tsx`.

**Design:**
- Bottom sheet on mobile, centered modal on desktop
- Backdrop overlay at forest/30
- Paper background, rounded-t-2xl (mobile) or rounded-2xl (desktop)
- Header: "Bienvenue sur Tsundoku" in Playfair serif
- Body: 4 rows, one per stage:
  - 📋 **À acheter** — Les livres que vous repérez
  - 📚 **Tsundoku** — Votre pile à lire
  - 📖 **Bibliothèque** — Les livres lus et gardés
  - 👋 **S'en séparer** — À donner ou revendre
- CTA: "C'est parti !" button (forest bg, paper text, full width)

**Persistence:** Store `hasSeenWelcome` flag in Dexie (add a `settings` table with key-value pairs). Check on mount — don't render if true.

**Rendered in:** `src/app/page.tsx` (home page), conditionally.

---

## 5. Book Editing

**File:** `src/app/book/[id]/page.tsx`

Add a "Modifier" button near the top of the detail page. Tapping it toggles edit mode.

**Edit mode:**
- Cover: tappable, opens file picker (`accept="image/*"`). Preview updates immediately. Stored as data URL via FileReader.
- Title: text input, pre-filled
- Author: text input, pre-filled
- Bottom: "Enregistrer" + "Annuler" buttons

Uses `updateBook()` from `src/lib/books.ts`.

**ISBN storage:** Add optional `isbn?: string` to `Book` type. Populate from scan flow. No Open Library re-fetch for now (deferred to follow-up).

**Files:**
- `src/lib/types.ts` — add `isbn?: string`
- `src/lib/db.ts` — no schema change needed (Dexie stores whatever fields are on the object)
- `src/app/book/[id]/page.tsx` — edit mode UI
- `src/app/add/scan/page.tsx` — pass ISBN when creating book

---

## 6. PWA Camera Fix

**File:** `src/components/BarcodeScanner.tsx`, possibly `src/app/sw.ts`

Investigate and fix camera access in PWA standalone mode. Likely causes:
- iOS standalone mode camera restrictions
- Service worker intercepting media requests

Approach:
- Verify getUserMedia works in standalone context
- Check SW routing isn't blocking camera
- Improve error messaging for camera denial in PWA context
- Manual ISBN fallback already exists as escape hatch

---

## Verification

1. Install PWA — icon shows leaning book pile with 積読
2. Open app — lands on Tsundoku tab (📚)
3. First visit — welcome overlay appears, dismiss with "C'est parti !"
4. Subsequent visits — no overlay
5. Open any book — see "Modifier" button — tap — edit title/author/cover — save
6. Stage labels show "S'en séparer" instead of "Revendre ou jeter"
7. Scan barcode in PWA mode — camera works
8. `next build && serwist build` passes
