import type { Database } from "./database.types";

export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];

export type TransactionWithCategory = Transaction & {
  category: Pick<Category, "id" | "name" | "color" | "kind"> | null;
};

export type Asset = Database["public"]["Tables"]["assets"]["Row"];
