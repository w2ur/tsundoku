export type Stage = "a_acheter" | "tsundoku" | "bibliotheque" | "revendre";

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  stage: Stage;
  createdAt: number;
  updatedAt: number;
}
