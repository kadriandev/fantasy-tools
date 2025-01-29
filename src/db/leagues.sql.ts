import {
  integer,
  jsonb,
  numeric,
  pgTable,
  primaryKey,
  text,
} from "drizzle-orm/pg-core";
import { users } from "./users.sql";

export const leagues = pgTable("leagues", {
  league_key: text("league_key").primaryKey(),
  name: text("name").notNull(),
  num_teams: numeric("num_teams").notNull(),
  game: text("game").notNull(),
  url: text("url").notNull(),
  stat_categories: jsonb(),
});

export const user_leagues = pgTable(
  "user_leagues",
  {
    user_id: text("id")
      .notNull()
      .references(() => users.id),
    league_key: numeric("league_key")
      .notNull()
      .references(() => leagues.league_key),
    team_id: text("email").notNull(),
  },
  (table) => {
    return [
      {
        pk: primaryKey({
          columns: [table.user_id, table.league_key],
        }),
      },
    ];
  },
);

export const league_stats = pgTable(
  "league_stats",
  {
    league_key: text().references(() => leagues.league_key),
    team_id: integer(),
    week: integer(),
    stats: jsonb().notNull(),
  },
  (table) => {
    return [
      {
        pk: primaryKey({
          columns: [table.league_key, table.team_id, table.week],
        }),
      },
    ];
  },
);
