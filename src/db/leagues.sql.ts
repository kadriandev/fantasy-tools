import { integer, jsonb, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { users } from "./users.sql";

export const leagues = pgTable("leagues", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  league_key: text().unique().notNull(),
  name: text().notNull(),
  num_teams: integer().notNull(),
  game: text().notNull(),
  url: text().notNull(),
  stat_categories: jsonb(),
});

export const user_to_league = pgTable(
  "user_to_league",
  {
    user_id: text()
      .notNull()
      .references(() => users.user_id),
    league_key: text()
      .notNull()
      .references(() => leagues.league_key),
    team_id: integer().notNull(),
    team_name: text(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.user_id, table.league_key] }),
  }),
);

export const stats = pgTable(
  "stats",
  {
    league_key: text()
      .notNull()
      .references(() => leagues.league_key),
    team_id: integer().notNull(),
    week: integer().notNull(),
    team_name: text(),
    stats: jsonb().notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.league_key, table.team_id, table.week],
    }),
  }),
);
