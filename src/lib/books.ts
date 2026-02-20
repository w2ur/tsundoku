import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import type { Book, Stage } from "./types";

export async function addBook(
  data: Pick<Book, "title" | "author" | "coverUrl"> & {
    stage?: Stage;
    notes?: string;
    storeUrl?: string;
    isbn?: string;
  }
): Promise<Book> {
  const stage = data.stage ?? "a_acheter";
  const booksInStage = await db.books.where("stage").equals(stage).toArray();
  const maxPosition = booksInStage.reduce(
    (max, b) => Math.max(max, b.position ?? 0),
    -1
  );
  const book: Book = {
    id: uuidv4(),
    title: data.title,
    author: data.author,
    coverUrl: data.coverUrl,
    stage,
    position: maxPosition + 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...(data.notes && { notes: data.notes }),
    ...(data.storeUrl && { storeUrl: data.storeUrl }),
    ...(data.isbn && { isbn: data.isbn }),
  };
  await db.books.add(book);
  return book;
}

export async function getBook(id: string): Promise<Book | undefined> {
  return db.books.get(id);
}

export async function updateBookStage(id: string, stage: Stage): Promise<void> {
  await db.books.update(id, { stage, updatedAt: Date.now() });
}

export async function updateBook(
  id: string,
  data: Partial<Pick<Book, "title" | "author" | "coverUrl" | "stage" | "notes" | "storeUrl" | "isbn">>
): Promise<void> {
  await db.books.update(id, { ...data, updatedAt: Date.now() });
}

export async function deleteBook(id: string): Promise<void> {
  await db.books.delete(id);
}

export async function getAllBooks(): Promise<Book[]> {
  return db.books.toArray();
}

export async function exportBooks(): Promise<Book[]> {
  return db.books.toArray();
}

export async function importBooks(
  books: Book[],
  mode: "merge" | "replace"
): Promise<void> {
  if (mode === "replace") {
    await db.books.clear();
  }
  await db.books.bulkPut(books);
}

export function computeReorder(
  orderedIds: string[],
  movedId: string,
  targetIndex: number
): string[] {
  const result = orderedIds.filter((id) => id !== movedId);
  result.splice(targetIndex, 0, movedId);
  return result;
}
