import { z } from "zod";

export const yahooLeagueMetaSchema = z.object({
  league_key: z.string(),
  league_id: z.string(),
  name: z.string(),
  url: z.string(),
  logo_url: z.string(),
  draft_status: z.string(),
  num_teams: z.number(),
  edit_key: z.string(),
  weekly_deadline: z.string(),
  league_update_timestamp: z.string().nullable(),
  scoring_type: z.string(),
  league_type: z.string(),
  renew: z.string(),
  renewed: z.string(),
  felo_tier: z.string(),
  iris_group_chat_id: z.string(),
  allow_add_to_dl_extra_pos: z.number(),
  is_pro_league: z.string(),
  is_cash_league: z.string(),
  current_week: z.number(),
  start_week: z.coerce.number(),
  start_date: z.string(),
  end_week: z.coerce.number(),
  end_date: z.string(),
  is_plus_league: z.string(),
  game_code: z.string(),
  season: z.string(),
});
export type YahooLeagueMeta = z.infer<typeof yahooLeagueMetaSchema>;

const yahooTeamSchema = z.object({
  team_key: z.string(),
  team_id: z.string(),
  name: z.string(),
  url: z.string(),
  team_logos: z.array(
    z.object({
      size: z.string(),
      url: z.string(),
    }),
  ),
  waiver_priority: z.number().nullable(),
  number_of_moves: z.number(),
  number_of_trades: z.coerce.number(),
  roster_adds: z.object({
    coverage_type: z.string(),
    coverage_value: z.number(),
    value: z.string(),
  }),
  league_scoring_type: z.string(),
  has_draft_grade: z.number(),
  auction_budget_total: z.string().optional(),
  auction_budget_spent: z.number().optional(),
  managers: z.array(z.any()),
});

// Yahoo League Scoreboard Schema
export const yahooLeagueScoreboardSchema = z.object({
  week: z.string(),
  matchups: z.array(
    z.object({
      week: z.string(),
      week_start: z.string(),
      week_end: z.string(),
      status: z.string(),
      is_playoffs: z.string(),
      is_consolation: z.string(),
      stat_winners: z
        .array(
          z.object({
            stat_id: z.string(),
            winner_team_key: z.string().optional(),
          }),
        )
        .optional(),
      teams: z.array(
        yahooTeamSchema.extend({
          points: z.object({
            coverage_type: z.string(),
            week: z.string(),
            total: z.string(),
          }),
          stats: z.array(
            z.object({
              stat_id: z.string(),
              value: z.coerce.string().nullable(),
            }),
          ),
        }),
      ),
    }),
  ),
});
export type YahooLeagueScoreboard = z.infer<typeof yahooLeagueScoreboardSchema>;

// Yahoo Settings Stat Category Schema
export const yahooSettingsStatCategorySchema = z.object({
  stat_id: z.number(),
  enabled: z.string(),
  name: z.string(),
  display_name: z.string(),
  group: z.string(),
  abbr: z.string(),
  sort_order: z.string(),
  position_type: z.string(),
  stat_position_types: z.array(z.string()),
  is_only_display_stat: z.string().optional(),
});

export type YahooSettingsStatCategory = z.infer<
  typeof yahooSettingsStatCategorySchema
>;

// Yahoo League Settings Schema
export const yahooLeagueSettingsSchema = z.object({
  draft_type: z.string(),
  is_auction_draft: z.string(),
  scoring_type: z.string(),
  uses_playoff: z.coerce.boolean(),
  has_playoff_consolation_games: z.boolean(),
  playoff_start_week: z.coerce.number(),
  uses_playoff_reseeding: z.number(),
  uses_lock_eliminated_teams: z.number(),
  num_playoff_teams: z.coerce.number(),
  num_playoff_consolation_teams: z.number(),
  has_multiweek_championship: z.number(),
  waiver_type: z.string(),
  waiver_rule: z.string(),
  uses_faab: z.string(),
  draft_time: z.string().optional(),
  draft_pick_time: z.string(),
  post_draft_players: z.string(),
  max_teams: z.string(),
  waiver_time: z.string(),
  trade_end_date: z.string(),
  trade_ratify_type: z.string(),
  trade_reject_time: z.string(),
  player_pool: z.string(),
  cant_cut_list: z.string(),
  draft_together: z.number(),
  sendbird_channel_url: z.string(),
  roster_positions: z.array(
    z.object({
      position: z.string(),
      position_type: z.string().optional(),
      count: z.coerce.number(),
      is_starting_position: z.number(),
    }),
  ),
  stat_categories: z.array(yahooSettingsStatCategorySchema),
  max_weekly_adds: z.string(),
  uses_median_score: z.boolean(),
  league_premium_features: z.array(z.any()),
});
export type YahooLeagueSettings = z.infer<typeof yahooLeagueSettingsSchema>;

// Yahoo Team Standings Schema
const yahooTeamStandingsSchema = yahooTeamSchema.extend({
  standings: z.object({
    rank: z.coerce.number().optional(),
    outcome_totals: z.object({
      wins: z.coerce.number(),
      losses: z.coerce.number(),
      ties: z.coerce.number(),
      percentage: z.string(),
    }),
    playoff_seed: z.coerce.number().optional(),
    games_back: z.string().optional(),
  }),
});
export type YahooTeamStandings = z.infer<typeof yahooTeamStandingsSchema>;

// Yahoo League Standings Schema
export const yahooLeagueStandingsSchema = z.array(yahooTeamStandingsSchema);
export type YahooLeagueStandings = z.infer<typeof yahooLeagueStandingsSchema>;
