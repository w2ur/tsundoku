import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockAdd, mockGet, mockUpdate, mockDelete, mockClear, mockBulkPut, mockToArray, mockWhereToArray } = vi.hoisted(() => ({
  mockAdd: vi.fn(),
  mockGet: vi.fn(),
  mockUpdate: vi.fn(),
  mockDelete: vi.fn(),
  mockClear: vi.fn(),
  mockBulkPut: vi.fn(),
  mockToArray: vi.fn(),
  mockWhereToArray: vi.fn(),
}));

vi.mock("./db", () => ({
  db: {
    books: {
      add: mockAdd,
      get: mockGet,
      update: mockUpdate,
      delete: mockDelete,
      clear: mockClear,
      bulkPut: mockBulkPut,
      toArray: mockToArray,
      where: () => ({ equals: () => ({ toArray: mockWhereToArray }) }),
    },
  },
}));

vi.mock("uuid", () => ({
  v4: () => "mock-uuid-1234",
}));

import { addBook, getBook, updateBookStage, updateBook, deleteBook, getAllBooks, importBooks, computeReorder, moveBookToPosition } from "./books";
import type { Book } from "./types";

function makeBook(overrides: Partial<Book> & { id: string; stage: Book["stage"]; position: number }): Book {
  return {
    title: "Book",
    author: "Author",
    coverUrl: "",
    createdAt: 1000,
    updatedAt: 1000,
    ...overrides,
  } as Book;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("addBook", () => {
  it("creates a book with position 0 and shifts existing books", async () => {
    mockWhereToArray.mockResolvedValue([
      { id: "existing-1", stage: "a_acheter", position: 0 },
      { id: "existing-2", stage: "a_acheter", position: 1 },
    ]);
    mockAdd.mockResolvedValue(undefined);
    mockUpdate.mockResolvedValue(undefined);

    const book = await addBook({
      title: "Le Petit Prince",
      author: "Saint-Exupery",
      coverUrl: "",
    });

    expect(book.id).toBe("mock-uuid-1234");
    expect(book.title).toBe("Le Petit Prince");
    expect(book.author).toBe("Saint-Exupery");
    expect(book.stage).toBe("a_acheter");
    expect(book.position).toBe(0);
    expect(book.createdAt).toBeTypeOf("number");
    expect(book.updatedAt).toBeTypeOf("number");
    expect(mockUpdate).toHaveBeenCalledWith("existing-1", { position: 1 });
    expect(mockUpdate).toHaveBeenCalledWith("existing-2", { position: 2 });
    expect(mockAdd).toHaveBeenCalledWith(expect.objectContaining({ position: 0 }));
  });

  it("uses provided stage instead of default", async () => {
    mockWhereToArray.mockResolvedValue([]);
    mockAdd.mockResolvedValue(undefined);

    const book = await addBook({
      title: "Test",
      author: "Author",
      coverUrl: "",
      stage: "tsundoku",
    });

    expect(book.stage).toBe("tsundoku");
  });

  it("includes optional fields when provided", async () => {
    mockWhereToArray.mockResolvedValue([]);
    mockAdd.mockResolvedValue(undefined);

    const book = await addBook({
      title: "Test",
      author: "Author",
      coverUrl: "",
      notes: "Great book",
      storeUrl: "https://example.com",
      isbn: "978-0-123456-78-9",
    });

    expect(book.notes).toBe("Great book");
    expect(book.storeUrl).toBe("https://example.com");
    expect(book.isbn).toBe("978-0-123456-78-9");
  });
});

describe("updateBookStage", () => {
  it("updates stage and updatedAt", async () => {
    mockUpdate.mockResolvedValue(undefined);

    await updateBookStage("id-1", "bibliotheque");

    expect(mockUpdate).toHaveBeenCalledWith("id-1", {
      stage: "bibliotheque",
      updatedAt: expect.any(Number),
    });
  });
});

describe("updateBook", () => {
  it("updates provided fields and updatedAt", async () => {
    mockUpdate.mockResolvedValue(undefined);

    await updateBook("id-1", { title: "New Title", author: "New Author" });

    expect(mockUpdate).toHaveBeenCalledWith("id-1", {
      title: "New Title",
      author: "New Author",
      updatedAt: expect.any(Number),
    });
  });
});

describe("deleteBook", () => {
  it("calls delete with the correct id", async () => {
    mockDelete.mockResolvedValue(undefined);

    await deleteBook("id-1");

    expect(mockDelete).toHaveBeenCalledWith("id-1");
  });
});

describe("getAllBooks", () => {
  it("returns all books from the database", async () => {
    const mockBooks: Book[] = [
      {
        id: "1",
        title: "Book 1",
        author: "Author 1",
        coverUrl: "",
        stage: "tsundoku",
        position: 0,
        createdAt: 1000,
        updatedAt: 1000,
      },
    ];
    mockToArray.mockResolvedValue(mockBooks);

    const result = await getAllBooks();

    expect(result).toEqual(mockBooks);
  });
});

describe("importBooks", () => {
  const mockBooks: Book[] = [
    {
      id: "1",
      title: "Book 1",
      author: "Author 1",
      coverUrl: "",
      stage: "tsundoku",
      position: 0,
      createdAt: 1000,
      updatedAt: 1000,
    },
  ];

  it("clears database before importing in replace mode", async () => {
    mockClear.mockResolvedValue(undefined);
    mockBulkPut.mockResolvedValue(undefined);

    await importBooks(mockBooks, "replace");

    expect(mockClear).toHaveBeenCalled();
    expect(mockBulkPut).toHaveBeenCalledWith(mockBooks);
  });

  it("does not clear database in merge mode", async () => {
    mockBulkPut.mockResolvedValue(undefined);

    await importBooks(mockBooks, "merge");

    expect(mockClear).not.toHaveBeenCalled();
    expect(mockBulkPut).toHaveBeenCalledWith(mockBooks);
  });
});

describe("computeReorder", () => {
  it("moves item forward in list", () => {
    expect(computeReorder(["a", "b", "c"], "a", 2)).toEqual(["b", "c", "a"]);
  });

  it("moves item to top", () => {
    expect(computeReorder(["a", "b", "c"], "c", 0)).toEqual(["c", "a", "b"]);
  });

  it("inserts item not in list", () => {
    expect(computeReorder(["a", "b"], "c", 1)).toEqual(["a", "c", "b"]);
  });

  it("handles empty list", () => {
    expect(computeReorder([], "a", 0)).toEqual(["a"]);
  });

  it("no-ops when position unchanged", () => {
    expect(computeReorder(["a", "b", "c"], "b", 1)).toEqual(["a", "b", "c"]);
  });
});

describe("moveBookToPosition", () => {
  it("reorders within same column", async () => {
    const books = [
      makeBook({ id: "a", stage: "tsundoku", position: 0 }),
      makeBook({ id: "b", stage: "tsundoku", position: 1 }),
      makeBook({ id: "c", stage: "tsundoku", position: 2 }),
    ];
    mockToArray.mockResolvedValue(books);
    mockUpdate.mockResolvedValue(undefined);

    await moveBookToPosition("c", "tsundoku", 0);

    expect(mockUpdate).toHaveBeenCalledWith("c", { position: 0, updatedAt: expect.any(Number) });
    expect(mockUpdate).toHaveBeenCalledWith("a", { position: 1 });
    expect(mockUpdate).toHaveBeenCalledWith("b", { position: 2 });
  });

  it("moves book to top of different column", async () => {
    const books = [
      makeBook({ id: "a", stage: "tsundoku", position: 0 }),
      makeBook({ id: "b", stage: "tsundoku", position: 1 }),
      makeBook({ id: "c", stage: "bibliotheque", position: 0 }),
    ];
    mockToArray.mockResolvedValue(books);
    mockUpdate.mockResolvedValue(undefined);

    await moveBookToPosition("a", "bibliotheque", 0);

    // a moves to bibliotheque at position 0
    expect(mockUpdate).toHaveBeenCalledWith("a", {
      stage: "bibliotheque",
      position: 0,
      updatedAt: expect.any(Number),
    });
    // c shifts to position 1 in bibliotheque
    expect(mockUpdate).toHaveBeenCalledWith("c", { position: 1 });
    // b becomes position 0 in tsundoku (was 1, now fills gap)
    expect(mockUpdate).toHaveBeenCalledWith("b", { position: 0 });
  });

  it("does nothing if book not found", async () => {
    mockToArray.mockResolvedValue([]);
    await moveBookToPosition("nonexistent", "tsundoku", 0);
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
