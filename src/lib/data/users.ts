"server-only";

import { user_to_league } from "@/db/leagues.sql";
import { ParsedAuthToken } from "../auth/schemas";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { users } from "@/db/users.sql";

export const getUsersTeamId = async (
  user: ParsedAuthToken,
  league_key: string,
) => {
  return db
    .select({ team_id: user_to_league.team_id })
    .from(user_to_league)
    .where(
      and(
        eq(user_to_league.league_key, league_key),
        eq(user_to_league.user_id, user.properties.sub),
      ),
    )
    .then((res) => res[0].team_id);
};

export async function getUser(user_id: string) {
  return db.select().from(users).where(eq(users.user_id, user_id));
}
