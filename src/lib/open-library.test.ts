import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchBooks } from "./open-library";

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("searchBooks", () => {
  it("returns empty array for short queries", async () => {
    const results = await searchBooks("a");
    expect(results).toEqual([]);
  });

  it("sends query with author when provided", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ docs: [] }),
    });
    vi.stubGlobal("fetch", mockFetch);

    await searchBooks("Le Petit Prince", "Saint-Exupéry");

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain(encodeURIComponent("Le Petit Prince Saint-Exupéry"));
  });

  it("sends query without author when not provided", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ docs: [] }),
    });
    vi.stubGlobal("fetch", mockFetch);

    await searchBooks("Le Petit Prince");

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain(encodeURIComponent("Le Petit Prince"));
    expect(calledUrl).not.toContain("Saint");
  });

  it("uses custom limit when provided", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ docs: [] }),
    });
    vi.stubGlobal("fetch", mockFetch);

    await searchBooks("test", undefined, 3);

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("limit=3");
  });

  it("defaults to limit=5", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ docs: [] }),
    });
    vi.stubGlobal("fetch", mockFetch);

    await searchBooks("test");

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("limit=5");
  });
});
