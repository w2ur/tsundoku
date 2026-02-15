# CLAUDE.md — Tsundoku

## Project Overview

Tsundoku is a French-language PWA for organizing personal book collections using a Kanban-style board. Users manage books across four stages: wishlist, unread pile (tsundoku), library, and to sell. Books can be added manually, via barcode scanning, or by searching Open Library.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Dexie.js (IndexedDB) — all data stored client-side
- **PWA**: Serwist (configurator mode) — `serwist.config.js` + `serwist build` post-step
- **Drag & Drop**: @hello-pangea/dnd
- **Animations**: motion
- **Barcode Scanning**: html5-qrcode
- **Testing**: Vitest + @testing-library/react

## User-Facing Language

French. All UI labels, messages, and content are in French.

## Development

```bash
npm install
npm run dev        # Start dev server (Turbopack)
npm run build      # next build && serwist build
npm test           # Run tests (vitest)
npm run test:watch # Run tests in watch mode
```

## Project Structure

- `src/lib/` — types, db, books CRUD, constants, open-library, scraper, backup, quotes
- `src/hooks/` — useBooks (Dexie live queries), useIsMobile
- `src/components/` — reusable UI components
- `src/app/` — routes: `/`, `/add/*`, `/book/[id]`, `/settings`, `/api/scrape`, `/~offline`
- `src/app/sw.ts` — service worker (excluded from tsconfig, compiled by Serwist CLI)

## Testing

- **Framework**: Vitest with jsdom environment
- **Convention**: test files live next to source (`foo.ts` → `foo.test.ts`)
- **Priority**: utility functions, data transformations, business logic

## Build Warning Exceptions

None currently. Build must produce zero warnings.

## License

AGPL-3.0-only. Commercial licensing available — contact w@revah.paris.

## Deployment

- **Platform**: Vercel (auto-deploy on push to main)
- **URL**: https://tsundoku-alpha.vercel.app (future: my-tsundoku.app)

## Project-Specific Rules

- `sw.ts` is excluded from `tsconfig.json` (uses webworker types, compiled separately by Serwist CLI)
- Serwist must use configurator mode, not `withSerwistInit` wrapper (Next.js 16/Turbopack compat)
- Build command: `next build && serwist build`
- Dexie SSR guard: `typeof window !== 'undefined'`
- Theme colors: paper `#FAF8F5`, forest `#2D4A3E`, amber `#C4956A`, cream `#F5F0EB`
- Fonts: Playfair Display (serif), Inter (sans)
