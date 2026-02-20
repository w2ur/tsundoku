import type { Book } from "./types";

export function matchesSearch(book: Book, query: string): boolean {
  const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;
  const haystack = `${book.title} ${book.author}`.toLowerCase();
  return tokens.every((token) => haystack.includes(token));
}
