# Scan Page Redesign: Two-Step ISBN Flow

## Problem

The current `/add/scan` page tries to do everything in one pass: camera, API lookup, confirmation. When anything goes wrong (camera fails, ISBN not found), the user hits a dead-end error screen and has to start over. The scan and manual paths are completely separate with no graceful fallback between them.

## Design

### Step 1 — ISBN Acquisition (`idle` state)

Two inputs stacked vertically, both always visible:

1. **Scanner viewfinder** at the top. If the camera can't start (permission denied, no camera), this area shows "Camera indisponible" and collapses.
2. **ISBN text field** below the scanner. `inputMode="numeric"`, placeholder `978...`, with a "Rechercher" button.

When the scanner detects a valid ISBN (10 or 13 digits):
- The ISBN fills the text field
- Auto-submits to the API
- Scanner stops

When the user types an ISBN and taps "Rechercher":
- Same transition to Step 2

### Step 2 — Lookup + Result

**Loading** (`loading` state): Text field shows the ISBN (read-only, greyed out). "Recherche en cours..." indicator below. Scanner hidden.

**Success** (`confirm` state): `BookConfirmation` component appears with title, author, cover. User adds notes/store URL and confirms. Book saved, redirect to `/`.

**Failure** (returns to `idle` state): Text field reappears **pre-filled with the ISBN**, editable. Error message inline below the field ("ISBN introuvable" or "Erreur de connexion"). Scanner reappears above. "Saisie manuelle" link below as escape hatch.

### State Machine

Three states: `idle | loading | confirm`

Errors return to `idle` with:
- `isbn` pre-filled
- `error` message displayed inline

## Files Changed

- `src/app/add/scan/page.tsx` — rewrite with two-step flow

## Files Unchanged

- `src/components/BarcodeScanner.tsx` — same single responsibility
- `src/components/BookConfirmation.tsx` — reused as-is
- `src/app/add/manual/page.tsx` — untouched
- `src/app/add/page.tsx` — untouched
