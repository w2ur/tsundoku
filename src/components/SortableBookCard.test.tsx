import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import SortableBookCard from "./SortableBookCard";

vi.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

vi.mock("@dnd-kit/utilities", () => ({
  CSS: { Transform: { toString: () => null } },
}));

vi.mock("@/lib/preferences", () => ({
  useTranslation: () => ({ t: (k: string) => k, locale: "fr" }),
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

vi.mock("./SwipeableBookCard", () => ({
  default: ({ book }: { book: { title: string } }) => (
    <div data-testid="swipeable-card">{book.title}</div>
  ),
}));

afterEach(() => {
  cleanup();
});

const book = {
  id: "b1",
  title: "Test Book",
  author: "Test Author",
  coverUrl: "",
  stage: "tsundoku" as const,
  position: 0,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

describe("SortableBookCard", () => {
  it("renders the book title and author", () => {
    render(<SortableBookCard book={book} />);
    expect(screen.getByText("Test Book")).toBeDefined();
    expect(screen.getByText("Test Author")).toBeDefined();
  });

  it("sets data-book-id attribute", () => {
    const { container } = render(<SortableBookCard book={book} />);
    expect(container.querySelector("[data-book-id='b1']")).toBeDefined();
  });

  it("applies isDragDisabled", () => {
    render(<SortableBookCard book={book} isDragDisabled />);
    expect(screen.getByText("Test Book")).toBeDefined();
  });

  it("renders SwipeableBookCard when isMobile and drag enabled", () => {
    const { container } = render(<SortableBookCard book={book} isMobile />);
    expect(container.querySelector("[data-testid='swipeable-card']")).toBeDefined();
  });

  it("renders BookCard when isMobile but drag disabled", () => {
    render(<SortableBookCard book={book} isMobile isDragDisabled />);
    expect(screen.getByRole("link")).toBeDefined();
  });
});
