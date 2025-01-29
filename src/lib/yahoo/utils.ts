import { db } from "@/db";
import { createYahooClient } from ".";
import { DBFantasyStats, FantasyStats, YahooLeagueScoreboard } from "./types";

export const getStatMapper = async (
  league_key: string,
): Promise<Map<string, { name: string; abbr: string }>> => {
  const statMapper = new Map<string, { name: string; abbr: string }>();
  const { data: stat_categories } = await db
    .from("leagues")
    .select("stat_categories")
    .eq("league_key", league_key)
    .maybeSingle();
  if (!stat_categories?.stat_categories) return statMapper;

  for (let stat of stat_categories.stat_categories) {
    statMapper.set(stat.stat_id + "", { name: stat.name, abbr: stat.abbr });
  }

  return statMapper;
};

export const getCurrentWeekStats = async (
  league_key: string,
): Promise<Array<FantasyStats>> => {
  const yf = await createYahooClient();

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
        team: s.name,
      };
      s.stats.forEach((r: any) => {
        res[r.stat_id] = r.value;
      });
      return res;
    });
};

export const getMatchupTeamId = async (league_key: string, team_id: string) => {
  const yf = createYahooClient();
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
