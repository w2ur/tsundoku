# UX/UI Polish Design — My Tsundoku

**Date:** 2026-02-15
**Scope:** Navigation clarity + rename to "My Tsundoku"
**Type:** Polish pass, not a redesign

## Problem

Users don't realize that clicking the app name in the header navigates home. There is no back button on any sub-page — navigation relies entirely on the browser back button or clicking the text logo, which has no visual indication it's a link.

## Design

### 1. Header — Back Arrow on Sub-Pages

Add a `←` back arrow to the left of the logo on all pages except `/`.

**Home (`/`):**
```
[My Tsundoku] .......................... [gear]
```

**Sub-pages (`/add`, `/add/scan`, `/book/[id]`, `/settings`):**
```
[←] [My Tsundoku] .................... [gear]
```

- Back arrow uses `router.back()` (browser history).
- Arrow: forest color (`#2D4A3E`), with `hover:bg-forest/5` rounded target area.
- Arrow only renders when current path is not `/`.

### 2. Logo Hover Affordance

Add a subtle hover effect to the "My Tsundoku" text link:
- `transition-opacity` with `hover:opacity-70`
- Signals interactivity without adding visual clutter.

### 3. Rename "Tsundoku" → "My Tsundoku"

Update all references:

| Location | Current | New |
|---|---|---|
| Header component | "Tsundoku" | "My Tsundoku" |
| `layout.tsx` metadata title | "Tsundoku" | "My Tsundoku" |
| PWA manifest `name` | (check current) | "My Tsundoku" |
| PWA manifest `short_name` | (check current) | "My Tsundoku" |
| Settings page description | "Tsundoku (積ん読)" | "My Tsundoku (積ん読)" |
| Offline page (if referenced) | Check | Update if needed |
| 404 page (if referenced) | Check | Update if needed |

### 4. What Does NOT Change

- Color palette, fonts, overall layout
- Page structure and routing
- KanbanBoard, BookCard, AddButton components
- Settings gear icon position and behavior
- Footer ("Made with care by William")
- Drag-and-drop, animations, barcode scanning
