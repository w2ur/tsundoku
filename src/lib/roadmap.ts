export interface RoadmapItem {
  icon: string;
  title: string;
  description: string;
}

export const roadmap: RoadmapItem[] = [
  {
    icon: "🔗",
    title: "Partagez votre Tsundoku",
    description:
      "Partagez vos piles de livres et recommandations avec vos amis",
  },
  {
    icon: "📚",
    title: "Clubs de lecture",
    description:
      "Trouvez des lecteurs avec les mêmes livres et créez un club",
  },
  {
    icon: "🛒",
    title: "Trouver en librairie",
    description: "Trouvez vos livres dans les librairies en ligne",
  },
  {
    icon: "📊",
    title: "Statistiques de lecture",
    description: "Suivez combien de livres vous lisez par mois et par an",
  },
  {
    icon: "☁️",
    title: "Synchronisation cloud",
    description: "Synchronisez votre bibliothèque entre vos appareils",
  },
];
