"use client";

import Link from "next/link";
import Image from "next/image";
import type { Book } from "@/lib/types";

export default function BookCard({ book }: { book: Book }) {
  return (
    <Link
      href={`/book/${book.id}`}
      className="group flex gap-3 p-3 rounded-xl bg-white hover:bg-cream border border-forest/5 hover:border-forest/10 transition-all shadow-sm hover:shadow"
    >
      <div className="relative w-14 h-20 flex-shrink-0 rounded-md overflow-hidden bg-cream">
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={book.title}
            fill
            className="object-cover"
            sizes="56px"
            unoptimized={book.coverUrl.startsWith("data:")}
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
      </div>
    </Link>
  );
}
