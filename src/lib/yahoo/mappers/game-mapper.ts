import { mapTeams } from "./league-mapper";
import { mapPlayer } from "./player-mapper";

export function mapLeagues(ls: any) {
  const leagues = Object.values(ls);

  return leagues.reduce((result: any[], l: any) => {
    if (l.league) {
      result.push(l.league[0]);
    }

    return result;
  }, []);
}

export function mapPlayers(ps: any) {
  const players: any[] = Object.values(ps);

  return players.reduce((result, p) => {
    if (p.player) {
      for (let i = 1; i < p.player.length; i++) {
        p.player[0].push(p.player[i]);
      }
      result.push(mapPlayer(p.player[0])); //, p.player[1]));
    }

    return result;
  }, []);
}

export function mapWeeks(ws: any) {
  const weeks = Object.values(ws);

  return weeks.reduce((result: any[], w: any) => {
    if (w.game_week) {
      result.push(w.game_week);
    }

    return result;
  }, []);
}

export function mapStatCategories(statcats: any) {
  statcats = statcats.map((s: any) => s.stat);

  // additional cleanup...
  statcats = statcats.map((statcat: any) => {
    if ("undefined" != typeof statcat.position_types) {
      statcat.position_types = statcat.position_types.map(
        (pt: any) => pt.position_type,
      );
    }

    if ("undefined" != typeof statcat.base_stats) {
      statcat.base_stats = statcat.base_stats.map(
        (bs: any) => bs.base_stat.stat_id,
      );
    }

    return statcat;
  });

  return statcats;
}

export function mapPositionTypes(positions: any) {
  return positions.map((p: any) => p.position_type);
}

export function mapRosterPositions(positions: any) {
  return positions.map((p: any) => p.roster_position);
}

export function parseCollection(gs: any, subresources: any) {
  const count = gs.count;
  const games = [];

  for (let i = 0; i < count; i++) {
    games.push(gs[i]);
  }

  return games.map((g) => {
    let game = Array.isArray(g.game) ? g.game[0] : g.game;
    // TODO: figure out the "pick'em" subresources...

    subresources.forEach((resource: any, idx: number) => {
      switch (resource) {
        case "leagues":
          game.leagues = mapLeagues(g.game[idx + 1].leagues);
          break;

        case "players":
          game.players = mapPlayers(g.game[idx + 1].players);
          break;

        case "game_weeks":
          game.game_weeks = mapWeeks(g.game[idx + 1].game_weeks);
          break;

        case "stat_categories":
          game.stat_categories = mapStatCategories(
            g.game[idx + 1].stat_categories.stats,
          );
          break;

        case "position_types":
          game.position_types = mapPositionTypes(
            g.game[idx + 1].position_types,
          );
          break;

        case "roster_positions":
          game.roster_positions = mapRosterPositions(
            g.game[idx + 1].roster_positions,
          );
          break;

        case "teams":
          game.teams = mapTeams(g.game[idx + 1].teams);
          break;

        default:
          break;
      }
    });

    return game;
  });
}
