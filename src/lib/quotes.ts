export const LITERARY_QUOTES = [
  { text: "Un livre est un jardin que l'on porte dans sa poche.", author: "Proverbe chinois" },
  { text: "Il n'y a pas de meilleure frégate qu'un livre pour nous emporter au loin.", author: "Emily Dickinson" },
  { text: "Les livres sont les miroirs de l'âme.", author: "Virginia Woolf" },
  { text: "Lire, c'est voyager sans bouger de sa chaise.", author: "Julien Green" },
  { text: "Un lecteur vit mille vies avant de mourir.", author: "George R.R. Martin" },
  { text: "La lecture est une amitié.", author: "Marcel Proust" },
  { text: "Il faut toujours avoir quelque chose de sensationnel à lire dans le train.", author: "Oscar Wilde" },
  { text: "Un livre doit être la hache qui brise la mer gelée en nous.", author: "Franz Kafka" },
];

export function getRandomQuote() {
  return LITERARY_QUOTES[Math.floor(Math.random() * LITERARY_QUOTES.length)];
}
