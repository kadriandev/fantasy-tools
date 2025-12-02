import AuthWrapper from "@/components/auth-wrapper";
import LeagueInfo from "./league-info";

interface LeagueInfoPageProps {
  params: Promise<{ league_key: string }>;
  searchParams: Promise<{ session_expired: boolean }>;
}

export default async function LeagueInfoPage({
  params,
  searchParams,
}: LeagueInfoPageProps) {
  const { league_key } = await params;
  const { session_expired } = await searchParams;

  return (
    <AuthWrapper session_expired={session_expired}>
      <LeagueInfo league_key={league_key} />
    </AuthWrapper>
  );
}
