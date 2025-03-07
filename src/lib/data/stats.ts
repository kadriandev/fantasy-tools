"server-only";

import { db } from "@/db";
import { stats } from "@/db/leagues.sql";
import { eq, desc } from "drizzle-orm";
import { createYahooClient, getLeagueStatsFromYahoo } from "../yahoo";
import { UserSubject } from "../../../auth/subjects";

export async function getLastSavedWeek(league_key: string) {
  return db
    .select({ week: stats.week })
    .from(stats)
    .where(eq(stats.league_key, league_key))
    .orderBy(desc(stats.week))
    .limit(1);
}

export async function getLeagueStats(user: UserSubject, league_key: string) {
  const yf = createYahooClient(user.access);

  const [settings, data] = await Promise.all([
    yf.league.settings(league_key),
    getLastSavedWeek(league_key),
  ]);

  // Fetch and save last week if it doesnt exist
  const unsavedWeeks = settings.current_week - (data[0]?.week ?? 0) - 1;
  if (data === null || unsavedWeeks) {
    const league_stats = await getLeagueStatsFromYahoo(
      user,
      league_key,
      data[0]?.week ?? 0,
      unsavedWeeks,
    );

    await db.insert(stats).values(league_stats);
  }

  return db.select().from(stats).where(eq(stats.league_key, league_key));
}
