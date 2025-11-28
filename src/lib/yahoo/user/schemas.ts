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
  game_key: z.string(),
  game_id: z.string(),
  name: z.string(),
  code: z.string(),
  type: z.string(),
  url: z.string(),
  season: z.string(),
  leagues: z.array(yahooGameLeagueSchema),
});

export type YahooUserGameLeagues = z.infer<typeof yahooUserGameLeaguesSchema>;

// Yahoo User Games Schema
export const yahooUserGamesSchema = z.object({
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
  game_key: z.string(),
  game_id: z.string(),
  name: z.string(),
  code: z.string(),
  type: z.string(),
  url: z.string(),
  season: z.string(),
  teams: z.array(yahooUserGameTeamSchema),
});

export type YahooUserGameTeams = z.infer<typeof yahooUserGameTeamsSchema>;
