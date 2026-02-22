# CLAUDE.md — Tsundoku

## Project Overview

Tsundoku is a PWA for organizing personal book collections using a Kanban-style board. Users manage books across four stages: wishlist, unread pile (tsundoku), library, and to sell. Books can be added manually or via barcode scanning (ISBN lookup via Open Library). Available in French (default) and English, with light and dark mode support.

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

French (default) and English. Users switch language in Settings > Preferences. All UI strings use the `useTranslation()` hook from `src/lib/preferences.tsx`.

## Development

```bash
npm install
npm run dev        # Start dev server (Turbopack)
npm run build      # next build && serwist build
npm test           # Run tests (vitest)
npm run test:watch # Run tests in watch mode
```

## Project Structure

- `src/lib/` — types, db, books CRUD, constants, open-library, backup, quotes, roadmap, changelog, search, swipe, preferences
- `src/lib/i18n/` — translation dictionaries (fr.ts canonical, en.ts), locale types, plural helper
- `src/hooks/` — useBooks, useBook, useBooksByStage (Dexie live queries), useIsMobile
- `src/components/` — reusable UI components
- `src/app/` — routes: `/`, `/add/`, `/add/scan`, `/add/manual`, `/book/[id]`, `/settings`, `/~offline`
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
- **URL**: https://www.my-tsundoku.app

## Project-Specific Rules

- `sw.ts` is excluded from `tsconfig.json` (uses webworker types, compiled separately by Serwist CLI)
- Serwist must use configurator mode, not `withSerwistInit` wrapper (Next.js 16/Turbopack compat)
- Build command: `next build && serwist build`
- Dexie SSR guard: `typeof window !== 'undefined'`
- Theme colors: paper `#FAF8F5`, forest `#2D4A3E`, amber `#C4956A`, cream `#F5F0EB`. Dark mode overrides via `[data-theme="dark"]` in globals.css
- i18n: homegrown, no dependencies. `fr.ts` defines canonical shape, `en.ts` satisfies `Record<TranslationKeys, string>`. Use `useTranslation()` hook for all UI strings. Light mode and French are defaults — no system preference detection
- Content files (quotes, roadmap, changelog) are locale-indexed separately from the translation dictionary
- Fonts: Playfair Display (serif), Inter (sans)
- Bump the version in `package.json` (semver) when a commit changes user-facing behavior. Add a matching entry in `src/lib/changelog.ts`. Internal changes (refactors, tests, docs) don't trigger a bump.
