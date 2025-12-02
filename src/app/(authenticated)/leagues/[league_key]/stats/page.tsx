import AuthWrapper from "@/components/auth-wrapper";
import LeagueStats from "./league-stats";

type PageProps = {
  params: Promise<{ league_key: string }>;
  searchParams: Promise<{ session_expired: boolean }>;
};

export default async function StatsPage({ params, searchParams }: PageProps) {
  const { league_key } = await params;
  const { session_expired } = await searchParams;

  return (
    <AuthWrapper session_expired={session_expired}>
      <LeagueStats league_key={league_key} />
    </AuthWrapper>
  );
}
