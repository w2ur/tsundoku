# My Tsundoku UX/UI Polish — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a back arrow to the header on sub-pages, rename "Tsundoku" to "My Tsundoku" everywhere, and add a hover affordance to the logo link.

**Architecture:** The Header component (`src/components/Header.tsx`) gains a back button that shows conditionally based on the current route via `usePathname()`. All brand name references are updated across 6 files. No new components or routes.

**Tech Stack:** Next.js App Router (`usePathname`, `useRouter`), Tailwind CSS v4, Vitest + @testing-library/react

---

### Task 1: Add back arrow to Header component

**Files:**
- Modify: `src/components/Header.tsx`

**Step 1: Update Header with back arrow and hover affordance**

Replace the entire file content with:

```tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-forest/10">
      <div className="flex items-center gap-1">
        {!isHome && (
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-lg hover:bg-forest/5 transition-colors text-forest"
            aria-label="Retour"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
          </button>
        )}
        <Link
          href="/"
          className="font-serif text-2xl text-forest tracking-tight transition-opacity hover:opacity-70"
        >
          My Tsundoku
        </Link>
      </div>
      <Link
        href="/settings"
        className="p-2 rounded-lg hover:bg-forest/5 transition-colors"
        aria-label="Paramètres"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-forest/60"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </Link>
    </header>
  );
}
```

**Step 2: Verify it renders correctly**

Run: `npm run dev` and navigate to `/`, `/add`, `/settings`, `/book/[any-id]`.

Expected:
- On `/`: no back arrow, "My Tsundoku" logo, settings gear
- On sub-pages: back arrow + "My Tsundoku" logo + settings gear
- Back arrow sends user to previous page
- Logo has subtle opacity change on hover

**Step 3: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat: add back arrow to header on sub-pages and rename to My Tsundoku"
```

---

### Task 2: Rename in metadata, manifest, and settings

**Files:**
- Modify: `src/app/layout.tsx:19` — metadata title
- Modify: `src/app/manifest.ts:5-6` — PWA name and short_name
- Modify: `src/app/settings/page.tsx:61` — about section text

**Step 1: Update layout.tsx metadata**

In `src/app/layout.tsx`, change line 19:
```ts
// Before
title: "Tsundoku",
// After
title: "My Tsundoku",
```

**Step 2: Update manifest.ts**

In `src/app/manifest.ts`, change lines 5-6:
```ts
// Before
name: "Tsundoku",
short_name: "Tsundoku",
// After
name: "My Tsundoku",
short_name: "My Tsundoku",
```

**Step 3: Update settings page about section**

In `src/app/settings/page.tsx`, change line 61:
```tsx
// Before
Tsundoku (積ん読) — l&apos;art d&apos;acquérir des livres et de les laisser s&apos;empiler.
// After
My Tsundoku (積ん読) — l&apos;art d&apos;acquérir des livres et de les laisser s&apos;empiler.
```

**Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/manifest.ts src/app/settings/page.tsx
git commit -m "chore: rename Tsundoku to My Tsundoku in metadata, manifest, and settings"
```

---

### Task 3: Rename in WelcomeGuide

**Files:**
- Modify: `src/components/WelcomeGuide.tsx:37,54`

**Step 1: Update welcome guide references**

In `src/components/WelcomeGuide.tsx`:

Line 37 — change welcome title:
```tsx
// Before
Bienvenue sur Tsundoku
// After
Bienvenue sur My Tsundoku
```

Line 54 — the stage description "Tsundoku — Votre pile à lire" stays as-is. This refers to the *concept* of tsundoku (the Japanese term for piling up books), not the app name. It's the label for the Kanban column.

**Step 2: Commit**

```bash
git add src/components/WelcomeGuide.tsx
git commit -m "chore: rename to My Tsundoku in welcome guide"
```

---

### Task 4: Write Header test

**Files:**
- Create: `src/components/Header.test.tsx`

**Step 1: Write the test file**

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

// Mock next/navigation
const mockBack = vi.fn();
let mockPathname = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ back: mockBack }),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe("Header", () => {
  it("renders the app name as a link to home", () => {
    mockPathname = "/";
    render(<Header />);
    const logo = screen.getByText("My Tsundoku");
    expect(logo.closest("a")).toHaveAttribute("href", "/");
  });

  it("does not show back arrow on home page", () => {
    mockPathname = "/";
    render(<Header />);
    expect(screen.queryByLabelText("Retour")).toBeNull();
  });

  it("shows back arrow on sub-pages", () => {
    mockPathname = "/settings";
    render(<Header />);
    expect(screen.getByLabelText("Retour")).toBeTruthy();
  });

  it("shows back arrow on nested sub-pages", () => {
    mockPathname = "/add/scan";
    render(<Header />);
    expect(screen.getByLabelText("Retour")).toBeTruthy();
  });

  it("calls router.back() when back arrow is clicked", async () => {
    mockPathname = "/add";
    const { user } = await import("@testing-library/user-event").then((m) => ({
      user: m.default.setup(),
    }));
    render(<Header />);
    await user.click(screen.getByLabelText("Retour"));
    expect(mockBack).toHaveBeenCalled();
  });

  it("renders settings link", () => {
    mockPathname = "/";
    render(<Header />);
    expect(screen.getByLabelText("Paramètres")).toBeTruthy();
  });
});
```

**Step 2: Install @testing-library/user-event if missing**

Run: `npm ls @testing-library/user-event`

If not installed: `npm install -D @testing-library/user-event`

**Step 3: Run tests**

Run: `npx vitest run src/components/Header.test.tsx`
Expected: All 6 tests pass.

**Step 4: Commit**

```bash
git add src/components/Header.test.tsx
git commit -m "test: add Header component tests for back arrow and branding"
```

---

### Task 5: Build verification

**Step 1: Run full test suite**

Run: `npm test`
Expected: All tests pass.

**Step 2: Run build**

Run: `npm run build`
Expected: Zero warnings, successful build.

**Step 3: Verify in browser**

- Open dev server, check all routes have back arrow except home
- Verify PWA manifest name in DevTools > Application > Manifest
- Verify page title in browser tab

---

### Summary of files changed

| File | Change |
|---|---|
| `src/components/Header.tsx` | Back arrow + rename + hover |
| `src/app/layout.tsx` | Metadata title |
| `src/app/manifest.ts` | PWA name + short_name |
| `src/app/settings/page.tsx` | About section text |
| `src/components/WelcomeGuide.tsx` | Welcome title |
| `src/components/Header.test.tsx` | New test file |
