import Dexie, { type EntityTable } from "dexie";
import type { Book } from "./types";

class TsundokuDB extends Dexie {
  books!: EntityTable<Book, "id">;

  constructor() {
    super("tsundoku");
    this.version(1).stores({
      books: "id, stage, title, author, createdAt, updatedAt",
    });
    this.version(2).stores({
      books: "id, stage, title, author, createdAt, updatedAt",
    });
  }
}

let dbInstance: TsundokuDB | null = null;

export function getDB(): TsundokuDB {
  if (typeof window === "undefined") {
    throw new Error("Database can only be accessed in the browser");
  }
  if (!dbInstance) {
    dbInstance = new TsundokuDB();
  }
  return dbInstance;
}

export const db = typeof window !== "undefined" ? new TsundokuDB() : (null as unknown as TsundokuDB);
