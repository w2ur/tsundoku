import type { TranslationKeys } from "./i18n";

export const STAGES = ["a_acheter", "tsundoku", "bibliotheque", "revendre"] as const;
export type Stage = (typeof STAGES)[number];

export const STAGE_CONFIG: Record<
  Stage,
  { labelKey: TranslationKeys; color: string; bgColor: string; emoji: string }
> = {
  a_acheter: {
    labelKey: "stage_a_acheter",
    color: "text-amber",
    bgColor: "bg-amber/10",
    emoji: "📋",
  },
  tsundoku: {
    labelKey: "stage_tsundoku",
    color: "text-forest",
    bgColor: "bg-forest/10",
    emoji: "📚",
  },
  bibliotheque: {
    labelKey: "stage_bibliotheque",
    color: "text-forest",
    bgColor: "bg-forest/10",
    emoji: "📖",
  },
  revendre: {
    labelKey: "stage_revendre",
    color: "text-amber",
    bgColor: "bg-amber/10",
    emoji: "👋",
  },
};

export const STAGE_TRANSITIONS: Record<Stage, { labelKey: TranslationKeys; next: Stage }[]> = {
  a_acheter: [{ labelKey: "transition_a_acheter_tsundoku", next: "tsundoku" }],
  tsundoku: [
    { labelKey: "transition_tsundoku_bibliotheque", next: "bibliotheque" },
    { labelKey: "transition_tsundoku_revendre", next: "revendre" },
  ],
  bibliotheque: [{ labelKey: "transition_bibliotheque_revendre", next: "revendre" }],
  revendre: [{ labelKey: "transition_revendre_bibliotheque", next: "bibliotheque" }],
};
