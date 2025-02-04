import { groupStatsByWeek } from "@/lib/yahoo/utils";
import { createStatTableColumns } from "./columns";
import StatsTable from "@/components/stats-table";
import { DBFantasyStats, YahooSettingsStatCategory } from "@/lib/yahoo/types";
import { getCurrentWeekStats } from "@/lib/yahoo";
import { getUserJWT } from "@/lib/auth/auth";
import { getUsersTeamId } from "@/lib/data/users";
import { getLeagueCategories } from "@/lib/data/leagues";
import { getLeagueStats } from "@/lib/data/stats";

type PageProps = {
  params: Promise<{ league_key: string }>;
};

export default async function StatsPage({ params }: PageProps) {
  const { league_key } = await params;
  const user = await getUserJWT();

  const [userTeamId, cats, stats, current_stats] = await Promise.all([
    getUsersTeamId(user, league_key),
    getLeagueCategories(league_key),
    getLeagueStats(user, league_key),
    getCurrentWeekStats(user, league_key),
  ]);

  const columns = createStatTableColumns(
    cats as unknown as YahooSettingsStatCategory[],
  );

  return (
    <div className="mx-auto max-w-[90vw]">
      <StatsTable
        userTeamId={userTeamId}
        columns={columns}
        current_stats={current_stats}
        stats={groupStatsByWeek(stats as unknown as DBFantasyStats[])}
      />
    </div>
  );
}
