export type YahooLeagueScoreboard = {
  league_key: string;
  league_id: string;
  name: string;
  url: string;
  logo_url: string;
  draft_status: string;
  num_teams: number;
  edit_key: string;
  weekly_deadline: string;
  league_update_timestamp: string;
  scoring_type: string;
  league_type: string;
  renew: string;
  renewed: string;
  felo_tier: string;
  iris_group_chat_id: string;
  allow_add_to_dl_extra_pos: number;
  is_pro_league: string;
  is_cash_league: string;
  current_week: number;
  start_week: string;
  start_date: string;
  end_week: string;
  end_date: string;
  is_plus_league: string;
  game_code: string;
  season: string;
  scoreboard: {
    week: string;
    matchups: Array<{
      week: string;
      week_start: string;
      week_end: string;
      status: string;
      is_playoffs: string;
      is_consolation: string;
      stat_winners: Array<{ stat_id: string; winner_team_key: string }>;
      teams: Array<{
        team_key: string;
        team_id: string;
        name: string;
        url: string;
        team_logos: Array<any>;
        waiver_priority: number;
        number_of_moves: number;
        number_of_trades: number;
        roster_adds: [object];
        league_scoring_type: string;
        has_draft_grade: number;
        auction_budget_total: string;
        auction_budget_spent: number;
        managers: Array<any>;
        points: { coverage_type: string; week: string; total: string };
        stats: Array<{ stat_id: string; value: string }>;
      }>;
    }>;
  };
};
export type YahooLeagueSettings = {
  league_key: string;
  league_id: string;
  name: string;
  url: string;
  logo_url: string;
  draft_status: string;
  num_teams: number;
  edit_key: string;
  weekly_deadline: string;
  league_update_timestamp: string;
  scoring_type: string;
  league_type: string;
  renew: string;
  renewed: string;
  felo_tier: string;
  iris_group_chat_id: string;
  allow_add_to_dl_extra_pos: number;
  is_pro_league: string;
  is_cash_league: string;
  current_week: number;
  start_week: string;
  start_date: string;
  end_week: string;
  end_date: string;
  is_plus_league: string;
  game_code: string;
  season: string;
  settings: {
    draft_type: string;
    is_auction_draft: string;
    scoring_type: string;
    uses_playoff: string;
    has_playoff_consolation_games: boolean;
    playoff_start_week: string;
    uses_playoff_reseeding: number;
    uses_lock_eliminated_teams: number;
    num_playoff_teams: string;
    num_playoff_consolation_teams: number;
    has_multiweek_championship: number;
    waiver_type: string;
    waiver_rule: string;
    uses_faab: string;
    draft_time: string;
    draft_pick_time: string;
    post_draft_players: string;
    max_teams: string;
    waiver_time: string;
    trade_end_date: string;
    trade_ratify_type: string;
    trade_reject_time: string;
    player_pool: string;
    cant_cut_list: string;
    draft_together: number;
    sendbird_channel_url: string;
    roster_positions: Array<{
      position: string;
      position_type: string;
      count: number;
      is_starting_position: number;
    }>;
    stat_categories: Array<YahooSettingsStatCategory>;
    max_weekly_adds: string;
    uses_median_score: boolean;
    league_premium_features: [];
  };
};

export type YahooUserGameLeagues = {
  guid: string;
  games: [
    {
      game_key: string;
      game_id: string;
      name: string;
      code: string;
      type: string;
      url: string;
      season: string;
      leagues: YahooGameLeague[];
    },
  ];
};

export type YahooGameLeague = {
  league_key: string;
  league_id: string;
  name: string;
  url: string;
  draft_status: string;
  num_teams: number;
  edit_key: string;
  weekly_deadline: string;
  league_update_timestamp: string;
  scoring_type: string;
  league_type: string;
  renew: string;
  renewed: string;
  short_invitation_url: string;
  is_pro_league: string;
  start_date: string;
  end_date: string;
  is_finished: number;
};

