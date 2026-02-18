"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ExportButton from "@/components/ExportButton";
import ImportButton from "@/components/ImportButton";
import { useBooksByStage } from "@/hooks/useBooks";
import { STAGES, STAGE_CONFIG } from "@/lib/constants";
import { roadmap } from "@/lib/roadmap";

export default function SettingsPage() {
  const booksByStage = useBooksByStage();
  const totalBooks = booksByStage
    ? STAGES.reduce((sum, s) => sum + booksByStage[s].length, 0)
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
        <h1 className="font-serif text-2xl text-forest mb-8">Paramètres</h1>

        {booksByStage && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-forest/60 mb-3">
              Votre bibliothèque
            </h2>
            <div className="bg-white border border-forest/8 rounded-xl p-4 space-y-2">
              <p className="text-sm text-ink font-medium">
                {totalBooks} livre{totalBooks !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {STAGES.map((stage) => (
                  <div key={stage} className="flex items-center gap-1.5 text-xs text-forest/50">
                    <span>{STAGE_CONFIG[stage].emoji}</span>
                    <span>{STAGE_CONFIG[stage].label}</span>
                    <span className="ml-auto font-medium text-forest/70">
                      {booksByStage[stage].length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-forest/60">
            Sauvegarde
          </h2>
          <p className="text-xs text-forest/40">
            Exportez votre bibliothèque en JSON pour la sauvegarder ou la transférer.
          </p>
          <ExportButton />
          <ImportButton />
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-forest/60 mb-3">
            Prochainement
          </h2>
          <div className="bg-white border border-forest/8 rounded-xl p-4 space-y-3">
            {roadmap.map((item) => (
              <div key={item.title} className="flex gap-3">
                <span className="text-base leading-relaxed">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium text-ink">{item.title}</p>
                  <p className="text-xs text-forest/40">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-forest/30 mt-2 italic">
            Ces fonctionnalités ne sont pas dans un ordre particulier.
            Une idée ou une préférence ?{" "}
            <a
              href="mailto:contact@my-tsundoku.app?subject=%5BTsundoku%5D%20Suggestion"
              className="underline hover:text-forest/50 transition-colors"
            >
              Me contacter
            </a>
          </p>
        </section>

        <section className="mt-12 pt-8 border-t border-forest/10">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-forest/60 mb-2">
            À propos
          </h2>
          <p className="text-xs text-forest/40 leading-relaxed">
            My Tsundoku (積ん読) — l&apos;art d&apos;acquérir des livres et de les laisser s&apos;empiler.
            Une application pour organiser votre collection personnelle de livres.
          </p>
          <div className="flex items-center gap-3 mt-3">
            <a
              href="https://github.com/w2ur/tsundoku"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-forest/40 hover:text-forest/60 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
