"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";

export default function WelcomeGuide() {
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
          Bienvenue sur My Tsundoku
        </h2>
        <p className="text-sm text-forest/50 text-center mt-1">
          Organisez vos lectures en 4 étapes
        </p>

        <div className="mt-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-xl w-8 flex-shrink-0">📋</span>
            <p className="text-sm text-forest/70">
              <span className="font-bold">À acheter</span> — Les livres que
              vous repérez
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl w-8 flex-shrink-0">📚</span>
            <p className="text-sm text-forest/70">
              <span className="font-bold">Tsundoku</span> — Votre pile à lire
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl w-8 flex-shrink-0">📖</span>
            <p className="text-sm text-forest/70">
              <span className="font-bold">Bibliothèque</span> — Les livres lus
              et gardés
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl w-8 flex-shrink-0">👋</span>
            <p className="text-sm text-forest/70">
              <span className="font-bold">S&apos;en séparer</span> — À donner
              ou revendre
            </p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="mt-6 w-full py-3 bg-forest text-paper rounded-lg font-medium text-sm hover:bg-forest/90 transition-colors"
        >
          C&apos;est parti !
        </button>
      </div>
    </div>
  );
}