export type LeagueMeta = {
  league_key: string;
  league_id: string;
  name: string;
  url: string;
  logo_url: string;
  draft_status: string;
  num_teams: number;
  edit_key: string;
  weekly_deadline: string;
  league_update_timestamp: null;
  scoring_type: string;
  league_type: string;
  renew: string;
  renewed: string;
  felo_tier: string;
  iris_group_chat_id: string;
  allow_add_to_dl_extra_pos: number;
  is_pro_league: string;
  is_cash_league: string;
  current_week: number;
  start_week: string;
  start_date: string;
  end_week: string;
  end_date: string;
  is_plus_league: string;
  game_code: string;
  season: string;
};

type YahooTeamStandings = {
  team_key: string;
  team_id: string;
  name: string;
  url: string;
  team_logos: { size: string; url: string }[];
  waiver_priority: number;
  number_of_moves: number;
  number_of_trades: number;
  roster_adds: any[];
  league_scoring_type: string;
  has_draft_grade: number;
  auction_budget_total: string;
  auction_budget_spent: number;
  managers: any[];
  standings: {
    rank: string;
    outcome_totals: {
      wins: string;
      losses: string;
      ties: string;
      percentage: string;
    };
  };
};

export type YahooLeagueStandings = {
  league_key: string;
  league_id: string;
  name: string;
  url: string;
  logo_url: string;
  draft_status: string;
  num_teams: number;
  edit_key: string;
  weekly_deadline: string;
  league_update_timestamp: string;
  scoring_type: string;
  league_type: string;
  renew: string;
  renewed: string;
  felo_tier: string;
  iris_group_chat_id: string;
  allow_add_to_dl_extra_pos: number;
  is_pro_league: string;
  is_cash_league: string;
  current_week: number;
  start_week: string;
  start_date: string;
  end_week: string;
  end_date: string;
  is_plus_league: string;
  game_code: string;
  season: string;
  standings: YahooTeamStandings[];
};

export type YahooPlayer = {
  player_key: string;
  player_id: string;
  name: {
    full: string;
    first: string;
    last: string;
    ascii_first: string;
    ascii_last: string;
  };
  editorial_player_key: string;
  editorial_team_key: string;
  editorial_team_full_name: string;
  editorial_team_abbr: string;
  uniform_number: string;
  display_position: string;
  headshot: string;
  is_undroppable: string;
  position_type: string;
  eligible_positions: string[];
};

export type YahooTeamRoster = {
  team_key: string;
  team_id: string;
  name: string;
  url: string;
  team_logo: string;
  waiver_priority: number;
  number_of_moves: string;
  number_of_trades: number;
  clinched_playoffs: number;
  managers: [
    {
      manager_id: string;
      nickname: string;
      guid: string;
      is_commissioner: string;
    },
  ];
  roster: YahooPlayer[];
};

export type YahooUserGames = {
  guid: string;
  games: Array<{
    game_key: string;
    game_id: string;
    name: string;
    code: string;
    type: string;
    url: string;
    season: string;
    is_registration_over: boolean;
    is_game_over: boolean;
    is_offseason: boolean;
    is_live_draft_lobby_active: boolean;
  }>;
};

export type YahooUserGameTeams = {
  guid: string;
  teams: Array<{
    game_key: string;
    game_id: string;
    name: string;
    code: string;
    type: string;
    url: string;
    season: string;
    teams: Array<YahooUserGameTeam>;
  }>;
};

export type YahooUserGameTeam = {
  team_key: string;
  team_id: string;
  name: string;
  is_owned_by_current_login: number;
  url: string;
  team_logo: string;
  waiver_priority: number;
  number_of_moves: string;
  number_of_trades: number;
  managers: [
    {
      manager_id: string;
      nickname: string;
      guid: string;
      is_current_login: string;
      email: string;
      image_url: string;
    },
  ];
};

export type FantasyStats = {
  team_id: string;
  team: string;
  [key: string]: string;
};

export type DBFantasyStats = {
  league_key: string;
  team_id: string;
  name: string;
  week: number;
  stats: { value: string; stat_id: string }[];
};

export type YahooSettingsStatCategory = {
  stat_id: number;
  enabled: string;
  name: string;
  display_name: string;
  group: string;
  abbr: string;
  sort_order: string;
  position_type: string;
  stat_position_types: string[];
  is_only_display_stat: string;
};
