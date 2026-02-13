import * as cheerio from "cheerio";

export interface ScrapedMetadata {
  title: string;
  author: string;
  coverUrl: string;
}

export function extractMetadata(html: string, url: string): ScrapedMetadata {
  const $ = cheerio.load(html);

  // Try JSON-LD first
  const jsonLd = $('script[type="application/ld+json"]').first().html();
  if (jsonLd) {
    try {
      const data = JSON.parse(jsonLd);
      const item = Array.isArray(data) ? data[0] : data;
      if (item["@type"] === "Book" || item["@type"] === "Product") {
        return {
          title: item.name || "",
          author: typeof item.author === "string" ? item.author : item.author?.name || "",
          coverUrl: item.image || "",
        };
      }
    } catch {}
  }

  // Try Open Graph
  const ogTitle = $('meta[property="og:title"]').attr("content") || "";
  const ogImage = $('meta[property="og:image"]').attr("content") || "";

  // Try to extract author from meta
  const author =
    $('meta[name="author"]').attr("content") ||
    $('meta[property="book:author"]').attr("content") ||
    $('meta[name="twitter:data1"]').attr("content") ||
    "";

  // Fallback to <title>
  const title = ogTitle || $("title").text().split(/[-|–—]/)[0].trim();
  const coverUrl = ogImage;

  return { title, author, coverUrl };
}
