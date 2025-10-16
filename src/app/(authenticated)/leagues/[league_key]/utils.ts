type Event = {
  week: number;
  title: string;
  current: boolean;
};

export function createLeagueEvents(settings: any): Array<Event> {
  let events: Array<Event> = [
    { week: 1, title: "Start", current: false },
    {
      week: settings.end_week,
      title: "End",
      current: false,
    },
  ];

  if (settings.settings.uses_playoff) {
    events.push({
      week: settings.settings.playoff_start_week,
      title: "Playoffs Start",
      current: false,
    });
  }

  const trade_deadline_week = Math.floor(
    (new Date(settings.settings.trade_end_date).getTime() -
      new Date().getTime()) /
      (1000 * 60 * 60 * 24 * 7),
  );

  events.push({
    week: settings.current_week + trade_deadline_week,
    title: "Trade Deadline",
    current: false,
  });

  let eventWeekMatched = false;
  events = events.reduce((acc: Array<Event>, curr: Event) => {
    if (curr.week === settings.current_week) {
      curr.current = true;
      eventWeekMatched = true;
    }
    acc.push(curr);
    return acc;
  }, [] as Array<Event>);

  if (!eventWeekMatched) {
    events.push({
      week: settings.current_week,
      title: "Current Week",
      current: true,
    });
  }

  return events;
}
