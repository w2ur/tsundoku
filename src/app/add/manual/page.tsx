"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BookForm, { type BookFormData } from "@/components/BookForm";
import BookConfirmation from "@/components/BookConfirmation";
import { addBook } from "@/lib/books";

export default function ManualAddPage() {
  const router = useRouter();
  const [pending, setPending] = useState<BookFormData | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    if (!pending) return;
    setLoading(true);
    await addBook(pending);
    router.push("/");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
        <h1 className="font-serif text-2xl text-forest mb-6">Saisie manuelle</h1>
        {pending ? (
          <BookConfirmation
            title={pending.title}
            author={pending.author}
            coverUrl={pending.coverUrl}
            onConfirm={handleConfirm}
            onCancel={() => setPending(null)}
            loading={loading}
          />
        ) : (
          <BookForm onSubmit={setPending} submitLabel="Aperçu" />
        )}
      </main>
    </div>
  );
}
