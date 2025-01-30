"use server";

import { db } from "@/db";
import { leagues, user_to_league } from "@/db/leagues.sql";
import { eq, sql } from "drizzle-orm";
import { users } from "@/db/users.sql";
import { getUserLeaguesFromYahoo } from "../yahoo";
import { getUserJWT } from "../auth/auth";

export async function refreshLeagues() {
  return db.transaction(async (tx) => {
    const user = await getUserJWT();

    const user_leagues = await getUserLeaguesFromYahoo(user);
    if (!user_leagues) return;

    await tx.insert(leagues).values(user_leagues).onConflictDoNothing();

    try {
      const promises = [];
      for (const l of user_leagues) {
        promises.push(
          tx
            .insert(user_to_league)
            .values(l)
            .onConflictDoUpdate({
              target: [user_to_league.league_key, user_to_league.user_id],
              set: { team_name: l.team_name },
            }),
        );
      }
      await Promise.all(promises);
    } catch (e) {
      console.warn("WARNING: Conlict on insert to user_to_league");
    }

    await tx
      .update(users)
      .set({ last_updated: sql`NOW()` })
      .where(eq(users.user_id, user.properties.sub));
  });
}

export async function getLeagues(userId: string) {
  const l = await db
    .select({
      league_name: leagues.name,
      league_key: leagues.league_key,
      url: leagues.url,
      game: leagues.game,
      categories: leagues.stat_categories,
      num_teams: leagues.num_teams,
    })
    .from(leagues)
    .innerJoin(
      user_to_league,
      eq(leagues.league_key, user_to_league.league_key),
    )
    .where(eq(user_to_league.user_id, userId));
  return l;
}

export async function getLeagueCategories(league_key: string) {
  return db
    .select({ categories: leagues.stat_categories })
    .from(leagues)
    .where(eq(leagues.league_key, league_key))
    .then((res) => res[0].categories as any[]);
}
