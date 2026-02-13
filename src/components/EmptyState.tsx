"use client";

import { getRandomQuote, type Quote } from "@/lib/quotes";
import { useMemo } from "react";

export default function EmptyState({ showAdd = false, quote: quoteProp }: { showAdd?: boolean; quote?: Quote }) {
  const fallback = useMemo(() => getRandomQuote(), []);
  const quote = quoteProp ?? fallback;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <p className="font-serif text-base italic text-forest/40 max-w-xs leading-relaxed">
        &laquo; {quote.text} &raquo;
      </p>
      <p className="mt-2 text-sm text-forest/30">— {quote.author}</p>
      {showAdd && (
        <a
          href="/add"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-forest text-paper rounded-full text-sm font-medium hover:bg-forest/90 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Ajouter un livre
        </a>
      )}
    </div>
  );
}
