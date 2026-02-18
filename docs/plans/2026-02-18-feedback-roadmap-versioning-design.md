# Design: Feedback, Roadmap, Versioning & Changelog

**Date**: 2026-02-18
**Status**: Approved

## Context

Tsundoku is going live with a public repo. The app needs:
- A way for users to send feedback via contact@my-tsundoku.app
- Visibility into planned features (roadmap)
- Proper versioning synced from package.json
- A user-facing changelog

The guiding principle is **non-intrusive**: all new content lives in the existing Settings page and a shared Footer, with no new routes or navigation.

## Design

### 1. Shared Footer Component

**File**: `src/components/Footer.tsx`

Extracts the duplicated footer from `page.tsx` and `settings/page.tsx` into a reusable component.

Contents:
- "Made with care by William" — links to `https://william.revah.paris`
- Dot separator + version badge (e.g., `v1.0.0`) — read from `NEXT_PUBLIC_APP_VERSION`
- Second line: "Me contacter" — `mailto:contact@my-tsundoku.app` with pre-filled subject `[Tsundoku] Retour utilisateur`

Styling: `text-xs text-forest/30`, same as current footer.

### 2. Versioning — Auto-sync from package.json

**Problem**: `package.json` says `1.0.0`, settings shows hardcoded `v2.0`.

**Solution**:
1. `next.config.ts`: inject `NEXT_PUBLIC_APP_VERSION` from `package.json` at build time via `env` config
2. Footer component reads `process.env.NEXT_PUBLIC_APP_VERSION`
3. Remove hardcoded `v2.0` from settings page (version now in Footer)
4. Keep `package.json` at `1.0.0` — correct for first public release

**CLAUDE.md rule**: Bump the version in `package.json` (semver) when a commit changes user-facing behavior. Add a matching entry in `src/lib/changelog.ts`. Internal changes (refactors, tests, docs) don't trigger a bump.

### 3. Changelog — "Nouveautés" Section in Settings

**Data source**: `src/lib/changelog.ts`

```ts
export const changelog = [
  {
    version: "1.0.0",
    date: "2026-02-18",
    changes: [
      "Lancement public de Tsundoku",
      "Tableau Kanban avec 4 étapes",
      "Ajout de livres par scan, recherche ou saisie manuelle",
      // ...
    ],
  },
];
```

**UI**: Collapsible section in Settings between "Sauvegarde" and "À propos".
- Section header: "Nouveautés" (same uppercase/tracking style as other sections)
- Each version: collapsible row with version + date, chevron toggle
- Most recent version expanded by default, older ones collapsed
- Expanded state shows bullet list of changes
- Pure client-side toggle (`useState` or `<details>`)

### 4. Roadmap — "Prochainement" Section in Settings + README

**Data source**: `src/lib/roadmap.ts`

```ts
export const roadmap = [
  { icon: "🔗", title: "Partagez votre Tsundoku", description: "Partagez vos piles de livres et recommandations avec vos amis" },
  { icon: "📚", title: "Clubs de lecture", description: "Trouvez des lecteurs avec les mêmes livres et créez un club" },
  { icon: "🛒", title: "Trouver en librairie", description: "Trouvez vos livres dans les librairies en ligne" },
  { icon: "📊", title: "Statistiques de lecture", description: "Suivez combien de livres vous lisez par mois et par an" },
  { icon: "☁️", title: "Synchronisation cloud", description: "Synchronisez votre bibliothèque entre vos appareils" },
];
```

**UI**: Section in Settings between "Sauvegarde" and "Nouveautés".
- Same card style as stats section (`bg-white border border-forest/8 rounded-xl`)
- Each item: icon + title (bold) + one-line description (muted)
- Footer note: *Ces fonctionnalités ne sont pas dans un ordre particulier. Une idée ou une préférence ? [Me contacter]*
- README: matching "Roadmap" section with the same features as bullet points

### 5. Settings Page — Final Layout

```
Votre bibliothèque      (existing — stats)
Sauvegarde              (existing — export/import)
Prochainement           (NEW — roadmap)
Nouveautés              (NEW — changelog)
À propos                (existing — description + GitHub, no version badge)
<Footer />              (NEW — shared component)
```

## Files Changed

| File | Action | Description |
|------|--------|-------------|
| `src/components/Footer.tsx` | Create | Shared footer: author, version, contact |
| `src/lib/changelog.ts` | Create | Changelog data array |
| `src/lib/roadmap.ts` | Create | Roadmap data array |
| `next.config.ts` | Edit | Inject version from package.json |
| `src/app/settings/page.tsx` | Edit | Add roadmap + changelog sections, use Footer, remove hardcoded version |
| `src/app/page.tsx` | Edit | Use shared Footer |
| `CLAUDE.md` | Edit | Add version bump + changelog rule |
| `README.md` | Edit | Add Roadmap section |
