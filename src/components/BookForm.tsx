"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import OpenLibraryAutocomplete from "./OpenLibraryAutocomplete";
import type { OpenLibraryResult } from "@/lib/open-library";

const CameraCapture = dynamic(() => import("./CameraCapture"), { ssr: false });

export interface BookFormData {
  title: string;
  author: string;
  coverUrl: string;
  notes?: string;
  storeUrl?: string;
}

interface Props {
  initial?: Partial<BookFormData>;
  onSubmit: (data: BookFormData) => void;
  submitLabel?: string;
}

export default function BookForm({ initial, onSubmit, submitLabel = "Ajouter" }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [author, setAuthor] = useState(initial?.author ?? "");
  const [coverUrl, setCoverUrl] = useState(initial?.coverUrl ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [storeUrl, setStoreUrl] = useState(initial?.storeUrl ?? "");
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [noResults, setNoResults] = useState(false);

  function handleAutocompleteSelect(result: OpenLibraryResult) {
    setTitle(result.title);
    setAuthor(result.author);
    if (result.coverUrl) setCoverUrl(result.coverUrl);
    setNoResults(false);
  }

  function handleNoResults(empty: boolean) {
    setNoResults(empty);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      author: author.trim(),
      coverUrl,
      ...(notes.trim() && { notes: notes.trim() }),
      ...(storeUrl.trim() && { storeUrl: storeUrl.trim() }),
    });
  }

  const inputClass =
    "w-full px-3 py-2.5 bg-white border border-forest/15 rounded-lg text-sm text-ink placeholder:text-forest/30 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/30";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <OpenLibraryAutocomplete
        value={title}
        onChange={setTitle}
        onSelect={handleAutocompleteSelect}
        onNoResults={handleNoResults}
      />

      <div>
        <label className="block text-sm font-medium text-forest/70 mb-1">Auteur</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Nom de l'auteur"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-forest/70 mb-1">
          Couverture
        </label>
        {coverUrl && !showCoverPicker ? (
          <div className="flex items-start gap-3">
            <img
              src={coverUrl}
              alt="Aperçu couverture"
              className="w-16 h-24 object-cover rounded-lg shadow-sm border border-forest/10"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <button
              type="button"
              onClick={() => { setCoverUrl(""); setShowCoverPicker(true); }}
              className="text-xs text-forest/40 underline hover:text-forest/60 mt-1"
            >
              Changer
            </button>
          </div>
        ) : showCoverPicker ? (
          <div className="space-y-2">
            <CameraCapture
              onCapture={(dataUrl) => {
                setCoverUrl(dataUrl);
                setShowCoverPicker(false);
              }}
            />
            <button
              type="button"
              onClick={() => setShowCoverPicker(false)}
              className="text-xs text-forest/40 underline hover:text-forest/60"
            >
              Annuler
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowCoverPicker(true)}
              className="flex-shrink-0 px-3 py-2.5 border border-forest/15 rounded-lg text-forest/50 hover:bg-cream transition-colors"
              title="Prendre une photo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-forest/70 mb-1">
          Lien boutique <span className="font-normal text-forest/40">(optionnel)</span>
        </label>
        <input
          type="url"
          value={storeUrl}
          onChange={(e) => setStoreUrl(e.target.value)}
          placeholder="https://www.amazon.fr/..."
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-forest/70 mb-1">
          Notes <span className="font-normal text-forest/40">(optionnel)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Recommandé par..., offert par..."
          rows={2}
          className={`${inputClass} resize-none`}
        />
      </div>

      {noResults && title.length >= 3 && (
        <p className="text-xs text-forest/40 text-center">
          Livre introuvable sur OpenLibrary ?{" "}
          <a
            href="https://openlibrary.org/books/add"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-forest/60"
          >
            Ajoutez-le
          </a>
        </p>
      )}

      <button
        type="submit"
        disabled={!title.trim()}
        className="w-full py-3 bg-forest text-paper rounded-lg font-medium text-sm hover:bg-forest/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {submitLabel}
      </button>
    </form>
  );
}
