"use client";

import { useState } from "react";
import { deleteBook } from "@/lib/books";
import { useTranslation } from "@/lib/preferences";

interface Props {
  bookId: string;
  onDeleted?: () => void;
}

export default function DeleteButton({ bookId, onDeleted }: Props) {
  const { t } = useTranslation();
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    await deleteBook(bookId);
    onDeleted?.();
  }

  if (confirming) {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => setConfirming(false)}
          className="flex-1 py-2 border border-forest/15 rounded-lg text-sm text-forest/60 hover:bg-cream transition-colors"
        >
          {t("cancel")}
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
        >
          {t("delete_confirm")}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="w-full py-2 text-sm text-red-500/60 hover:text-red-600 transition-colors"
    >
      {t("delete_button")}
    </button>
  );
}
