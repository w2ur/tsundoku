import { supabase } from "./supabase";
import type { OpenLibraryResult } from "./open-library";

export interface CommunityBook {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  contributed_at: string;
}

export async function searchCommunityBooks(query: string): Promise<CommunityBook[]> {
  if (!supabase || !query || query.length < 2) return [];

  const { data, error } = await supabase
    .from("community_books")
    .select("*")
    .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
    .limit(10);

  if (error || !data) return [];
  return data as CommunityBook[];
}

export function deduplicateResults(
  olResults: OpenLibraryResult[],
  communityResults: CommunityBook[]
): { ol: OpenLibraryResult[]; community: CommunityBook[] } {
  const olIsbns = new Set(olResults.map((r) => r.isbn).filter(Boolean));
  const olTitleAuthors = new Set(
    olResults.map((r) => `${r.title.toLowerCase()}|${r.author.toLowerCase()}`)
  );

  const filtered = communityResults.filter((c) => {
    if (c.isbn && olIsbns.has(c.isbn)) return false;
    if (olTitleAuthors.has(`${c.title.toLowerCase()}|${c.author.toLowerCase()}`)) return false;
    return true;
  });

  return { ol: olResults, community: filtered };
}
