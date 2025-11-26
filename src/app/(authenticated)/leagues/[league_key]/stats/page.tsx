import { groupStatsByWeek } from "@/lib/yahoo/utils";
import { createStatTableColumns } from "./columns";
import StatsTable from "@/components/stats-table";
import { DBFantasyStats, YahooSettingsStatCategory } from "@/lib/yahoo/types";
import { getCurrentWeekStats } from "@/lib/yahoo";
import { getUsersTeamId } from "@/lib/data/users";
import { getLeagueCategories } from "@/lib/data/leagues";
import { getLeagueStats } from "@/lib/data/stats";

type PageProps = {
  params: Promise<{ league_key: string }>;
};

export default async function StatsPage({ params }: PageProps) {
  const { league_key } = await params;

  const [userTeamId, cats, stats, current_stats] = await Promise.all([
    getUsersTeamId(league_key),
    getLeagueCategories(league_key),
    getLeagueStats(league_key),
    getCurrentWeekStats(league_key),
  ]);

  const columns = createStatTableColumns(
    cats as unknown as YahooSettingsStatCategory[],
  );

  return (
    <div className="mx-auto max-w-[85vw]">
      <StatsTable
        userTeamId={userTeamId}
        columns={columns}
        current_stats={current_stats}
        stats={groupStatsByWeek(stats as unknown as DBFantasyStats[])}
      />
    </div>
  );
}
