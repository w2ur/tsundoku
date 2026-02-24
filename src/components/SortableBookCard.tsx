"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import BookCard from "./BookCard";
import type { Book } from "@/lib/types";

interface SortableBookCardProps {
  book: Book;
  isDragDisabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export default function SortableBookCard({
  book,
  isDragDisabled = false,
  onClick,
}: SortableBookCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: book.id,
    disabled: isDragDisabled,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    WebkitTouchCallout: "none",
    userSelect: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-book-id={book.id}
      {...attributes}
      {...listeners}
    >
      <BookCard book={book} onClick={onClick} />
    </div>
  );
}
