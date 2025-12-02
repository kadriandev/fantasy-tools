import AuthWrapper from "@/components/auth-wrapper";
import LeagueStandings from "./league-standings";

interface StandingsPageProps {
  params: Promise<{ league_key: string }>;
  searchParams: Promise<{ session_expired: boolean }>;
}

export default async function StandingsPage({
  params,
  searchParams,
}: StandingsPageProps) {
  const { league_key } = await params;
  const { session_expired } = await searchParams;

  return (
    <AuthWrapper session_expired={session_expired}>
      <LeagueStandings league_key={league_key} />
    </AuthWrapper>
  );
}
