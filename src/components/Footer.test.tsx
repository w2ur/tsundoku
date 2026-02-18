import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import Footer from "./Footer";

vi.stubEnv("NEXT_PUBLIC_APP_VERSION", "1.0.0");

afterEach(() => {
  cleanup();
});

describe("Footer", () => {
  it("renders author link", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: /william/i });
    expect(link).toHaveAttribute("href", "https://william.revah.paris");
  });

  it("renders version", () => {
    render(<Footer />);
    expect(screen.getByText(/v1\.0\.0/)).toBeInTheDocument();
  });

  it("renders contact link with mailto", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: /me contacter/i });
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:contact@my-tsundoku.app")
    );
  });
});
