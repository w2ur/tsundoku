"use client";

import { useState, useRef } from "react";
import { parseBackup } from "@/lib/backup";
import { importBooks } from "@/lib/books";

export default function ImportButton() {
  const [status, setStatus] = useState<"idle" | "confirm" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [bookCount, setBookCount] = useState(0);
  const [pendingBooks, setPendingBooks] = useState<Parameters<typeof importBooks>[0] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = parseBackup(reader.result as string);
      if (result.error) {
        setMessage(result.error);
        setStatus("error");
        return;
      }
      setPendingBooks(result.books);
      setBookCount(result.books.length);
      setStatus("confirm");
    };
    reader.readAsText(file);

    // Reset input
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleImport(mode: "merge" | "replace") {
    if (!pendingBooks) return;
    await importBooks(pendingBooks, mode);
    setMessage(`${bookCount} livre${bookCount > 1 ? "s" : ""} importé${bookCount > 1 ? "s" : ""}`);
    setStatus("success");
    setPendingBooks(null);
  }

  return (
    <div className="space-y-3">
      {status === "idle" && (
        <label className="block w-full py-3 border border-forest/15 rounded-lg font-medium text-sm text-center text-forest/60 cursor-pointer hover:bg-cream transition-colors">
          Importer une sauvegarde
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}

      {status === "confirm" && (
        <div className="space-y-3 p-4 bg-white border border-forest/10 rounded-xl">
          <p className="text-sm text-ink">
            {bookCount} livre{bookCount > 1 ? "s" : ""} trouvé{bookCount > 1 ? "s" : ""}.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleImport("merge")}
              className="flex-1 py-2.5 bg-forest text-paper rounded-lg text-sm font-medium hover:bg-forest/90 transition-colors"
            >
              Fusionner
            </button>
            <button
              onClick={() => handleImport("replace")}
              className="flex-1 py-2.5 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
            >
              Remplacer tout
            </button>
          </div>
          <button
            onClick={() => { setStatus("idle"); setPendingBooks(null); }}
            className="w-full py-2 text-sm text-forest/40 hover:text-forest/60"
          >
            Annuler
          </button>
        </div>
      )}

      {status === "success" && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 text-center">
          {message}
          <button onClick={() => setStatus("idle")} className="block mx-auto mt-2 text-xs underline">
            OK
          </button>
        </div>
      )}

      {status === "error" && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 text-center">
          {message}
          <button onClick={() => setStatus("idle")} className="block mx-auto mt-2 text-xs underline">
            Réessayer
          </button>
        </div>
      )}
    </div>
  );
}
