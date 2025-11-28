import { catchError } from "@/lib/utils";
import {
  YahooLeagueMeta,
  YahooLeagueSettings,
} from "@/lib/yahoo/league/schemas";
import { YahooFantasy } from "@/lib/yahoo/yahoo";

type Event = {
  week: number;
  title: string;
  current: boolean;
};

export async function getUpcomingMatchups(
  league_key: string,
  current_week: number,
) {
  const yf = await YahooFantasy.createClient();

  const [err, scoreboard] = await catchError(
    yf.league.scoreboard(league_key, current_week + 1),
  );
  if (err) {
    console.log(err);
    return [];
  }

  const matchups = scoreboard.matchups.map((m: any) => ({
    home: m.teams[0],
    away: m.teams[1],
  }));
  return matchups;
}

export function createLeagueEvents(
  meta: YahooLeagueMeta,
  settings: YahooLeagueSettings,
): Array<Event> {
  let events: Array<Event> = [
    { week: 1, title: "Start", current: false },
    {
      week: meta.end_week,
      title: "End",
      current: false,
    },
  ];

  if (settings.uses_playoff) {
    events.push({
      week: settings.playoff_start_week,
      title: "Playoffs Start",
      current: false,
    });
  }

  const trade_deadline_week = Math.floor(
    (new Date(settings.trade_end_date).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24 * 7),
  );

  events.push({
    week: meta.current_week + trade_deadline_week,
    title: "Trade Deadline",
    current: false,
  });

  let eventWeekMatched = false;
  events = events.reduce((acc: Array<Event>, curr: Event) => {
    if (curr.week === meta.current_week) {
      curr.current = true;
      eventWeekMatched = true;
    }
    acc.push(curr);
    return acc;
  }, [] as Array<Event>);

  if (!eventWeekMatched) {
    events.push({
      week: meta.current_week,
      title: "Current Week",
      current: true,
    });
  }

  return events;
}
