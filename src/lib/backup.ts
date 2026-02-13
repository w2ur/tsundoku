import type { Book } from "./types";

const BACKUP_VERSION = 1;

interface BackupData {
  version: number;
  exportedAt: string;
  books: Book[];
}

export function createBackup(books: Book[]): string {
  const data: BackupData = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    books,
  };
  return JSON.stringify(data, null, 2);
}

export function parseBackup(json: string): { books: Book[]; error?: string } {
  try {
    const data = JSON.parse(json);

    if (!data.version || !Array.isArray(data.books)) {
      return { books: [], error: "Format de fichier invalide" };
    }

    const books: Book[] = data.books.filter(
      (b: Record<string, unknown>) =>
        typeof b.id === "string" &&
        typeof b.title === "string" &&
        typeof b.stage === "string" &&
        ["a_acheter", "tsundoku", "bibliotheque", "revendre"].includes(b.stage as string)
    );

    if (books.length === 0 && data.books.length > 0) {
      return { books: [], error: "Aucun livre valide trouvé dans le fichier" };
    }

    return { books };
  } catch {
    return { books: [], error: "Fichier JSON invalide" };
  }
}

export function downloadBackup(books: Book[]) {
  const json = createBackup(books);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const date = new Date().toISOString().split("T")[0];
  const a = document.createElement("a");
  a.href = url;
  a.download = `tsundoku-backup-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
