"use server";

import { db } from "@/db";
import { leagues, user_to_league } from "@/db/leagues.sql";
import { eq, sql, and, gte } from "drizzle-orm";
import { users } from "@/db/users.sql";
import { getUserLeaguesFromYahoo } from "../yahoo";
import { auth } from "../auth/actions";
import { redirect } from "next/navigation";

export async function refreshLeagues() {
  const user = await auth();
  const user_leagues = await getUserLeaguesFromYahoo(user);
  if (!user_leagues || !user_leagues.length) return;

  await db.transaction(async (tx) => {
    try {
      await tx
        .insert(leagues)
        .values(user_leagues)
        .onConflictDoUpdate({
          target: leagues.league_key,
          set: { end_date: sql.raw(`excluded.${leagues.end_date.name}`) },
        });

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

      await tx
        .update(users)
        .set({ last_updated: sql`NOW()` })
        .where(eq(users.user_id, user.sub));
    } catch (e) {
      console.warn("WARNING: Conlict on insert to user_to_league", e);
      tx.rollback();
    }
  });

  // redirect("/leagues");
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
    .where(
      and(
        eq(user_to_league.user_id, userId),
        gte(leagues.end_date, new Date().toISOString()),
      ),
    );
  return l;
}

export async function getLeagueCategories(league_key: string) {
  return db
    .select({ categories: leagues.stat_categories })
    .from(leagues)
    .where(eq(leagues.league_key, league_key))
    .then((res) => res[0].categories as any[]);
}
