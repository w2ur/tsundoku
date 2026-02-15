import { describe, it, expect } from "vitest";
import { getRandomQuote, getUniqueQuotes, LITERARY_QUOTES } from "./quotes";

describe("getRandomQuote", () => {
  it("returns a quote with text and author", () => {
    const quote = getRandomQuote();

    expect(quote.text).toBeTruthy();
    expect(quote.author).toBeTruthy();
  });

  it("returns a quote from the LITERARY_QUOTES array", () => {
    const quote = getRandomQuote();

    expect(LITERARY_QUOTES).toContainEqual(quote);
  });
});

describe("getUniqueQuotes", () => {
  it("returns the requested number of quotes", () => {
    const quotes = getUniqueQuotes(3);

    expect(quotes).toHaveLength(3);
  });

  it("returns unique quotes", () => {
    const quotes = getUniqueQuotes(5);
    const texts = quotes.map((q) => q.text);
    const uniqueTexts = new Set(texts);

    expect(uniqueTexts.size).toBe(5);
  });

  it("does not return more quotes than available", () => {
    const quotes = getUniqueQuotes(100);

    expect(quotes).toHaveLength(LITERARY_QUOTES.length);
  });

  it("returns all quotes when count equals array length", () => {
    const quotes = getUniqueQuotes(LITERARY_QUOTES.length);

    expect(quotes).toHaveLength(LITERARY_QUOTES.length);
    for (const quote of quotes) {
      expect(LITERARY_QUOTES).toContainEqual(quote);
    }
  });
});
