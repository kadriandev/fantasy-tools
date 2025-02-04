import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { getUserJWT } from "@/lib/auth/auth";
import { createYahooClient } from "@/lib/yahoo";

interface StandingsPageProps {
  params: Promise<{ league_key: string }>;
}

export default async function StandingsPage({ params }: StandingsPageProps) {
  const { league_key } = await params;
  const user = await getUserJWT();
  const yf = createYahooClient(user.properties.access);
  const standings = await yf.league.standings(league_key);
  return (
    <div className="mx-auto max-w-[90vw]">
      <h1 className="py-4 flex text-xl font-bold">Standings</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>W-L-T</TableHead>
            <TableHead>Games Behind</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.standings.map((team: any) => (
            <TableRow key={team.standings.rank}>
              <TableCell>{team.standings.rank}</TableCell>
              <TableCell>{team.name}</TableCell>
              <TableCell>
                {team.standings.outcome_totals.wins}-
                {team.standings.outcome_totals.losses}-
                {team.standings.outcome_totals.ties}
              </TableCell>

              <TableCell>{team.standings.games_back}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
