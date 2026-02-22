"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "@/lib/preferences";

interface Props {
  title: string;
  author: string;
  coverUrl: string;
  notes?: string;
  storeUrl?: string;
  onConfirm: (extra: { notes?: string; storeUrl?: string }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function BookConfirmation({
  title,
  author,
  coverUrl,
  notes: initialNotes,
  storeUrl: initialStoreUrl,
  onConfirm,
  onCancel,
  loading,
}: Props) {
  const { t } = useTranslation();
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [storeUrl, setStoreUrl] = useState(initialStoreUrl ?? "");

  const inputClass =
    "w-full px-3 py-2.5 bg-surface border border-forest/15 rounded-lg text-sm text-ink placeholder:text-forest/30 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/30";

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <div className="relative w-32 h-48 rounded-xl overflow-hidden shadow-lg bg-cream">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="128px"
            unoptimized={coverUrl.startsWith("data:")}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-forest/20">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
          </div>
        )}
      </div>

      <div className="text-center">
        <h2 className="font-serif text-xl font-semibold text-ink">{title}</h2>
        {author && <p className="text-sm text-forest/50 mt-1">{author}</p>}
      </div>

      <div className="w-full max-w-xs space-y-3">
        <div>
          <label className="block text-sm font-medium text-forest/70 mb-1">
            {t("form_storeUrl")} <span className="font-normal text-forest/40">{t("optional")}</span>
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
            {t("form_notes")} <span className="font-normal text-forest/40">{t("optional")}</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("form_notesPlaceholder")}
            rows={2}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      <div className="flex gap-3 w-full max-w-xs">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 border border-forest/15 rounded-lg text-sm font-medium text-forest/60 hover:bg-cream transition-colors"
        >
          {t("cancel")}
        </button>
        <button
          onClick={() =>
            onConfirm({
              ...(notes.trim() && { notes: notes.trim() }),
              ...(storeUrl.trim() && { storeUrl: storeUrl.trim() }),
            })
          }
          disabled={loading}
          className="flex-1 py-2.5 bg-forest text-paper rounded-lg text-sm font-medium hover:bg-forest/90 disabled:opacity-50 transition-colors"
        >
          {loading ? "..." : t("form_add")}
        </button>
      </div>
    </div>
  );
}
