"server-only";

import { db } from "@/db";
import { stats } from "@/db/leagues.sql";
import { eq, desc } from "drizzle-orm";
import { YahooFantasy } from "../yahoo/yahoo";
import { DBFantasyStats, dbFantasyStatsSchema } from "./schemas";
import { getPreviousWeekStats } from "../yahoo/utils";

export async function getLastSavedWeek(league_key: string) {
  return db
    .select({ week: stats.week })
    .from(stats)
    .where(eq(stats.league_key, league_key))
    .orderBy(desc(stats.week))
    .limit(1);
}

export async function getLeagueStats(
  league_key: string,
): Promise<DBFantasyStats> {
  const yf = await YahooFantasy.createClient();

  const [meta, data] = await Promise.all([
    yf.league.meta(league_key),
    getLastSavedWeek(league_key),
  ]);

  // Fetch and save last week if it doesnt exist
  const unsavedWeeks = meta.current_week - (data[0]?.week ?? 0) - 1;
  if (data === null || unsavedWeeks) {
    const league_stats = await getPreviousWeekStats(
      league_key,
      data[0]?.week ?? 0,
      unsavedWeeks,
    );

    await db.insert(stats).values(league_stats);
  }

  const league_stats = await db
    .select()
    .from(stats)
    .where(eq(stats.league_key, league_key));

  return dbFantasyStatsSchema.parse(league_stats);
}
