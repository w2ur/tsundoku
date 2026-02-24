"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useBooksByStage } from "@/hooks/useBooks";
import { useIsMobile } from "@/hooks/useIsMobile";
import { moveBookToPosition } from "@/lib/books";
import { STAGES, STAGE_CONFIG } from "@/lib/constants";
import type { Stage, Book } from "@/lib/types";
import { matchesSearch } from "@/lib/search";
import { getUniqueQuotes } from "@/lib/quotes";
import { useTranslation } from "@/lib/preferences";
import StageTabs from "./StageTabs";
import AddButton from "./AddButton";
import BookCard from "./BookCard";
import SortableBookCard from "./SortableBookCard";
import EmptyState from "./EmptyState";

interface KanbanBoardProps {
  searchQuery?: string;
  scrollToBookId?: string | null;
  onScrollToBook?: (bookId: string | null) => void;
  onClearSearch?: () => void;
}

function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 overflow-y-auto space-y-2 px-1 pb-2 min-h-[100px] rounded-lg transition-colors ${
        isOver ? "bg-forest/5" : ""
      }`}
    >
      {children}
    </div>
  );
}

export default function KanbanBoard({
  searchQuery = "",
  scrollToBookId = null,
  onScrollToBook,
  onClearSearch,
}: KanbanBoardProps) {
  const { t, locale } = useTranslation();
  const [activeTab, setActiveTabState] = useState<Stage>("tsundoku");

  // Initialize from URL on mount (client-side only, avoids SSR mismatch)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stage = params.get("stage");
    if (STAGES.includes(stage as Stage)) {
      setActiveTabState(stage as Stage);
    }
  }, []);

  const setActiveTab = useCallback((stage: Stage) => {
    setActiveTabState(stage);
    window.history.replaceState(null, "", `/?stage=${stage}`);
  }, []);

  // Handle browser back/forward
  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      const stage = params.get("stage");
      if (STAGES.includes(stage as Stage)) {
        setActiveTabState(stage as Stage);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

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
    const quotes = getUniqueQuotes(STAGES.length, locale);
    return Object.fromEntries(STAGES.map((s, i) => [s, quotes[i]])) as Record<Stage, (typeof quotes)[number]>;
  }, [locale]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
    useSensor(KeyboardSensor)
  );

  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const isSearching = Boolean(searchQuery.trim());

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const bookId = event.active.id as string;
      if (!filteredByStage) return;
      for (const stage of STAGES) {
        const found = filteredByStage[stage].find((b) => b.id === bookId);
        if (found) {
          setActiveBook(found);
          break;
        }
      }
    },
    [filteredByStage]
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActiveBook(null);
      if (isSearching) return;

      const { active, over } = event;
      if (!over) return;

      const bookId = active.id as string;
      const overId = over.id as string;

      // Check if dropped on empty column (overId is a stage name)
      let targetStage: Stage | null = null;
      let targetIndex = 0;

      if (STAGES.includes(overId as Stage)) {
        targetStage = overId as Stage;
        targetIndex = filteredByStage ? filteredByStage[targetStage].length : 0;
      } else if (filteredByStage) {
        // over.id is a book — find its stage and index
        for (const stage of STAGES) {
          const idx = filteredByStage[stage].findIndex((b) => b.id === overId);
          if (idx !== -1) {
            targetStage = stage;
            targetIndex = idx;
            break;
          }
        }
      }

      if (!targetStage) return;

      // Skip if same position
      if (filteredByStage) {
        for (const stage of STAGES) {
          const idx = filteredByStage[stage].findIndex((b) => b.id === bookId);
          if (idx !== -1) {
            if (stage === targetStage && idx === targetIndex) return;
            break;
          }
        }
      }

      await moveBookToPosition(bookId, targetStage, targetIndex);
    },
    [isSearching, filteredByStage]
  );

  const [slideTarget, setSlideTarget] = useState<Stage | null>(null);
  const slideDirection = useRef<"left" | "right" | null>(null);

  const handleMobileDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const currentSlideTarget = slideTarget;
      setActiveBook(null);
      setSlideTarget(null);
      slideDirection.current = null;

      if (isSearching) return;
      const { active, over } = event;
      const bookId = active.id as string;

      // If we have a slide target, move to adjacent stage
      if (currentSlideTarget) {
        await moveBookToPosition(bookId, currentSlideTarget, 0);
        setActiveTab(currentSlideTarget);
        return;
      }

      // Otherwise, vertical reorder within current tab
      if (!over || active.id === over.id) return;
      const books = filteredByStage ? filteredByStage[activeTab] : [];
      const overIndex = books.findIndex((b) => b.id === over.id);
      if (overIndex === -1) return;
      await moveBookToPosition(bookId, activeTab, overIndex);
    },
    [isSearching, filteredByStage, activeTab, slideTarget, setActiveTab]
  );

  const handleDragMove = useCallback(
    () => {
      // Column slide-in logic — implemented in Task 5
    },
    []
  );

  const handleSearchResultClick = useCallback(
    (e: React.MouseEvent, book: Book) => {
      if (!searchQuery.trim()) return;
      e.preventDefault();
      // Reset preSearchTab so the restoration effect doesn't override the teleport tab switch
      preSearchTab.current = null;
      // Record which book to scroll to
      onScrollToBook?.(book.id);
      // Switch to the correct tab on mobile
      if (isMobile) {
        setActiveTab(book.stage);
      }
      // Clear search (re-enables DnD and shows all books)
      onClearSearch?.();
    },
    [searchQuery, onScrollToBook, onClearSearch, isMobile, setActiveTab]
  );

  useEffect(() => {
    if (!scrollToBookId) return;

    // Small delay to let DOM update after search clears and tab switches
    const timer = setTimeout(() => {
      const element = document.querySelector(`[data-book-id="${CSS.escape(scrollToBookId)}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("glow-highlight");
        setTimeout(() => {
          element.classList.remove("glow-highlight");
        }, 2000);
      }
      onScrollToBook?.(null);
    }, 100);

    return () => clearTimeout(timer);
  }, [scrollToBookId, onScrollToBook]);

  if (!filteredByStage) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-forest/30 text-sm">{t("loading")}</div>
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

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleMobileDragEnd}
        onDragMove={handleDragMove}
      >
        <div className="flex flex-col h-full">
          <StageTabs active={activeTab} counts={counts} onChange={handleTabChange} searchActive={isSearching} />

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <SortableContext
              items={books.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              {books.length === 0 ? (
                isSearching ? (
                  <p className="text-center text-sm text-forest/30 py-8">{t("noResults")}</p>
                ) : (
                  <EmptyState quote={uniqueQuotes[activeTab]} />
                )
              ) : (
                books.map((book) => (
                  <SortableBookCard
                    key={book.id}
                    book={book}
                    isDragDisabled={isSearching}
                    onClick={isSearching ? (e) => handleSearchResultClick(e, book) : undefined}
                  />
                ))
              )}
            </SortableContext>
          </div>

          <AddButton />
        </div>
        <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
          {activeBook ? (
            <div className="opacity-90 shadow-lg rounded-xl">
              <BookCard book={activeBook} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 p-4 md:p-6 h-full overflow-hidden">
        {STAGES.map((stage) => {
          const stageBooks = filteredByStage[stage];
          return (
            <div key={stage} className="flex-1 min-w-0 flex flex-col rounded-xl p-2 bg-cream/50">
              <div className="flex items-center gap-2 px-3 py-2 mb-2">
                <h2 className="text-xs font-semibold tracking-widest uppercase text-forest/60">
                  {t(STAGE_CONFIG[stage].labelKey)}
                </h2>
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-forest/10 text-forest/60 text-xs font-medium">
                  {counts[stage]}
                </span>
                <Link
                  href={`/add?stage=${stage}`}
                  className="ml-auto text-forest/30 hover:text-forest/60 transition-colors"
                  aria-label={t("kanban_addBookToStage").replace("{stage}", t(STAGE_CONFIG[stage].labelKey))}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                </Link>
              </div>
              <DroppableColumn id={stage}>
                <SortableContext
                  items={stageBooks.map((b) => b.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {stageBooks.length === 0 ? (
                    searchQuery.trim() ? (
                      <p className="text-center text-sm text-forest/30 py-8">{t("noResults")}</p>
                    ) : (
                      <EmptyState quote={uniqueQuotes[stage]} />
                    )
                  ) : (
                    stageBooks.map((book) => (
                      <SortableBookCard
                        key={book.id}
                        book={book}
                        isDragDisabled={isSearching}
                        onClick={(e) => handleSearchResultClick(e, book)}
                      />
                    ))
                  )}
                </SortableContext>
              </DroppableColumn>
            </div>
          );
        })}
      </div>
      <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
        {activeBook ? (
          <div className="opacity-90 shadow-lg rounded-xl">
            <BookCard book={activeBook} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
