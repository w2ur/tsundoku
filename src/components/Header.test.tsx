import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Header from "./Header";
import { PreferencesProvider } from "@/lib/preferences";

// Mock next/navigation
const mockBack = vi.fn();
let mockPathname = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ back: mockBack }),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("@/lib/db", () => ({
  db: {
    settings: {
      get: vi.fn().mockResolvedValue(undefined),
      put: vi.fn(),
    },
  },
}));

afterEach(() => {
  cleanup();
  mockBack.mockClear();
});

function renderWithPreferences(ui: React.ReactElement) {
  return render(<PreferencesProvider>{ui}</PreferencesProvider>);
}

describe("Header", () => {
  it("renders the app name as a link to home", () => {
    mockPathname = "/";
    renderWithPreferences(<Header />);
    const logo = screen.getByText("My Tsundoku");
    expect(logo.closest("a")?.getAttribute("href")).toBe("/");
  });

  it("does not show back arrow on home page", () => {
    mockPathname = "/";
    renderWithPreferences(<Header />);
    expect(screen.queryByLabelText("Retour")).toBeNull();
  });

  it("shows back arrow on sub-pages", () => {
    mockPathname = "/settings";
    renderWithPreferences(<Header />);
    expect(screen.getByLabelText("Retour")).toBeTruthy();
  });

  it("shows back arrow on nested sub-pages", () => {
    mockPathname = "/add/scan";
    renderWithPreferences(<Header />);
    expect(screen.getByLabelText("Retour")).toBeTruthy();
  });

  it("calls router.back() when back arrow is clicked", async () => {
    mockPathname = "/add";
    const { user } = await import("@testing-library/user-event").then((m) => ({
      user: m.default.setup(),
    }));
    renderWithPreferences(<Header />);
    await user.click(screen.getByLabelText("Retour"));
    expect(mockBack).toHaveBeenCalled();
  });

  it("renders settings link", () => {
    mockPathname = "/";
    renderWithPreferences(<Header />);
    expect(screen.getByLabelText("Paramètres")).toBeTruthy();
  });
});
