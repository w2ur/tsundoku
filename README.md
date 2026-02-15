# Tsundoku

Tsundoku (積ん読) is a French-language PWA for organizing personal book collections. Inspired by the Japanese concept of letting unread books pile up, it provides a Kanban-style board to track books across four stages: wishlist, unread pile, library, and to sell. All data is stored locally in the browser via IndexedDB — no account needed.

## Tech Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** for styling
- **Dexie.js** for IndexedDB (client-side storage)
- **Serwist** for PWA / service worker (configurator mode)
- **@hello-pangea/dnd** for drag-and-drop
- **motion** for animations
- **html5-qrcode** for barcode scanning
- **Vitest** for testing

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build    # next build && serwist build
```

### Tests

```bash
npm test           # single run
npm run test:watch # watch mode
```

## Project Structure

```
src/
├── app/           # Next.js App Router pages
│   ├── page.tsx           # Home — Kanban board
│   ├── add/               # Add book (manual, scan, search)
│   ├── book/[id]/         # Book detail & edit
│   ├── settings/          # Settings & backup
│   ├── api/scrape/        # Server-side metadata scraper
│   └── ~offline/          # Offline fallback page
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks (useBooks, useIsMobile)
└── lib/           # Business logic, types, DB, constants
```

## Deployment

Auto-deployed on **Vercel** on push to `main`.

- **Current URL**: https://tsundoku-alpha.vercel.app
- **Future domain**: my-tsundoku.app

## Author

Made with care by [William](https://william.revah.paris)
