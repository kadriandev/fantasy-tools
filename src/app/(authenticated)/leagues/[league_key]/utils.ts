export function createLeagueEvents(settings: any) {
  const events = [
    { week: 1, title: "Start" },
    {
      week: settings.current_week,
      title: "Current Week",
      current: true,
    },
    {
      week: settings.end_week,
      title: "End",
    },
  ];

  if (settings.settings.uses_playoff) {
    events.push({
      week: settings.settings.playoff_start_week,
      title: "Playoffs Start",
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
  });
  return events;
}
