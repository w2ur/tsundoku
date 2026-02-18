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
│   └── ~offline/          # Offline fallback page
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks (useBooks, useIsMobile)
└── lib/           # Business logic, types, DB, constants
```

## Roadmap

Planned features (in no particular order):

- **Partagez votre Tsundoku** — Share your book piles and recommendations with friends
- **Clubs de lecture** — Find readers with the same books and start a club
- **Trouver en librairie** — Find your books in online bookstores
- **Statistiques de lecture** — Track how many books you read per month and year
- **Synchronisation cloud** — Sync your library across devices

Have a suggestion? [Get in touch](mailto:contact@my-tsundoku.app).

## Deployment

Auto-deployed on **Vercel** on push to `main`.

- **URL**: https://www.my-tsundoku.app

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE).

Commercial licensing available — contact [w@revah.paris](mailto:w@revah.paris).

## Author

Made with care by [William](https://william.revah.paris)
