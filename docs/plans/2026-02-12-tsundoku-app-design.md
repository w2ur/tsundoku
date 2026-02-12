# Tsundoku App Design

A personal book management app inspired by the Japanese concept of Tsundoku and the aesthetic of Shakespeare and Company, Paris.

## Core Concept

Books flow through four stages:

1. **Livres a acheter** — Wishlist: books you want to buy
2. **Tsundoku** — Bought but unread: the beautiful pile
3. **Bibliotheque** — Read and kept
4. **Revendre ou jeter** — Read and letting go

## Tech Stack

- **Next.js** (App Router) — React framework
- **Tailwind CSS** — Utility-first styling with custom theme
- **Dexie.js** (IndexedDB) — Local data persistence
- **next-pwa** — Installable PWA with offline support
- **Vercel** — Free hosting
- **Open Library API** — Book metadata lookup (free, no key)
- **html5-qrcode** — Barcode scanning in browser

## Data Model

```typescript
interface Book {
  id: string           // UUID
  title: string
  author: string
  coverUrl: string     // URL or base64 data URI
  stage: "a_acheter" | "tsundoku" | "bibliotheque" | "revendre"
  createdAt: number    // timestamp
  updatedAt: number    // timestamp
}
```

Minimal by design. No tags, ratings, or page counts — just the essentials.

## Pages

| Route | Purpose |
|---|---|
| `/` | Main view: four-stage Kanban board |
| `/add` | Add a book via URL, barcode, photo, or manual entry |
| `/book/[id]` | Book detail and stage transitions |

## Main View — The Four Shelves

### Desktop
Four vertical columns side by side (Kanban-style). Each column represents a stage. Books appear as cards showing cover + title + author. Drag-and-drop between columns to change stage.

### Mobile
Four horizontal tabs at the top. Tap to switch stages. Books stack vertically as cards. Swipe a card left/right to move it to the adjacent stage.

### Visual Language (Literary Minimalist)

- **Background:** Warm off-white `#FAF8F5` — aged paper, but clean
- **Primary color:** Deep forest green `#2D4A3E`
- **Accent color:** Warm amber `#C4956A`
- **Title typeface:** Playfair Display or Libre Baskerville (serif)
- **UI typeface:** Inter (sans-serif)
- **Book covers** are the main visual element — generous size, subtle shadow
- **Stage headers** use elegant small-caps lettering
- Minimal chrome — the books are the interface

### Stage Counts
Each column/tab header shows the count of books in that stage. The Tsundoku count is the star number.

### Empty States
Literary quotes as placeholder text. "Livres a acheter" empty state includes a prominent "+" button.

### Transitions
Smooth slide/fade animations when books move between stages.

## Adding Books

The `/add` page offers four methods:

### 1. Paste a URL
- Input field for links from Babelio, Amazon, Fnac, Goodreads, library sites, etc.
- A Vercel Edge Function fetches the page and extracts:
  - Open Graph metadata (`og:title`, `og:image`)
  - Fallback: `<title>` tag, JSON-LD, schema.org structured data
- Extracted info shown for confirmation before adding

### 2. Scan a Barcode
- Device camera via Web API (`navigator.mediaDevices`)
- `html5-qrcode` library reads the ISBN
- ISBN looked up via Open Library API for title, author, and cover

### 3. Take a Photo of a Cover
- Device camera captures a photo
- V1: Photo stored as cover image, title + author entered manually
- Future: AI vision API to extract title/author from the cover

### 4. Manual Entry
- Form: title, author, optional cover image upload
- Auto-complete suggestions from Open Library search API as you type

All four methods end at a confirmation screen, then the book is added to "Livres a acheter."

## Book Detail (`/book/[id]`)

- Full-size cover image at the top
- Title (large serif) and author
- Current stage as a subtle badge
- Action buttons for stage transitions:
  - From "Livres a acheter": **"Je l'ai achete!"** → Tsundoku
  - From "Tsundoku": **"Je l'ai lu!"** → choice of Bibliotheque or Revendre
  - From other stages: option to move back or to another stage
- Discreet "Supprimer" (delete) at the bottom

## Data & Backup

### Local Storage (Dexie.js / IndexedDB)
- All data lives in the browser's IndexedDB
- Works offline — no server dependency for reads/writes
- Dexie.js provides clean API and handles schema migrations

### Export/Import
- Settings/gear icon in the nav
- **Export:** Downloads library as a JSON file (save to iCloud Drive)
- **Import:** Pick a JSON file to restore (merge or replace)
- JSON is human-readable, includes base64-encoded cover thumbnails (compressed)

### PWA & Offline
- Service worker caches the app shell for instant loading
- Fully functional offline
- Online-only features: URL scraping, barcode ISBN lookup, Open Library search (graceful fallback when offline)

## Hosting

Vercel free tier. Includes:
- Static site hosting
- Edge Functions for URL scraping
- Custom domain support (optional)
- Automatic HTTPS

## Scope Summary

| Feature | V1 |
|---|---|
| Four-stage Kanban board | Yes |
| Responsive (desktop + mobile PWA) | Yes |
| Add via URL paste | Yes |
| Add via barcode scan | Yes |
| Add via photo (manual metadata) | Yes |
| Add manually | Yes |
| Drag-and-drop / swipe transitions | Yes |
| IndexedDB local storage (Dexie.js) | Yes |
| JSON export/import | Yes |
| Shakespeare & Co literary minimalist theme | Yes |
| Free Vercel hosting | Yes |
