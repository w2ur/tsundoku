export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export const changelog: ChangelogEntry[] = [
  {
    version: "1.0.0",
    date: "2026-02-18",
    changes: [
      "Lancement public de Tsundoku",
      "Tableau Kanban avec 4 étapes : à acheter, tsundoku, bibliothèque, s'en séparer",
      "Ajout de livres par scan de code-barres, recherche Open Library, ou saisie manuelle",
      "Glisser-déposer pour déplacer les livres entre les étapes",
      "Sauvegarde et restauration de la bibliothèque en JSON",
      "Application installable (PWA) avec mode hors-ligne",
    ],
  },
];
