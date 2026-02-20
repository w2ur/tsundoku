"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { useBooksByStage } from "@/hooks/useBooks";
import { useIsMobile } from "@/hooks/useIsMobile";
import { moveBookToPosition } from "@/lib/books";
import { STAGES, STAGE_CONFIG } from "@/lib/constants";
import type { Stage, Book } from "@/lib/types";
import { matchesSearch } from "@/lib/search";
import { getUniqueQuotes } from "@/lib/quotes";
import StageTabs from "./StageTabs";
import AddButton from "./AddButton";
import BookCard from "./BookCard";
import SwipeableBookCard from "./SwipeableBookCard";
import EmptyState from "./EmptyState";

interface KanbanBoardProps {
  searchQuery?: string;
}

export default function KanbanBoard({ searchQuery = "" }: KanbanBoardProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const stageParam = searchParams.get("stage");
  const activeTab: Stage = STAGES.includes(stageParam as Stage)
    ? (stageParam as Stage)
    : "tsundoku";

  const setActiveTab = useCallback(
    (stage: Stage) => {
      router.replace(`/?stage=${stage}`, { scroll: false });
    },
    [router]
  );

  const booksByStage = useBooksByStage();
  const isMobile = useIsMobile();

  const preSearchTab = useRef<Stage | null>(null);
  const autoSwitched = useRef(false);

  const handleTabChange = useCallback(
    (stage: Stage) => {
      autoSwitched.current = false;
      setActiveTab(stage);
    },
    [setActiveTab]
  );

  useEffect(() => {
    if (searchQuery.trim()) {
      if (!preSearchTab.current) {
        preSearchTab.current = activeTab;
      }
    } else {
      if (preSearchTab.current) {
        setActiveTab(preSearchTab.current);
        preSearchTab.current = null;
        autoSwitched.current = false;
      }
    }
  }, [searchQuery, activeTab, setActiveTab]);

  const filteredByStage = useMemo(() => {
    if (!booksByStage || !searchQuery.trim()) return booksByStage;
    const result: Record<Stage, Book[]> = {
      a_acheter: [],
      tsundoku: [],
      bibliotheque: [],
      revendre: [],
    };
    for (const stage of STAGES) {
      result[stage] = booksByStage[stage].filter((book) =>
        matchesSearch(book, searchQuery)
      );
    }
    return result;
  }, [booksByStage, searchQuery]);

  useEffect(() => {
    if (!isMobile || !filteredByStage || !searchQuery.trim()) return;

    // If we auto-switched away and original tab now has results, snap back
    if (autoSwitched.current && preSearchTab.current && filteredByStage[preSearchTab.current].length > 0) {
      autoSwitched.current = false;
      setActiveTab(preSearchTab.current);
      return;
    }

    // If current tab has results, stay
    if (filteredByStage[activeTab].length > 0) return;

    // Current tab empty — find the tab with the most matches
    let bestStage: Stage | null = null;
    let bestCount = 0;
    for (const stage of STAGES) {
      const count = filteredByStage[stage].length;
      if (count > bestCount) {
        bestCount = count;
        bestStage = stage;
      }
    }
    if (bestStage) {
      autoSwitched.current = true;
      setActiveTab(bestStage);
    }
  }, [filteredByStage, searchQuery, activeTab, isMobile, setActiveTab]);

  const uniqueQuotes = useMemo(() => {
    const quotes = getUniqueQuotes(STAGES.length);
    return Object.fromEntries(STAGES.map((s, i) => [s, quotes[i]])) as Record<Stage, (typeof quotes)[number]>;
  }, []);

  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      if (searchQuery.trim()) return;
      const { draggableId, source, destination } = result;
      if (!destination) return;
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      )
        return;
      const targetStage = destination.droppableId as Stage;
      await moveBookToPosition(draggableId, targetStage, destination.index);
    },
    [searchQuery]
  );

  if (!filteredByStage) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-forest/30 text-sm">Chargement...</div>
      </div>
    );
  }

  const counts = {
    a_acheter: filteredByStage.a_acheter.length,
    tsundoku: filteredByStage.tsundoku.length,
    bibliotheque: filteredByStage.bibliotheque.length,
    revendre: filteredByStage.revendre.length,
  };

  if (isMobile) {
    const books = filteredByStage[activeTab];
    const isSearching = Boolean(searchQuery.trim());
    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col h-[calc(100vh-65px)]">
          <StageTabs active={activeTab} counts={counts} onChange={handleTabChange} searchActive={isSearching} />
          <Droppable droppableId={activeTab}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex-1 overflow-y-auto p-3 space-y-2"
              >
                {books.length === 0 ? (
                  isSearching ? (
                    <p className="text-center text-sm text-forest/30 py-8">Aucun résultat</p>
                  ) : (
                    <EmptyState quote={uniqueQuotes[activeTab]} />
                  )
                ) : (
                  books.map((book, index) => (
                    <Draggable key={book.id} draggableId={book.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <SwipeableBookCard book={book} />
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <AddButton />
        </div>
      </DragDropContext>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 p-4 md:p-6 h-[calc(100vh-65px)] overflow-hidden">
        {STAGES.map((stage) => (
          <Droppable key={stage} droppableId={stage}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex-1 min-w-0 flex flex-col rounded-xl p-2 transition-colors ${
                  snapshot.isDraggingOver ? "bg-forest/5" : "bg-cream/50"
                }`}
              >
                <div className="flex items-center gap-2 px-3 py-2 mb-2">
                  <h2 className="text-xs font-semibold tracking-widest uppercase text-forest/60">
                    {STAGE_CONFIG[stage].label}
                  </h2>
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-forest/10 text-forest/60 text-xs font-medium">
                    {counts[stage]}
                  </span>
                  <Link
                    href={`/add?stage=${stage}`}
                    className="ml-auto text-forest/30 hover:text-forest/60 transition-colors"
                    aria-label={`Ajouter un livre à ${STAGE_CONFIG[stage].label}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </Link>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 px-1 pb-2 min-h-[100px]">
                  {filteredByStage[stage].length === 0 ? (
                    searchQuery.trim() ? (
                      <p className="text-center text-sm text-forest/30 py-8">Aucun résultat</p>
                    ) : (
                      <EmptyState quote={uniqueQuotes[stage]} />
                    )
                  ) : (
                    filteredByStage[stage].map((book, index) => (
                      <Draggable key={book.id} draggableId={book.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <BookCard book={book} />
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
