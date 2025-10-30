import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createYahooClient, getUpcomingMatchups } from "@/lib/yahoo";
import Timeline from "@/components/ui/timeline";
import { createLeagueEvents } from "./utils";
import AppButtonLink from "@/components/app-button-link";
import { auth } from "@/lib/auth/actions";
import { YahooLeagueSettings, YahooLeagueStandings } from "@/lib/yahoo/types";
import { catchError } from "@/lib/utils";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Fantasy League Information",
  description: "Comprehensive overview of your fantasy sports league",
};

interface LeagueInfoPageProps {
  params: Promise<{ league_key: string }>;
}

export default async function LeagueInfoPage({ params }: LeagueInfoPageProps) {
  const { league_key } = await params;
  const user = await auth();
  if (!user) redirect("/");

  const yf = createYahooClient(user.access);
  const [err, data] = await catchError(
    Promise.all<[{ name: string }, YahooLeagueSettings, YahooLeagueStandings]>([
      yf.league.meta(league_key),
      yf.league.settings(league_key),
      yf.league.standings(league_key),
    ]),
  );

  if (err) {
    console.log(err);
    redirect("/leagues");
  }

  const [meta, settings, standings] = data;

  const matchups = await getUpcomingMatchups(
    user,
    league_key,
    settings.current_week,
  );
  const events = createLeagueEvents(settings);

  return (
    <div className="container mx-auto">
      <h1 className="text-xl ml-12 mt-2 md:text-4xl md:ml-0 md:mt-0 font-bold mb-8">
        {meta.name}
      </h1>
      <Card className="m-2 mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-bold">League Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <Timeline events={events} />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card className="m-2">
          <CardHeader>
            <CardTitle className="text-md font-bold">
              Current Standings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="hidden md:table-cell">W-L-T</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Games Behind
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {standings.standings.slice(0, 4).map((team: any) => (
                  <TableRow key={team.team_id}>
                    <TableCell>{team.standings.rank}</TableCell>
                    <TableCell>{team.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {team.standings.outcome_totals.wins}-
                      {team.standings.outcome_totals.losses}-
                      {team.standings.outcome_totals.ties}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {team.standings.games_back}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4">
              <AppButtonLink
                appName={"View Full Standings"}
                stub={"standings"}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-md font-bold">
              Upcoming Matchups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="mt-6 space-y-4">
              {matchups.map((matchup: any, index: number) => (
                <li
                  key={index}
                  className="flex flex-col p-2 text-center md:text-left md:flex-row md:justify-between md:items-center"
                >
                  <span className="truncate md:w-3/5">{matchup.home.name}</span>
                  <span className="text-muted-foreground">vs</span>
                  <span className="md:text-right truncate md:w-3/5">
                    {matchup.away.name}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
