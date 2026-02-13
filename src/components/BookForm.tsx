"use client";

import { useState } from "react";
import OpenLibraryAutocomplete from "./OpenLibraryAutocomplete";
import type { OpenLibraryResult } from "@/lib/open-library";

export interface BookFormData {
  title: string;
  author: string;
  coverUrl: string;
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

  function handleAutocompleteSelect(result: OpenLibraryResult) {
    setTitle(result.title);
    setAuthor(result.author);
    if (result.coverUrl) setCoverUrl(result.coverUrl);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), author: author.trim(), coverUrl });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <OpenLibraryAutocomplete
        value={title}
        onChange={setTitle}
        onSelect={handleAutocompleteSelect}
      />

      <div>
        <label className="block text-sm font-medium text-forest/70 mb-1">Auteur</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Nom de l'auteur"
          className="w-full px-3 py-2.5 bg-white border border-forest/15 rounded-lg text-sm text-ink placeholder:text-forest/30 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/30"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-forest/70 mb-1">
          Couverture (URL)
        </label>
        <input
          type="text"
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2.5 bg-white border border-forest/15 rounded-lg text-sm text-ink placeholder:text-forest/30 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/30"
        />
      </div>

      {coverUrl && (
        <div className="flex justify-center">
          <img
            src={coverUrl}
            alt="Aperçu couverture"
            className="w-24 h-36 object-cover rounded-lg shadow-sm border border-forest/10"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>
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
