import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import { PreferencesProvider, useTranslation, useTheme } from "./preferences";

const { mockPut, mockGet } = vi.hoisted(() => ({
  mockPut: vi.fn(),
  mockGet: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./db", () => ({
  db: {
    settings: {
      get: mockGet,
      put: mockPut,
    },
  },
}));

afterEach(() => {
  cleanup();
  mockPut.mockClear();
  mockGet.mockClear().mockResolvedValue(undefined);
});

function TestConsumer() {
  const { t, locale, setLocale } = useTranslation();
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="theme">{theme}</span>
      <span data-testid="loading">{t("loading")}</span>
      <button onClick={() => setLocale("en")}>Switch to EN</button>
      <button onClick={() => setTheme("dark")}>Switch to dark</button>
    </div>
  );
}

describe("PreferencesProvider", () => {
  it("defaults to French and light theme", () => {
    render(
      <PreferencesProvider>
        <TestConsumer />
      </PreferencesProvider>
    );
    expect(screen.getByTestId("locale").textContent).toBe("fr");
    expect(screen.getByTestId("theme").textContent).toBe("light");
    expect(screen.getByTestId("loading").textContent).toBe("Chargement...");
  });

  it("switches locale and persists to Dexie", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    render(
      <PreferencesProvider>
        <TestConsumer />
      </PreferencesProvider>
    );
    await user.click(screen.getByText("Switch to EN"));
    expect(screen.getByTestId("locale").textContent).toBe("en");
    expect(screen.getByTestId("loading").textContent).toBe("Loading...");
    expect(mockPut).toHaveBeenCalledWith({ key: "locale", value: "en" });
  });

  it("switches theme and persists to Dexie", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    render(
      <PreferencesProvider>
        <TestConsumer />
      </PreferencesProvider>
    );
    await user.click(screen.getByText("Switch to dark"));
    expect(screen.getByTestId("theme").textContent).toBe("dark");
    expect(mockPut).toHaveBeenCalledWith({ key: "theme", value: "dark" });
  });
});
