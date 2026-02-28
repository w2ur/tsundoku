import { describe, it, expect, vi } from "vitest";

vi.mock("./db", () => ({ db: null }));
vi.mock("./supabase", () => ({ supabase: null }));

import { mapBookToSupabase, mapSupabaseToBook } from "./sync";
import type { Book } from "./types";

describe("sync field mapping", () => {
  const localBook: Book = {
    id: "abc-123",
    title: "Test Book",
    author: "Test Author",
    coverUrl: "https://example.com/cover.jpg",
    stage: "tsundoku",
    position: 2,
    createdAt: 1700000000000,
    updatedAt: 1700001000000,
    isReading: true,
    notes: "Great book",
    storeUrl: "https://store.com",
    isbn: "9780306406157",
    olWorkId: "/works/OL123W",
  };

  it("maps local Book to Supabase row (camelCase to snake_case)", () => {
    const row = mapBookToSupabase(localBook, "user-456");
    expect(row.id).toBe("abc-123");
    expect(row.user_id).toBe("user-456");
    expect(row.cover_url).toBe("https://example.com/cover.jpg");
    expect(row.is_reading).toBe(true);
    expect(row.store_url).toBe("https://store.com");
    expect(row.ol_work_id).toBe("/works/OL123W");
    expect(row.created_at).toBe("2023-11-14T22:13:20.000Z");
    expect(row.updated_at).toBe("2023-11-14T22:30:00.000Z");
    expect(row.deleted_at).toBeNull();
  });

  it("maps Supabase row back to local Book (snake_case to camelCase)", () => {
    const row = {
      id: "abc-123",
      user_id: "user-456",
      title: "Test Book",
      author: "Test Author",
      cover_url: "https://example.com/cover.jpg",
      stage: "tsundoku",
      position: 2,
      is_reading: true,
      notes: "Great book",
      store_url: "https://store.com",
      isbn: "9780306406157",
      ol_work_id: "/works/OL123W",
      created_at: "2023-11-14T22:13:20.000Z",
      updated_at: "2023-11-14T22:30:00.000Z",
      deleted_at: null,
    };
    const book = mapSupabaseToBook(row);
    expect(book.id).toBe("abc-123");
    expect(book.coverUrl).toBe("https://example.com/cover.jpg");
    expect(book.isReading).toBe(true);
    expect(book.storeUrl).toBe("https://store.com");
    expect(book.olWorkId).toBe("/works/OL123W");
    expect(book.createdAt).toBe(1700000000000);
    expect(book.updatedAt).toBe(1700001000000);
    expect(book.deletedAt).toBeUndefined();
  });

  it("maps deleted_at correctly", () => {
    const row = {
      id: "abc",
      user_id: "u",
      title: "T",
      author: "A",
      cover_url: "",
      stage: "tsundoku",
      position: 0,
      is_reading: false,
      notes: null,
      store_url: null,
      isbn: null,
      ol_work_id: null,
      created_at: "2023-11-14T22:13:20.000Z",
      updated_at: "2023-11-14T22:13:20.000Z",
      deleted_at: "2023-11-15T00:00:00.000Z",
    };
    const book = mapSupabaseToBook(row);
    expect(book.deletedAt).toBe(new Date("2023-11-15T00:00:00.000Z").getTime());
  });

  it("handles missing optional fields gracefully", () => {
    const minimalBook: Book = {
      id: "min",
      title: "Min",
      author: "Author",
      coverUrl: "",
      stage: "a_acheter",
      position: 0,
      createdAt: 1700000000000,
      updatedAt: 1700000000000,
    };
    const row = mapBookToSupabase(minimalBook, "user-1");
    expect(row.is_reading).toBe(false);
    expect(row.notes).toBeNull();
    expect(row.store_url).toBeNull();
    expect(row.isbn).toBeNull();
    expect(row.ol_work_id).toBeNull();
  });
});
