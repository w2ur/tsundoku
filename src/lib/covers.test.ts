import { describe, it, expect, vi, beforeEach } from "vitest";

const mockUpload = vi.fn();
const mockGetPublicUrl = vi.fn();

vi.mock("./supabase", () => ({
  supabase: {
    storage: {
      from: vi.fn(() => ({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      })),
    },
  },
}));

// Mock fetch for data URL conversion
const mockFetch = vi.fn();
global.fetch = mockFetch;

import { uploadCover } from "./covers";

describe("uploadCover", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      blob: () => Promise.resolve(new Blob(["data"], { type: "image/jpeg" })),
    });
    mockUpload.mockResolvedValue({ error: null });
    mockGetPublicUrl.mockReturnValue({
      data: { publicUrl: "https://example.com/covers/user1/book1.jpg" },
    });
  });

  it("uploads blob to correct storage path", async () => {
    const url = await uploadCover("data:image/jpeg;base64,abc", "user1", "book1");
    expect(mockUpload).toHaveBeenCalledWith(
      "user1/book1.jpg",
      expect.any(Blob),
      { contentType: "image/jpeg", upsert: true }
    );
    expect(url).toBe("https://example.com/covers/user1/book1.jpg");
  });

  it("throws when upload returns an error", async () => {
    mockUpload.mockResolvedValue({ error: new Error("Storage error") });
    await expect(uploadCover("data:image/jpeg;base64,abc", "user1", "book1")).rejects.toThrow(
      "Storage error"
    );
  });

  it("throws when supabase is null", async () => {
    vi.resetModules();
    vi.doMock("./supabase", () => ({ supabase: null }));
    const { uploadCover: uploadCoverNull } = await import("./covers");
    await expect(uploadCoverNull("data:image/jpeg;base64,abc", "user1", "book1")).rejects.toThrow(
      "Supabase not available"
    );
  });
});
