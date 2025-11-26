import { createYahooClient } from ".";
import { DBFantasyStats, YahooLeagueScoreboard } from "./types";

export const getMatchupTeamId = async (league_key: string, team_id: string) => {
  const yf = await createYahooClient();

  const scoreboard = (await yf.league.scoreboard(
    league_key,
  )) as YahooLeagueScoreboard;

  const opponent_team_key = scoreboard.scoreboard.matchups
    .find(
      (m) => m.teams[0].team_id === team_id || m.teams[1].team_id === team_id,
    )
    ?.teams.find((t) => t.team_id != team_id)?.team_id;
  return opponent_team_key;
};

export const groupStatsByWeek = (
  data: Array<DBFantasyStats>,
): Array<Array<DBFantasyStats>> => {
  return data
    .reduce((acc: Array<Array<DBFantasyStats>>, curr) => {
      if (!acc[curr.week - 1]) acc[curr.week - 1] = [];
      acc[curr.week - 1].push(curr);
      return acc;
    }, [])
    .reverse();
};
