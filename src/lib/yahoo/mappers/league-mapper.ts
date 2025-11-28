import {
  yahooLeagueMetaSchema,
  yahooLeagueScoreboardSchema,
  yahooLeagueSettingsSchema,
  yahooLeagueStandingsSchema,
} from "../league/schemas";
import { mergeObjects } from "../utils";
import { mapTeamPoints } from "./team-mapper";
import { mapTransactionPlayers } from "./transaction-mapper";

export const mapMetadata = (data: any) => {
  return yahooLeagueMetaSchema.parse(data);
};

export const mapStandings = (data: any) => {
  const count = data.count;
  const teams = [];

  for (let i = 0; i < count; i++) {
    const team = mapTeam(data[i].team[0]);
    team.standings = data[i].team[2].team_standings;
    teams.push(team);
  }
  return yahooLeagueStandingsSchema.parse(teams);
};

export function mapTeam(t: any) {
  const team = mergeObjects(t);
  // clean up team_logos
  if (team.team_logos.length) {
    team.team_logos = team.team_logos.map((logo: any) => logo.team_logo);
  } else {
    // fix issue #49 -- no team logo throwing error
    team.team_logos = [];
  }

  // clean up managers
  team.managers = team.managers.map((manager: any) => manager.manager);

  return team;
}
/*
 * Helper function to map data to a "team"
 */
export function mapTeams(ts: any) {
  const teams: any = Object.values(ts);

  return teams.reduce((result: any[], t: any) => {
    if (t.team) {
      result.push(mapTeam(t.team[0]));
    }

    return result;
  }, []);
}

export function mapSettings(settings: any) {
  settings.stat_categories = settings.stat_categories.stats.map((s: any) => {
    s.stat.stat_position_types = s.stat.stat_position_types
      ? s.stat.stat_position_types.map(
          (pt: any) => pt.stat_position_type.position_type,
        )
      : [];

    return s.stat;
  });

  settings.roster_positions = settings.roster_positions.map(
    (p: any) => p.roster_position,
  );

  if (settings.waiver_days) {
    settings.waiver_days = settings.waiver_days.map((d: any) => d.day);
  }

  return yahooLeagueSettingsSchema.parse(settings);
}

export function mapDraft(d: any) {
  const draft = Object.values(d);

  return draft.reduce((result: any[], d: any) => {
    if (d.draft_result) {
      result.push(d.draft_result);
    }

    return result;
  }, []);
}

export function mapScoreboard(sb: any) {
  const scoreboard: any[] = Object.values(sb);

  // TODO this is still gross... 3 array iterations :(
  const matchups = scoreboard.reduce((matchupsResult, m) => {
    if (m.matchup) {
      m = m.matchup;
      if (m.matchup_grades) {
        m.matchup_grades = m.matchup_grades.map((grade: any) => {
          return {
            team_key: grade.matchup_grade.team_key,
            grade: grade.matchup_grade.grade,
          };
        });
      }

      if (m.stat_winners) {
        m.stat_winners = m.stat_winners.reduce((winners: any, stat: any) => {
          winners.push(stat.stat_winner);
          return winners;
        }, []);
      }

      const teams = Object.values(m[0].teams);

      // Remove raw data entry from the matchup
      delete m[0];

      m.teams = teams.reduce((teamsResult: any[], t: any) => {
        if (t.team) {
          let team = mapTeam(t.team[0]);
          team = mapTeamPoints(team, t.team[1]);
          teamsResult.push(team);
        }

        return teamsResult;
      }, []);

      matchupsResult.push(m);
    }

    return matchupsResult;
  }, []);

  return yahooLeagueScoreboardSchema.parse({
    matchups: matchups,
    week: matchups[0].week,
  });
}

export function mapTransactions(ts: any) {
  const count = ts.count;
  const transactions = [];

  for (let i = 0; i < count; i++) {
    let transaction = Object.assign({ players: [] }, ts[i].transaction[0]);

    if (ts[i].transaction.length > 1 && ts[i].transaction[1].players) {
      transaction.players = mapTransactionPlayers(ts[i].transaction[1].players);
    } else {
      transaction.players = [];
    }

    transactions.push(transaction);
  }

  return transactions;
}

export function parseCollection(ls: any, subresources: any) {
  const count = ls.count;
  const leagues = [];

  for (let i = 0; i < count; i++) {
    leagues.push(ls[i]);
  }

  return leagues.map((l) => {
    let league = l.league[0];

    subresources.forEach((resource: any, idx: number) => {
      switch (resource) {
        case "settings":
          league.settings = mapSettings(l.league[idx + 1].settings[0]);
          break;

        case "standings":
          league.standings = mapStandings(l.league[idx + 1].standings[0].teams);
          break;

        case "scoreboard":
          league.scoreboard = mapScoreboard(
            l.league[idx + 1].scoreboard[0].matchups,
          );
          break;

        case "teams":
          league.teams = mapTeams(l.league[idx + 1].teams);
          break;

        case "draftresults":
          league.draftresults = mapDraft(l.league[idx + 1].draft_results);
          break;

        case "transactions":
          league.transactions = mapTransactions(l.league[idx + 1].transactions);
          break;

        default:
          break;
      }
    });

    return league;
  });
}
