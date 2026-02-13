"use client";

import Header from "@/components/Header";
import ExportButton from "@/components/ExportButton";
import ImportButton from "@/components/ImportButton";

export default function SettingsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
        <h1 className="font-serif text-2xl text-forest mb-8">Paramètres</h1>

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

        <section className="mt-12 pt-8 border-t border-forest/10">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-forest/60 mb-2">
            À propos
          </h2>
          <p className="text-xs text-forest/40 leading-relaxed">
            Tsundoku (積ん読) — l&apos;art d&apos;acquérir des livres et de les laisser s&apos;empiler.
            Une application pour organiser votre collection personnelle de livres.
          </p>
          <p className="text-xs text-forest/30 mt-2">Version 1.0</p>
        </section>
      </main>
    </div>
  );
}
