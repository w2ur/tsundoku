"use client";

import { exportBooks } from "@/lib/books";
import { downloadBackup } from "@/lib/backup";
import { useTranslation } from "@/lib/preferences";

export default function ExportButton() {
  const { t } = useTranslation();

  async function handleExport() {
    const books = await exportBooks();
    downloadBackup(books);
  }

  return (
    <button
      onClick={handleExport}
      className="w-full py-3 bg-forest text-paper rounded-lg font-medium text-sm hover:bg-forest/90 transition-colors"
    >
      {t("export_library")}
    </button>
  );
}
