"use client";

import Link from "next/link";
import Header from "@/components/Header";

const methods = [
  {
    href: "/add/url",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    title: "Coller un lien",
    desc: "Amazon, Babelio, Goodreads...",
  },
  {
    href: "/add/scan",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
        <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
        <line x1="7" x2="17" y1="12" y2="12" />
      </svg>
    ),
    title: "Scanner un code-barres",
    desc: "ISBN depuis la couverture",
  },
  {
    href: "/add/photo",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
        <circle cx="12" cy="13" r="3" />
      </svg>
    ),
    title: "Prendre une photo",
    desc: "Photographier la couverture",
  },
  {
    href: "/add/manual",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      </svg>
    ),
    title: "Saisie manuelle",
    desc: "Titre, auteur, couverture",
  },
];

export default function AddPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
        <h1 className="font-serif text-2xl text-forest mb-6">Ajouter un livre</h1>
        <div className="grid gap-3">
          {methods.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="flex items-center gap-4 p-4 bg-white border border-forest/8 rounded-xl hover:border-forest/15 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-forest/5 text-forest/60 group-hover:bg-forest/10 transition-colors">
                {m.icon}
              </div>
              <div>
                <h2 className="text-sm font-semibold text-ink">{m.title}</h2>
                <p className="text-xs text-forest/40">{m.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
