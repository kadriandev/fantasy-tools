import { getUsersTeamId } from "@/lib/data/users";
import TeamGraphs from "./components/team-graphs";
import { getUserJWT } from "@/lib/auth/auth";
import { groupStatsByWeek } from "@/lib/yahoo/utils";
import { getLeagueCategories } from "@/lib/data/leagues";
import { getLeagueStats } from "@/lib/data/stats";
import { DBFantasyStats } from "@/lib/yahoo/types";
import { processStatChartData } from "./components/utils";

interface TrendsPageProps {
  params: Promise<{ league_key: string }>;
  searchParams: Promise<{ compareTo: string | undefined }>;
}

export default async function TrendsPage({
  params,
  searchParams,
}: TrendsPageProps) {
  const { league_key } = await params;
  const { compareTo } = await searchParams;

  const user = await getUserJWT();

  const [team_id, cats, stats] = await Promise.all([
    getUsersTeamId(user, league_key),
    getLeagueCategories(league_key),
    getLeagueStats(user, league_key),
  ]);

  const teams = groupStatsByWeek(stats as unknown as DBFantasyStats[])[0]
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
