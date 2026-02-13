"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BookConfirmation from "@/components/BookConfirmation";
import { addBook } from "@/lib/books";

export default function UrlAddPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"input" | "loading" | "confirm" | "error">("input");
  const [bookData, setBookData] = useState<{ title: string; author: string; coverUrl: string } | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleFetch() {
    if (!url.trim()) return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de l'extraction");
        setStatus("error");
        return;
      }
      setBookData(data);
      setStatus("confirm");
    } catch {
      setError("Erreur réseau. Vérifiez l'URL et réessayez.");
      setStatus("error");
    }
  }

  async function handleConfirm() {
    if (!bookData) return;
    setSaving(true);
    await addBook(bookData);
    router.push("/");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
        <h1 className="font-serif text-2xl text-forest mb-6">Coller un lien</h1>

        {(status === "input" || status === "error") && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-forest/70 mb-1">URL du livre</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.amazon.fr/..."
                className="w-full px-3 py-2.5 bg-white border border-forest/15 rounded-lg text-sm text-ink placeholder:text-forest/30 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/30"
                onKeyDown={(e) => e.key === "Enter" && handleFetch()}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              onClick={handleFetch}
              disabled={!url.trim()}
              className="w-full py-3 bg-forest text-paper rounded-lg font-medium text-sm hover:bg-forest/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Extraire les informations
            </button>
            <p className="text-xs text-center text-forest/30">
              Fonctionne avec Amazon, Babelio, Goodreads, Fnac...
            </p>
          </div>
        )}

        {status === "loading" && (
          <div className="flex items-center justify-center h-48">
            <div className="animate-pulse text-forest/30 text-sm">Extraction en cours...</div>
          </div>
        )}

        {status === "confirm" && bookData && (
          <BookConfirmation
            title={bookData.title}
            author={bookData.author}
            coverUrl={bookData.coverUrl}
            onConfirm={handleConfirm}
            onCancel={() => setStatus("input")}
            loading={saving}
          />
        )}
      </main>
    </div>
  );
}
