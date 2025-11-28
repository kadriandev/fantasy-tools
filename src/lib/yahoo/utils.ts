import { cookies } from "next/headers";
import { YahooLeagueScoreboard } from "./league/schemas";
import { DBFantasyStats, FantasyStats } from "./schemas";
import { catchError } from "../utils";
import { YahooUserGames } from "./user/schemas";
import { YahooFantasy } from "./yahoo";

export async function getPreviousWeekStats(
  league_key: string,
  week: number,
  unsavedWeeks: number,
) {
  const yf = await YahooFantasy.createClient();

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

export const getMatchupTeamId = async (league_key: string, team_id: string) => {
  const yf = await YahooFantasy.createClient();

  const scoreboard = await yf.league.scoreboard(league_key);

  const opponent_team_key = scoreboard.matchups
    .find(
      (m) => m.teams[0].team_id === team_id || m.teams[1].team_id === team_id,
    )
    ?.teams.find((t) => t.team_id != team_id)?.team_id;
  return opponent_team_key;
};

export const scoreboardToStatsTable = (scoreboard: YahooLeagueScoreboard) => {
  return scoreboard.matchups
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

export const groupStatsByWeek = (
  data: DBFantasyStats,
): Array<DBFantasyStats> => {
  return data
    .reduce((acc: Array<DBFantasyStats>, curr) => {
      if (!acc[curr.week - 1]) acc[curr.week - 1] = [];
      acc[curr.week - 1].push(curr);
      return acc;
    }, [])
    .reverse();
};

export async function getUserLeaguesFromYahoo() {
  const cookieStore = await cookies();
  const sub = cookieStore.get("user_sub");

  const all_leagues = [];
  const yf = await YahooFantasy.createClient();

  const [err, games] = await catchError(yf.user.games());
  if (err) {
    console.error(
      "[func: getUserLeaguesFromYahoo] Error fetching from yahoo fantasy api.",
    );
    return [];
  }

  const active_games = games.filter((game: any) => !game.is_game_over);

  for (const game of active_games) {
    const [teams, game_leagues] = await Promise.all([
      yf.user.game_teams(game.game_key),
      yf.user.game_leagues(game.game_key),
    ]);

    // Check if any game leagues for this game
    const lls = game_leagues.find((g) => g.game_key === game.game_key)?.leagues;
    if (!lls) continue;

    const new_leagues = [];
    for (const league of lls) {
      const team = teams
        .find((t) => t.game_key === game.game_key)
        ?.teams.find((t) => t.team_key.startsWith(league.league_key));

      if (!team) continue;

      const [err, promises] = await catchError(
        Promise.all([
          yf.league.meta(league.league_key),
          yf.league.settings(league.league_key),
        ]),
      );
      if (err) {
        continue;
      }

      const [meta, settings] = promises;

      new_leagues.push({
        user_id: sub?.value!,
        league_key: league.league_key,
        name: league.name,
        num_teams: league.num_teams,
        game: game.code,
        url: league.url,
        stat_categories: settings.stat_categories,
        team_id: parseInt(team.team_id),
        team_name: team.name,
        end_date: meta.end_date,
      });
    }

    all_leagues.push(...new_leagues);
  }
  return all_leagues;
}

export function mergeObjects(arrayOfObjects: Array<any>): any {
  const destinationObj: any = {};

  if (arrayOfObjects) {
    arrayOfObjects.forEach((obj) => {
      Object.keys(obj).forEach((key) => {
        if ("undefined" != typeof key) {
          destinationObj[key] = obj[key];
        }
      });
    });
  }

  return destinationObj;
}

export function flattenObject(obj: any): any {
  let toReturn: any = {};

  for (let i in obj) {
    if (!obj.hasOwnProperty(i)) continue;

    if (typeof obj[i] === "object") {
      let flatObject = flattenObject(obj[i]);
      for (let x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[i + "." + x] = flatObject[x];
      }
    } else {
      toReturn[i] = obj[i];
    }
  }
}
