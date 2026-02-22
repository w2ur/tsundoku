"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { useTranslation } from "@/lib/preferences";

export default function WelcomeGuide() {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(false);

  const hasSeenWelcome = useLiveQuery(
    async () => (await db.settings.get("hasSeenWelcome")) ?? null,
    []
  );

  // Still loading from DB
  if (hasSeenWelcome === undefined) {
    return null;
  }

  if (dismissed || hasSeenWelcome?.value === true) {
    return null;
  }

  function handleDismiss() {
    setDismissed(true);
    db.settings.put({ key: "hasSeenWelcome", value: true });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-forest/30"
        onClick={handleDismiss}
      />
      <div className="relative bg-paper rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-sm mx-auto">
        <h2 className="font-serif text-xl font-semibold text-ink text-center">
          {t("welcome_title")}
        </h2>
        <p className="text-sm text-forest/50 text-center mt-1">
          {t("welcome_subtitle")}
        </p>

        <div className="mt-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-xl w-8 flex-shrink-0">📋</span>
            <p className="text-sm text-forest/70">
              <span className="font-bold">{t("welcome_stageAcheter")}</span> — {t("welcome_stageAcheterDesc")}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl w-8 flex-shrink-0">📚</span>
            <p className="text-sm text-forest/70">
              <span className="font-bold">{t("welcome_stageTsundoku")}</span> — {t("welcome_stageTsundokuDesc")}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl w-8 flex-shrink-0">📖</span>
            <p className="text-sm text-forest/70">
              <span className="font-bold">{t("welcome_stageBibliotheque")}</span> — {t("welcome_stageBibliothequeDesc")}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl w-8 flex-shrink-0">👋</span>
            <p className="text-sm text-forest/70">
              <span className="font-bold">{t("welcome_stageRevendre")}</span> — {t("welcome_stageRevendreDesc")}
            </p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="mt-6 w-full py-3 bg-forest text-paper rounded-lg font-medium text-sm hover:bg-forest/90 transition-colors"
        >
          {t("welcome_cta")}
        </button>
      </div>
    </div>
  );
}
