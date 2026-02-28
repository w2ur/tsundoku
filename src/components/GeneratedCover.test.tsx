import { describe, it, expect } from "vitest";
import { generateCoverColor } from "./GeneratedCover";

describe("generateCoverColor", () => {
  it("returns the same color for the same title", () => {
    expect(generateCoverColor("My Book")).toBe(generateCoverColor("My Book"));
  });
  it("returns different colors for different titles", () => {
    expect(generateCoverColor("Book A")).not.toBe(generateCoverColor("Book B"));
  });
  it("returns a valid hex color", () => {
    expect(generateCoverColor("Test")).toMatch(/^#[0-9a-f]{6}$/i);
  });
});
