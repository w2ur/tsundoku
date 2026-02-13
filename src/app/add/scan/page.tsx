"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BookConfirmation from "@/components/BookConfirmation";
import { getBookByISBN } from "@/lib/open-library";
import { addBook } from "@/lib/books";

const BarcodeScanner = dynamic(() => import("@/components/BarcodeScanner"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-48 bg-cream rounded-xl">
      <p className="text-sm text-forest/30">Chargement du scanner...</p>
    </div>
  ),
});

export default function ScanPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"scanning" | "loading" | "confirm" | "error">("scanning");
  const [bookData, setBookData] = useState<{ title: string; author: string; coverUrl: string } | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleScan(isbn: string) {
    setStatus("loading");
    const result = await getBookByISBN(isbn);
    if (result) {
      setBookData({ title: result.title, author: result.author, coverUrl: result.coverUrl });
      setStatus("confirm");
    } else {
      setError(`ISBN ${isbn} introuvable. Essayez la saisie manuelle.`);
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
        <h1 className="font-serif text-2xl text-forest mb-6">Scanner un code-barres</h1>

        {status === "scanning" && (
          <BarcodeScanner
            onScan={handleScan}
            onError={(msg) => { setError(msg); setStatus("error"); }}
          />
        )}

        {status === "loading" && (
          <div className="flex items-center justify-center h-48">
            <div className="animate-pulse text-forest/30 text-sm">Recherche du livre...</div>
          </div>
        )}

        {status === "confirm" && bookData && (
          <BookConfirmation
            title={bookData.title}
            author={bookData.author}
            coverUrl={bookData.coverUrl}
            onConfirm={handleConfirm}
            onCancel={() => setStatus("scanning")}
            loading={saving}
          />
        )}

        {status === "error" && (
          <div className="text-center space-y-4">
            <p className="text-sm text-red-500">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setError(""); setStatus("scanning"); }}
                className="px-4 py-2 bg-forest text-paper rounded-lg text-sm"
              >
                Réessayer
              </button>
              <a href="/add/manual" className="px-4 py-2 border border-forest/15 rounded-lg text-sm text-forest/60">
                Saisie manuelle
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
