import AuthWrapper from "@/components/auth-wrapper";
import LeagueTrends from "./league-trends";

interface TrendsPageProps {
  params: Promise<{ league_key: string }>;
  searchParams: Promise<{
    compareTo: string | undefined;
    session_expired: boolean;
  }>;
}

export default async function TrendsPage({
  params,
  searchParams,
}: TrendsPageProps) {
  const { league_key } = await params;
  const { compareTo, session_expired } = await searchParams;

  return (
    <AuthWrapper session_expired={session_expired}>
      <LeagueTrends league_key={league_key} compareTo={compareTo} />
    </AuthWrapper>
  );
}
