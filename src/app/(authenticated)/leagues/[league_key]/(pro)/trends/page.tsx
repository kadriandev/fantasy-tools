import { getLeagueCategories } from "@/lib/data/leagues";
import { getLeagueStats } from "@/lib/data/stats";
import { getUsersTeamId } from "@/lib/data/users";
import { groupStatsByWeek } from "@/lib/yahoo/utils";
import TeamGraphs from "./components/team-graphs";
import { processStatChartData } from "./components/utils";

interface TrendsPageProps {
  params: Promise<{ league_key: string }>;
  searchParams: Promise<{
    compareTo: string | undefined;
  }>;
}

export default async function TrendsPage({
  params,
  searchParams,
}: TrendsPageProps) {
  const { league_key } = await params;
  const { compareTo } = await searchParams;

  const [team_id, cats, stats] = await Promise.all([
    getUsersTeamId(league_key),
    getLeagueCategories(league_key),
    getLeagueStats(league_key),
  ]);

  if (!stats.length) {
    return (
      <div>
        <div className="absolute top-1/2 left-1/2">
          <p className="text-xl text-muted-foreground">
            Trends will be available once the season starts.
          </p>
        </div>
      </div>
    );
  }

  const teams = groupStatsByWeek(stats)[0]
    .filter((t) => +t.team_id !== team_id)
    .map((t) => t.team_name);

  const statChartData = processStatChartData(
    team_id,
    cats,
    stats ?? [],
    compareTo ?? "league",
  );

  return <TeamGraphs teams={teams} data={statChartData} />;
}
