import { groupStatsByWeek, scoreboardToStatsTable } from "@/lib/yahoo/utils";
import { createStatTableColumns } from "./columns";
import StatsTable from "@/components/stats-table";
import { YahooSettingsStatCategory } from "@/lib/yahoo/league/schemas";
import { getUsersTeamId } from "@/lib/data/users";
import { getLeagueCategories } from "@/lib/data/leagues";
import { getLeagueStats } from "@/lib/data/stats";
import { YahooFantasy } from "@/lib/yahoo/yahoo";

type PageProps = {
  params: Promise<{ league_key: string }>;
};

export default async function StatsPage({ params }: PageProps) {
  const { league_key } = await params;

  const yf = await YahooFantasy.createClient();

  const [userTeamId, cats, stats, scoreboard] = await Promise.all([
    getUsersTeamId(league_key),
    getLeagueCategories(league_key),
    getLeagueStats(league_key),
    yf.league.scoreboard(league_key),
  ]);

  const columns = createStatTableColumns(cats as YahooSettingsStatCategory[]);

  return (
    <div className="mx-auto max-w-[85vw]">
      <StatsTable
        userTeamId={userTeamId}
        columns={columns}
        current_stats={scoreboardToStatsTable(scoreboard)}
        stats={groupStatsByWeek(stats)}
      />
    </div>
  );
}
