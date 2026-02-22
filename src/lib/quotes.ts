type Locale = "fr" | "en";

export type Quote = { text: string; author: string };

const QUOTES_FR: Quote[] = [
  { text: "Un livre est un jardin que l'on porte dans sa poche.", author: "Proverbe chinois" },
  { text: "Il n'y a pas de meilleure frégate qu'un livre pour nous emporter au loin.", author: "Emily Dickinson" },
  { text: "Les livres sont les miroirs de l'âme.", author: "Virginia Woolf" },
  { text: "Lire, c'est voyager sans bouger de sa chaise.", author: "Julien Green" },
  { text: "Un lecteur vit mille vies avant de mourir.", author: "George R.R. Martin" },
  { text: "La lecture est une amitié.", author: "Marcel Proust" },
  { text: "Il faut toujours avoir quelque chose de sensationnel à lire dans le train.", author: "Oscar Wilde" },
  { text: "Un livre doit être la hache qui brise la mer gelée en nous.", author: "Franz Kafka" },
];

const QUOTES_EN: Quote[] = [
  { text: "A reader lives a thousand lives before he dies.", author: "George R.R. Martin" },
  { text: "A book is a garden you carry in your pocket.", author: "Chinese proverb" },
  { text: "There is no frigate like a book to take us lands away.", author: "Emily Dickinson" },
  { text: "Books are the mirrors of the soul.", author: "Virginia Woolf" },
  { text: "Reading is a friendship.", author: "Marcel Proust" },
  { text: "One should always have something sensational to read on the train.", author: "Oscar Wilde" },
  { text: "A book must be the axe for the frozen sea within us.", author: "Franz Kafka" },
  { text: "I have always imagined that Paradise will be a kind of library.", author: "Jorge Luis Borges" },
];

const LITERARY_QUOTES: Record<Locale, Quote[]> = { fr: QUOTES_FR, en: QUOTES_EN };

export function getRandomQuote(locale: Locale) {
  const quotes = LITERARY_QUOTES[locale];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export function getUniqueQuotes(count: number, locale: Locale) {
  const quotes = LITERARY_QUOTES[locale];
  const shuffled = [...quotes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
