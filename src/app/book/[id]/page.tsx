"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import StageBadge from "@/components/StageBadge";
import StageActions from "@/components/StageActions";
import DeleteButton from "@/components/DeleteButton";
import { useBook } from "@/hooks/useBooks";
import { updateBook } from "@/lib/books";

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const book = useBook(id);
  const router = useRouter();
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState("");
  const [editingStoreUrl, setEditingStoreUrl] = useState(false);
  const [storeUrlValue, setStoreUrlValue] = useState("");

  if (book === undefined) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-forest/30 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-forest/40 text-sm">Livre introuvable</p>
        </div>
      </div>
    );
  }

  function startEditNotes() {
    setNotesValue(book!.notes ?? "");
    setEditingNotes(true);
  }

  async function saveNotes() {
    await updateBook(book!.id, { notes: notesValue.trim() || undefined });
    setEditingNotes(false);
  }

  function startEditStoreUrl() {
    setStoreUrlValue(book!.storeUrl ?? "");
    setEditingStoreUrl(true);
  }

  async function saveStoreUrl() {
    await updateBook(book!.id, { storeUrl: storeUrlValue.trim() || undefined });
    setEditingStoreUrl(false);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-40 h-60 rounded-xl overflow-hidden shadow-lg bg-cream">
            {book.coverUrl ? (
              <Image
                src={book.coverUrl}
                alt={book.title}
                fill
                className="object-cover"
                sizes="160px"
                unoptimized={book.coverUrl.startsWith("data:")}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-forest/20">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                </svg>
              </div>
            )}
          </div>

          <div className="text-center">
            <h1 className="font-serif text-2xl font-semibold text-ink">{book.title}</h1>
            {book.author && (
              <p className="text-base text-forest/50 mt-1">{book.author}</p>
            )}
          </div>

          <StageBadge stage={book.stage} />

          {/* Store URL */}
          <div className="w-full max-w-xs">
            {editingStoreUrl ? (
              <div className="space-y-2">
                <input
                  type="url"
                  value={storeUrlValue}
                  onChange={(e) => setStoreUrlValue(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-forest/15 rounded-lg text-sm text-ink placeholder:text-forest/30 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/30"
                  placeholder="https://..."
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveStoreUrl}
                    className="flex-1 py-2 bg-forest text-paper rounded-lg text-xs font-medium hover:bg-forest/90 transition-colors"
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={() => setEditingStoreUrl(false)}
                    className="flex-1 py-2 border border-forest/15 rounded-lg text-xs text-forest/60 hover:bg-cream transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : book.storeUrl ? (
              <div className="flex items-center justify-between gap-2">
                <a
                  href={book.storeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-forest/40 hover:text-forest/60 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" x2="21" y1="14" y2="3" />
                  </svg>
                  Voir en boutique
                </a>
                <button
                  onClick={startEditStoreUrl}
                  className="text-xs text-forest/40 underline hover:text-forest/60 transition-colors"
                >
                  Modifier
                </button>
              </div>
            ) : (
              <button
                onClick={startEditStoreUrl}
                className="w-full py-2 text-xs text-forest/40 hover:text-forest/60 transition-colors"
              >
                + Ajouter un lien boutique
              </button>
            )}
          </div>

          {/* Notes */}
          <div className="w-full max-w-xs">
            {editingNotes ? (
              <div className="space-y-2">
                <textarea
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 bg-white border border-forest/15 rounded-lg text-sm text-ink placeholder:text-forest/30 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/30 resize-none"
                  placeholder="Vos notes..."
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveNotes}
                    className="flex-1 py-2 bg-forest text-paper rounded-lg text-xs font-medium hover:bg-forest/90 transition-colors"
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={() => setEditingNotes(false)}
                    className="flex-1 py-2 border border-forest/15 rounded-lg text-xs text-forest/60 hover:bg-cream transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : book.notes ? (
              <div className="bg-cream rounded-xl p-4">
                <p className="text-sm text-forest/70 whitespace-pre-wrap">{book.notes}</p>
                <button
                  onClick={startEditNotes}
                  className="text-xs text-forest/40 underline hover:text-forest/60 mt-2 transition-colors"
                >
                  Modifier
                </button>
              </div>
            ) : (
              <button
                onClick={startEditNotes}
                className="w-full py-2 text-xs text-forest/40 hover:text-forest/60 transition-colors"
              >
                + Ajouter des notes
              </button>
            )}
          </div>

          <div className="w-full max-w-xs space-y-4 mt-4">
            <StageActions
              bookId={book.id}
              stage={book.stage}
              onMoved={() => router.push("/")}
            />
            <div className="pt-4 border-t border-forest/10">
              <DeleteButton bookId={book.id} onDeleted={() => router.push("/")} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
