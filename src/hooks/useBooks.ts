"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import type { Book, Stage } from "@/lib/types";

export function useBooks(stage?: Stage): Book[] | undefined {
  return useLiveQuery(() => {
    if (!db) return [];
    if (stage) {
      return db.books.where("stage").equals(stage).sortBy("position");
    }
    return db.books.orderBy("updatedAt").reverse().toArray();
  }, [stage]);
}

export function useBook(id: string): Book | undefined {
  return useLiveQuery(() => {
    if (!db) return undefined;
    return db.books.get(id);
  }, [id]);
}

export function useBooksByStage(): Record<Stage, Book[]> | undefined {
  return useLiveQuery(async () => {
    if (!db) return { a_acheter: [], tsundoku: [], bibliotheque: [], revendre: [] };
    const all = await db.books.toArray();
    const result: Record<Stage, Book[]> = {
      a_acheter: [],
      tsundoku: [],
      bibliotheque: [],
      revendre: [],
    };
    for (const book of all) {
      result[book.stage].push(book);
    }
    for (const stage of Object.keys(result) as Stage[]) {
      result[stage].sort((a, b) => a.position - b.position);
    }
    return result;
  }, []);
}
