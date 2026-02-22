"use client";

import { STAGE_CONFIG } from "@/lib/constants";
import type { Book, Stage } from "@/lib/types";
import BookCard from "./BookCard";
import EmptyState from "./EmptyState";
import { useTranslation } from "@/lib/preferences";

interface StageColumnProps {
  stage: Stage;
  books: Book[];
}

export default function StageColumn({ stage, books }: StageColumnProps) {
  const config = STAGE_CONFIG[stage];
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-0 flex-1">
      <div className="flex items-center gap-2 px-3 py-2 mb-2">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-forest/60">
          {t(config.labelKey)}
        </h2>
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-forest/10 text-forest/60 text-xs font-medium">
          {books.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 px-1 pb-2 min-h-[100px]">
        {books.length === 0 ? (
          <EmptyState />
        ) : (
          books.map((book) => <BookCard key={book.id} book={book} />)
        )}
      </div>
    </div>
  );
}
