export interface OpenLibraryResult {
  title: string;
  author: string;
  coverUrl: string;
  isbn?: string;
}

interface OLSearchDoc {
  title: string;
  author_name?: string[];
  cover_i?: number;
  isbn?: string[];
}

export async function searchBooks(query: string): Promise<OpenLibraryResult[]> {
  if (!query || query.length < 2) return [];
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5&fields=title,author_name,cover_i,isbn`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.docs as OLSearchDoc[])
    .filter((doc) => doc.title)
    .map((doc) => ({
      title: doc.title,
      author: doc.author_name?.[0] ?? "",
      coverUrl: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : "",
      isbn: doc.isbn?.[0],
    }));
}

export async function getBookByISBN(isbn: string): Promise<OpenLibraryResult | null> {
  const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const entry = data[`ISBN:${isbn}`];
  if (!entry) return null;
  return {
    title: entry.title ?? "",
    author: entry.authors?.[0]?.name ?? "",
    coverUrl: entry.cover?.medium ?? "",
    isbn,
  };
}
