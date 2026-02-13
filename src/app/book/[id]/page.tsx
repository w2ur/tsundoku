"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import StageBadge from "@/components/StageBadge";
import StageActions from "@/components/StageActions";
import DeleteButton from "@/components/DeleteButton";
import { useBook } from "@/hooks/useBooks";

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const book = useBook(id);
  const router = useRouter();

  if (book === undefined) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-forest/30 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-forest/40 text-sm">Livre introuvable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-40 h-60 rounded-xl overflow-hidden shadow-lg bg-cream">
            {book.coverUrl ? (
              <Image
                src={book.coverUrl}
                alt={book.title}
                fill
                className="object-cover"
                sizes="160px"
                unoptimized={book.coverUrl.startsWith("data:")}
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

          <StageBadge stage={book.stage} />

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
