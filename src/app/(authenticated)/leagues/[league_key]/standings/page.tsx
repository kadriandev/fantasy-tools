import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { getUsersTeamId } from "@/lib/data/users";
import { cn } from "@/lib/utils";
import { YahooFantasy } from "@/lib/yahoo/yahoo";

interface StandingsPageProps {
  params: Promise<{ league_key: string }>;
}

export default async function StandingsPage({ params }: StandingsPageProps) {
  const { league_key } = await params;
  const yf = await YahooFantasy.createClient();

  const [teamId, standings] = await Promise.all([
    getUsersTeamId(league_key),
    yf.league.standings(league_key),
  ]);

  return (
    <div className="mx-auto max-w-[90vw]">
      <h1 className="text-xl ml-12 mt-2 md:ml-0 md:mt-0 font-bold mb-8">
        Standings
      </h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-6">Rank</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="w-20">W-L-T</TableHead>
            <TableHead className="hidden md:table-cell">Games Behind</TableHead>
            <TableHead className="table-cell md:hidden">GB</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((team: any) => (
            <TableRow
              key={team.team_id}
              className={cn(
                team.team_id == teamId && "bg-primary dark:bg-primary/40",
              )}
            >
              <TableCell className="w-6">{team.standings.rank}</TableCell>
              <TableCell>{team.name}</TableCell>
              <TableCell className="w-20">
                {team.standings.outcome_totals.wins}-
                {team.standings.outcome_totals.losses}-
                {team.standings.outcome_totals.ties}
              </TableCell>

              <TableCell>{team.standings?.games_back ?? ""}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
