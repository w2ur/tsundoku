"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import CameraCapture from "@/components/CameraCapture";
import BookForm, { type BookFormData } from "@/components/BookForm";
import BookConfirmation from "@/components/BookConfirmation";
import { addBook } from "@/lib/books";

export default function PhotoAddPage() {
  const router = useRouter();
  const [coverDataUrl, setCoverDataUrl] = useState<string | null>(null);
  const [pending, setPending] = useState<BookFormData | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleConfirm() {
    if (!pending) return;
    setSaving(true);
    await addBook(pending);
    router.push("/");
  }

  if (pending) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
          <h1 className="font-serif text-2xl text-forest mb-6">Confirmer</h1>
          <BookConfirmation
            title={pending.title}
            author={pending.author}
            coverUrl={pending.coverUrl}
            onConfirm={handleConfirm}
            onCancel={() => setPending(null)}
            loading={saving}
          />
        </main>
      </div>
    );
  }

  if (coverDataUrl) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
          <h1 className="font-serif text-2xl text-forest mb-6">Détails du livre</h1>
          <div className="flex justify-center mb-6">
            <img
              src={coverDataUrl}
              alt="Couverture capturée"
              className="w-24 h-36 object-cover rounded-lg shadow-sm"
            />
          </div>
          <BookForm
            initial={{ coverUrl: coverDataUrl }}
            onSubmit={setPending}
            submitLabel="Aperçu"
          />
          <button
            onClick={() => setCoverDataUrl(null)}
            className="w-full mt-3 py-2 text-sm text-forest/40 hover:text-forest/60 transition-colors"
          >
            Reprendre la photo
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
        <h1 className="font-serif text-2xl text-forest mb-6">Photographier la couverture</h1>
        <CameraCapture onCapture={setCoverDataUrl} />
      </main>
    </div>
  );
}
