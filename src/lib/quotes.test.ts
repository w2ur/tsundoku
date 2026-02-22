import { describe, it, expect } from "vitest";
import { getRandomQuote, getUniqueQuotes } from "./quotes";

describe("getRandomQuote", () => {
  it("returns a quote with text and author", () => {
    const quote = getRandomQuote("fr");

    expect(quote.text).toBeTruthy();
    expect(quote.author).toBeTruthy();
  });

  it("returns a quote in the requested locale", () => {
    const quoteFr = getRandomQuote("fr");
    const quoteEn = getRandomQuote("en");

    expect(quoteFr.text).toBeTruthy();
    expect(quoteEn.text).toBeTruthy();
  });
});

describe("getUniqueQuotes", () => {
  it("returns the requested number of quotes", () => {
    const quotes = getUniqueQuotes(3, "fr");

    expect(quotes).toHaveLength(3);
  });

  it("returns unique quotes", () => {
    const quotes = getUniqueQuotes(5, "fr");
    const texts = quotes.map((q) => q.text);
    const uniqueTexts = new Set(texts);

    expect(uniqueTexts.size).toBe(5);
  });

  it("does not return more quotes than available", () => {
    const quotes = getUniqueQuotes(100, "fr");

    expect(quotes.length).toBeGreaterThan(0);
    expect(quotes.length).toBeLessThanOrEqual(100);
  });

  it("returns all available quotes when count exceeds array length", () => {
    const allFr = getUniqueQuotes(1000, "fr");
    const allEn = getUniqueQuotes(1000, "en");

    expect(allFr.length).toBeGreaterThan(0);
    expect(allEn.length).toBeGreaterThan(0);
  });
});
