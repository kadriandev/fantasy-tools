import { z } from "zod";

// Yahoo Game League Schema
export const yahooGameLeagueSchema = z.object({
  league_key: z.string(),
  league_id: z.string(),
  name: z.string(),
  url: z.string(),
  draft_status: z.string(),
  num_teams: z.number(),
  edit_key: z.string(),
  weekly_deadline: z.string(),
  league_update_timestamp: z.string(),
  scoring_type: z.string(),
  league_type: z.string(),
  renew: z.string(),
  renewed: z.string(),
  short_invitation_url: z.string(),
  is_pro_league: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  is_finished: z.number(),
});
export type YahooGameLeague = z.infer<typeof yahooGameLeagueSchema>;

// Yahoo User Game Leagues Schema
export const yahooUserGameLeaguesSchema = z.object({
  guid: z.string(),
  games: z.tuple([
    z.object({
      game_key: z.string(),
      game_id: z.string(),
      name: z.string(),
      code: z.string(),
      type: z.string(),
      url: z.string(),
      season: z.string(),
      leagues: z.array(yahooGameLeagueSchema),
    }),
  ]),
});

export type YahooUserGameLeagues = z.infer<typeof yahooUserGameLeaguesSchema>;

// Yahoo Player Schema
export const yahooPlayerSchema = z.object({
  player_key: z.string(),
  player_id: z.string(),
  name: z.object({
    full: z.string(),
    first: z.string(),
    last: z.string(),
    ascii_first: z.string(),
    ascii_last: z.string(),
  }),
  editorial_player_key: z.string(),
  editorial_team_key: z.string(),
  editorial_team_full_name: z.string(),
  editorial_team_abbr: z.string(),
  uniform_number: z.string(),
  display_position: z.string(),
  headshot: z.string(),
  is_undroppable: z.string(),
  position_type: z.string(),
  eligible_positions: z.array(z.string()),
});

export type YahooPlayer = z.infer<typeof yahooPlayerSchema>;

// Yahoo Team Roster Schema
export const yahooTeamRosterSchema = z.object({
  team_key: z.string(),
  team_id: z.string(),
  name: z.string(),
  url: z.string(),
  team_logo: z.string(),
  waiver_priority: z.number(),
  number_of_moves: z.string(),
  number_of_trades: z.number(),
  clinched_playoffs: z.number(),
  managers: z.tuple([
    z.object({
      manager_id: z.string(),
      nickname: z.string(),
      guid: z.string(),
      is_commissioner: z.string(),
    }),
  ]),
  roster: z.array(yahooPlayerSchema),
});

export type YahooTeamRoster = z.infer<typeof yahooTeamRosterSchema>;

// Yahoo User Games Schema
export const yahooUserGamesSchema = z.object({
  guid: z.string(),
  games: z.array(
    z.object({
      game_key: z.string(),
      game_id: z.string(),
      name: z.string(),
      code: z.string(),
      type: z.string(),
      url: z.string(),
      season: z.string(),
      is_registration_over: z.boolean(),
      is_game_over: z.boolean(),
      is_offseason: z.boolean(),
      is_live_draft_lobby_active: z.boolean(),
    }),
  ),
});

export type YahooUserGames = z.infer<typeof yahooUserGamesSchema>;

// Yahoo User Game Team Schema
export const yahooUserGameTeamSchema = z.object({
  team_key: z.string(),
  team_id: z.string(),
  name: z.string(),
  is_owned_by_current_login: z.number(),
  url: z.string(),
  team_logo: z.string(),
  waiver_priority: z.number(),
  number_of_moves: z.string(),
  number_of_trades: z.number(),
  managers: z.tuple([
    z.object({
      manager_id: z.string(),
      nickname: z.string(),
      guid: z.string(),
      is_current_login: z.string(),
      email: z.string(),
      image_url: z.string(),
    }),
  ]),
});

export type YahooUserGameTeam = z.infer<typeof yahooUserGameTeamSchema>;

// Yahoo User Game Teams Schema
export const yahooUserGameTeamsSchema = z.object({
  guid: z.string(),
  teams: z.array(
    z.object({
      game_key: z.string(),
      game_id: z.string(),
      name: z.string(),
      code: z.string(),
      type: z.string(),
      url: z.string(),
      season: z.string(),
      teams: z.array(yahooUserGameTeamSchema),
    }),
  ),
});

export type YahooUserGameTeams = z.infer<typeof yahooUserGameTeamsSchema>;

// Fantasy Stats Schema
export const fantasyStatsSchema = z
  .object({
    team_id: z.string(),
    team_name: z.string(),
  })
  .catchall(z.string());

export type FantasyStats = z.infer<typeof fantasyStatsSchema>;

// DB Fantasy Stats Schema
export const dbFantasyStatsWeekSchema = z.object({
  league_key: z.string(),
  team_id: z.number(),
  team_name: z.string(),
  week: z.number(),
  stats: z.array(
    z.object({
      value: z.string(),
      stat_id: z.string(),
    }),
  ),
});
export type DBFantasyStatsWeek = z.infer<typeof dbFantasyStatsWeekSchema>;

export const dbFantasyStatsSchema = z.array(dbFantasyStatsWeekSchema);
export type DBFantasyStats = z.infer<typeof dbFantasyStatsSchema>;
