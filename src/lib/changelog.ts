export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export const changelog: ChangelogEntry[] = [
  {
    version: "1.2.3",
    date: "2026-02-20",
    changes: [
      "Le bouton + sur mobile redirige vers tsundoku par défaut",
      "La section Nouveautés est désormais repliable dans les paramètres",
    ],
  },
  {
    version: "1.2.2",
    date: "2026-02-20",
    changes: [
      "Correction de l'affichage des couvertures ajoutées par URL",
    ],
  },
  {
    version: "1.2.1",
    date: "2026-02-20",
    changes: [
      "Bouton + dans chaque colonne sur bureau",
      "Suppression du bouton flottant sur bureau",
      "Suppression du bouton « Ajouter un livre » dans les colonnes vides",
    ],
  },
  {
    version: "1.2.0",
    date: "2026-02-20",
    changes: [
      "Recherche Open Library : bouton Rechercher au lieu de la recherche automatique",
      "Résultats de recherche affichés dans le formulaire avec miniatures de couverture",
      "Choix de l'étape lors de l'ajout sur bureau",
    ],
  },
  {
    version: "1.1.0",
    date: "2026-02-20",
    changes: [
      "Recherche Open Library plus compacte et moins intrusive",
      "Mode édition : recherche Open Library optionnelle (plus de clics accidentels)",
      "Le bouton + ajoute maintenant dans l'étape active",
      "Retour automatique à l'étape d'origine après ajout d'un livre",
    ],
  },
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
