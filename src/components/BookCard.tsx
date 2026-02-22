"use client";

import Link from "next/link";
import Image from "next/image";
import type { Book } from "@/lib/types";

export default function BookCard({ book }: { book: Book }) {
  return (
    <Link
      href={`/book/${book.id}`}
      className="group flex gap-3 p-3 rounded-xl bg-surface hover:bg-cream border border-forest/5 hover:border-forest/10 transition-all shadow-sm hover:shadow"
    >
      <div className="relative w-14 h-20 flex-shrink-0 rounded-md overflow-hidden bg-cream">
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={book.title}
            fill
            className="object-cover"
            sizes="56px"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-forest/20">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center min-w-0">
        <h3 className="font-serif text-sm font-semibold text-ink truncate leading-tight">
          {book.title}
        </h3>
        <p className="text-xs text-forest/50 truncate mt-0.5">
          {book.author}
        </p>
        {book.isReading && (
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber mt-1">
            <path d="M12 7v14" />
            <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
          </svg>
        )}
      </div>
    </Link>
  );
}
