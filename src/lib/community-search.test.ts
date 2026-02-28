import { describe, it, expect, vi } from "vitest";
import { deduplicateResults } from "./community-search";

vi.mock("./supabase", () => ({ supabase: null }));

describe("deduplicateResults", () => {
  it("removes community results that match OL results by ISBN", () => {
    const ol = [{ title: "Book A", author: "Author", coverUrl: "", isbn: "123", olWorkId: "/works/1" }];
    const community = [{ id: "c1", title: "Book A", author: "Author", isbn: "123", contributed_at: "2024-01-01" }];
    const result = deduplicateResults(ol, community);
    expect(result.community).toHaveLength(0);
  });

  it("removes community results that match OL results by title+author", () => {
    const ol = [{ title: "Book A", author: "Author X", coverUrl: "", olWorkId: "/works/1" }];
    const community = [{ id: "c2", title: "book a", author: "author x", isbn: null, contributed_at: "2024-01-01" }];
    const result = deduplicateResults(ol, community);
    expect(result.community).toHaveLength(0);
  });

  it("keeps community results with no OL match", () => {
    const ol = [{ title: "Book A", author: "Author", coverUrl: "", olWorkId: "/works/1" }];
    const community = [{ id: "c3", title: "Obscure Book", author: "Unknown", isbn: null, contributed_at: "2024-01-01" }];
    const result = deduplicateResults(ol, community);
    expect(result.community).toHaveLength(1);
  });
});
