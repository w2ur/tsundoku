type Locale = "fr" | "en";

export interface RoadmapItem {
  icon: string;
  title: string;
  description: string;
}

const roadmapFr: RoadmapItem[] = [
  { icon: "🔗", title: "Partagez votre Tsundoku", description: "Partagez vos piles de livres et recommandations avec vos amis" },
  { icon: "📚", title: "Clubs de lecture", description: "Trouvez des lecteurs avec les mêmes livres et créez un club" },
  { icon: "🛒", title: "Trouver en librairie", description: "Trouvez vos livres dans les librairies en ligne" },
  { icon: "📊", title: "Statistiques de lecture", description: "Suivez combien de livres vous lisez par mois et par an" },
  { icon: "☁️", title: "Synchronisation cloud", description: "Synchronisez votre bibliothèque entre vos appareils" },
];

const roadmapEn: RoadmapItem[] = [
  { icon: "🔗", title: "Share your Tsundoku", description: "Share your book piles and recommendations with friends" },
  { icon: "📚", title: "Book clubs", description: "Find readers with the same books and create a club" },
  { icon: "🛒", title: "Find in bookstores", description: "Find your books in online bookstores" },
  { icon: "📊", title: "Reading statistics", description: "Track how many books you read per month and per year" },
  { icon: "☁️", title: "Cloud sync", description: "Sync your library across your devices" },
];

export const roadmap: Record<Locale, RoadmapItem[]> = { fr: roadmapFr, en: roadmapEn };
