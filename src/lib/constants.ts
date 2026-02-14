export const STAGES = ["a_acheter", "tsundoku", "bibliotheque", "revendre"] as const;
export type Stage = (typeof STAGES)[number];

export const STAGE_CONFIG: Record<
  Stage,
  { label: string; color: string; bgColor: string; emoji: string }
> = {
  a_acheter: {
    label: "Livres à acheter",
    color: "text-amber",
    bgColor: "bg-amber/10",
    emoji: "📋",
  },
  tsundoku: {
    label: "Tsundoku",
    color: "text-forest",
    bgColor: "bg-forest/10",
    emoji: "📚",
  },
  bibliotheque: {
    label: "Bibliothèque",
    color: "text-forest",
    bgColor: "bg-forest/10",
    emoji: "📖",
  },
  revendre: {
    label: "S'en séparer",
    color: "text-amber",
    bgColor: "bg-amber/10",
    emoji: "👋",
  },
};

export const STAGE_TRANSITIONS: Record<Stage, { label: string; next: Stage }[]> = {
  a_acheter: [{ label: "Je l'ai acheté !", next: "tsundoku" }],
  tsundoku: [
    { label: "Je l'ai lu ! → Garder", next: "bibliotheque" },
    { label: "Je l'ai lu ! → S'en séparer", next: "revendre" },
  ],
  bibliotheque: [{ label: "S'en séparer", next: "revendre" }],
  revendre: [{ label: "Garder finalement", next: "bibliotheque" }],
};
