import { fetchAndSaveLeagueStats, getUsersTeamId } from "@/lib/yahoo/queries";
import { createStatTableColumns } from "./columns";
import StatsTable from "@/components/stats-table";
import { getCurrentWeekStats, groupStatsByWeek } from "@/lib/yahoo/utils";

type PageProps = {
  params: { league_key: string };
};

export default async function StatsPage({ params }: PageProps) {
  const userTeamId = await getUsersTeamId(params.league_key);
  const { cats, stats } = await fetchAndSaveLeagueStats(
    params.league_key,
    userTeamId,
  );

  const columns = createStatTableColumns(cats);
  const current_stats = await getCurrentWeekStats(params.league_key);

  return (
    <StatsTable
      userTeamId={userTeamId!}
      columns={columns}
      current_stats={current_stats}
      stats={groupStatsByWeek(stats)}
    />
  );
}
