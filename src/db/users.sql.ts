import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  user_id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull(),
  last_updated: timestamp({ mode: "date" }),
  created_at: timestamp({ mode: "string" }).notNull(),
});
