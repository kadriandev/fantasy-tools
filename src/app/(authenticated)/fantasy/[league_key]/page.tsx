interface LeaguePageProps {
  params: Promise<{ league_key: string }>;
}

export default async function LeaguePage({ params }: LeaguePageProps) {
  // TODO: Get League Details and show league information
  const { league_key } = await params;
  return <p>League Page: {league_key}</p>;
}
