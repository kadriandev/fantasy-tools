// @ts-expect-error Package doesn't have types
import YahooFantasy from "yahoo-fantasy";
import { Resource } from "sst";
import {
  FantasyStats,
  YahooLeagueScoreboard,
  YahooLeagueSettings,
} from "./types";
import { type ParsedAuthToken } from "../auth/schemas";

export const createYahooClient = (token: string) => {
  const yf = new YahooFantasy(
    Resource.YAHOO_CLIENT_ID.value,
    Resource.YAHOO_CLIENT_SECRET.value,
  );
  yf.setUserToken(token);
  return yf;
};

export const getCurrentWeekStats = async (
  user: ParsedAuthToken,
  league_key: string,
): Promise<Array<FantasyStats>> => {
  const yf = createYahooClient(user.properties.access);

  const scoreboard: YahooLeagueScoreboard =
    await yf.league.scoreboard(league_key);

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
export async function getUserLeaguesFromYahoo(user: ParsedAuthToken) {
  const all_leagues = [];
  const yf = createYahooClient(user.properties.access);
  const games = await yf.user.games();
  const active_games = games.games.filter((game: any) => !game.is_game_over);

  for (const game of active_games) {
    const teams_promise: Promise<any> = yf.user.game_teams(game.game_key);
    const leagues_promise: Promise<any> = yf.user.game_leagues(game.game_key);

    const [teams, game_leagues] = await Promise.all([
      teams_promise,
      leagues_promise,
    ]);

    const lls = game_leagues.games.find(
      (g: any) => g.game_key === game.game_key,
    )?.leagues;
    if (!lls) return;

    const new_leagues = [];
    for (const league of lls) {
      const team = teams.teams
        .find((t: any) => t.game_key === game.game_key)
        ?.teams.find((t: any) => t.team_key.startsWith(league.league_key));

      const settings: YahooLeagueSettings = await yf.league.settings(
        league.league_key,
      );

      new_leagues.push({
        user_id: user.properties.sub,
        league_key: league.league_key,
        name: league.name,
        num_teams: league.num_teams,
        game: game.code,
        url: league.url,
        stat_categories: settings.settings.stat_categories,
        team_id: parseInt(team.team_id),
        team_name: team.name as string,
      });
    }
    all_leagues.push(...new_leagues);
  }
  return all_leagues;
}

export async function getLeagueStatsFromYahoo(
  user: ParsedAuthToken,
  league_key: string,
  week: number,
  unsavedWeeks: number,
) {
  const yf = createYahooClient(user.properties.access);

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
  user: ParsedAuthToken,
  league_key: string,
  current_week: number,
) {
  const yf = createYahooClient(user.properties.access);
  const scoreboard = await yf.league.scoreboard(league_key, current_week + 1);
  const matchups = scoreboard.scoreboard.matchups.map((m: any) => ({
    home: m.teams[0],
    away: m.teams[1],
  }));
  return matchups;
}

export async function getStandings(user: ParsedAuthToken, league_key: string) {
  const yf = createYahooClient(user.properties.access);
  const standings = await yf.league.standings(league_key);
  return standings;
}
