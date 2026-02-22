"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import StageBadge from "@/components/StageBadge";
import StageActions from "@/components/StageActions";
import DeleteButton from "@/components/DeleteButton";
import BookForm from "@/components/BookForm";
import type { BookFormData } from "@/components/BookForm";
import { useBook } from "@/hooks/useBooks";
import { updateBook } from "@/lib/books";
import { useTranslation } from "@/lib/preferences";

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const book = useBook(id);
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const { t } = useTranslation();

  if (book === undefined) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-forest/30 text-sm">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-forest/40 text-sm">{t("book_notFound")}</p>
        </div>
      </div>
    );
  }

  async function handleSave(data: BookFormData) {
    await updateBook(book!.id, data);
    setEditing(false);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
        <div className="flex flex-col items-center gap-6">
          {editing ? (
            <>
              <BookForm
                initial={{
                  title: book.title,
                  author: book.author,
                  coverUrl: book.coverUrl,
                  notes: book.notes,
                  storeUrl: book.storeUrl,
                }}
                onSubmit={handleSave}
                submitLabel={t("form_save")}
              />
              <button
                onClick={() => setEditing(false)}
                className="w-full max-w-xs py-2 border border-forest/15 rounded-lg text-xs text-forest/60 hover:bg-cream transition-colors"
              >
                {t("cancel")}
              </button>
            </>
          ) : (
            <>
              <div className="relative w-40 h-60 rounded-xl overflow-hidden shadow-lg bg-cream">
                {book.coverUrl ? (
                  <Image
                    src={book.coverUrl}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="160px"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-forest/20">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="text-center">
                <h1 className="font-serif text-2xl font-semibold text-ink">{book.title}</h1>
                {book.author && (
                  <p className="text-base text-forest/50 mt-1">{book.author}</p>
                )}
              </div>

              <button
                onClick={() => setEditing(true)}
                className="text-xs text-forest/40 underline hover:text-forest/60 transition-colors"
              >
                {t("book_edit")}
              </button>
            </>
          )}

          <StageBadge stage={book.stage} />

          {/* Store URL (display mode only) */}
          {!editing && book.storeUrl && (
            <div className="w-full max-w-xs">
              <a
                href={book.storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-forest/40 hover:text-forest/60 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" x2="21" y1="14" y2="3" />
                </svg>
                {t("book_viewStore")}
              </a>
            </div>
          )}

          {/* Notes (display mode only) */}
          {!editing && book.notes && (
            <div className="w-full max-w-xs">
              <div className="bg-cream rounded-xl p-4">
                <p className="text-sm text-forest/70 whitespace-pre-wrap">{book.notes}</p>
              </div>
            </div>
          )}

          <div className="w-full max-w-xs space-y-4 mt-4">
            <StageActions
              bookId={book.id}
              stage={book.stage}
              onMoved={() => router.push("/")}
            />
            <div className="pt-4 border-t border-forest/10">
              <DeleteButton bookId={book.id} onDeleted={() => router.push("/")} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
