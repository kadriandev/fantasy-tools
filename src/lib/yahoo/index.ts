// @ts-expect-error Package doesn't have types
import YahooFantasy from "yahoo-fantasy";
import { Resource } from "sst";
import {
  FantasyStats,
  YahooLeagueScoreboard,
  YahooLeagueSettings,
} from "./types";
import { catchError } from "../utils";
import { YahooUserGames } from "./schemas";
import { cookies } from "next/headers";
import { auth } from "../auth/actions";
import { redirect } from "next/navigation";

export const createYahooClient = async () => {
  const yf = new YahooFantasy(
    Resource.YAHOO_CLIENT_ID.value,
    Resource.YAHOO_CLIENT_SECRET.value,
  );

  const cookieStore = await cookies();
  const access = cookieStore.get("yahoo_access_token");
  if (access) {
    yf.setUserToken(access?.value);
    return yf;
  }

  const verified = await auth();
  if (!verified) redirect("/");

  yf.setUserToken(verified.access);
  return yf;
};

export const getCurrentWeekStats = async (
  league_key: string,
): Promise<Array<FantasyStats>> => {
  const yf = await createYahooClient();

  const [err, scoreboard] = await catchError<YahooLeagueScoreboard>(
    yf.league.scoreboard(league_key),
  );

  if (err) {
    return [];
  }

  return scoreboard.scoreboard.matchups
    .reduce((acc: any[], curr: any) => {
      acc.push(curr.teams);
      return acc;
    }, [])
    .flat()
    .map((s) => {
      const res: FantasyStats = {
        team_id: s.team_id,
        team_name: s.name,
      };
      s.stats.forEach((r: any) => {
        res[r.stat_id] = r.value;
      });
      return res;
    });
};
export async function getUserLeaguesFromYahoo() {
  const all_leagues = [];
  const yf = await createYahooClient();

  const cookieStore = await cookies();
  const sub = cookieStore.get("user_sub");

  const [err, games] = await catchError<YahooUserGames>(yf.user.games());
  if (err) {
    console.error(
      "[func: getUserLeaguesFromYahoo] Error fetching from yahoo fantasy api.",
    );
    return [];
  }

  const active_games = games.games.filter((game: any) => !game.is_game_over);

  for (const game of active_games) {
    const [teams, game_leagues] = await Promise.all([
      yf.user.game_teams(game.game_key),
      yf.user.game_leagues(game.game_key),
    ]);

    // Check if any game leagues for this game
    const lls = game_leagues.games.find(
      (g: any) => g.game_key === game.game_key,
    )?.leagues;
    if (!lls) continue;

    const new_leagues = [];
    for (const league of lls) {
      const team = teams.teams
        .find((t: any) => t.game_key === game.game_key)
        ?.teams.find((t: any) => t.team_key.startsWith(league.league_key));

      const [err, settings] = await catchError<YahooLeagueSettings>(
        yf.league.settings(league.league_key),
      );
      if (err) {
        continue;
      }

      new_leagues.push({
        user_id: sub?.value!,
        league_key: league.league_key,
        name: league.name,
        num_teams: league.num_teams,
        game: game.code,
        url: league.url,
        stat_categories: settings.settings.stat_categories,
        team_id: parseInt(team.team_id),
        team_name: team.name as string,
        end_date: settings.end_date,
      });
    }

    all_leagues.push(...new_leagues);
  }
  return all_leagues;
}

export async function getLeagueStatsFromYahoo(
  league_key: string,
  week: number,
  unsavedWeeks: number,
) {
  const yf = await createYahooClient();

  const weeksToFetch = Array(unsavedWeeks)
    .fill(week ?? 0)
    .map((x, i) => x + i + 1);

  const scoreboard_weeks = await Promise.all(
    weeksToFetch.map((w) => yf.league.scoreboard(league_key, w)),
  );

  return scoreboard_weeks.reduce((acc: any[], curr: any) => {
    const teams = curr.scoreboard.matchups.flatMap((m: any) => m.teams);
    const stats = teams.map((t: any) => ({
      league_key,
      week: +t.points.week,
      team_id: +t.team_id,
      team_name: t.name,
      stats: t.stats,
    }));
    return [...acc, ...stats];
  }, []);
}

export async function getUpcomingMatchups(
  league_key: string,
  current_week: number,
) {
  const yf = await createYahooClient();

  const [err, scoreboard] = await catchError<YahooLeagueScoreboard>(
    yf.league.scoreboard(league_key, current_week + 1),
  );
  if (err) {
    return [];
  }

  const matchups = scoreboard.scoreboard.matchups.map((m: any) => ({
    home: m.teams[0],
    away: m.teams[1],
  }));
  return matchups;
}

export async function getStandings(league_key: string) {
  const yf = await createYahooClient();
  const standings = await yf.league.standings(league_key);
  return standings;
}
