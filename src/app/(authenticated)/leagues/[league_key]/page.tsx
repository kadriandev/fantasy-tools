import type { Metadata } from "next";
import { ArrowRight, Users } from "lucide-react";

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
import { getUserJWT } from "@/lib/auth/auth";
import Timeline from "@/components/ui/timeline";
import { createLeagueEvents } from "./utils";
import AppButtonLink from "@/components/app-button-link";

export const metadata: Metadata = {
  title: "Fantasy League Information",
  description: "Comprehensive overview of your fantasy sports league",
};

interface LeagueInfoPageProps {
  params: Promise<{ league_key: string }>;
}

export default async function LeagueInfoPage({ params }: LeagueInfoPageProps) {
  const { league_key } = await params;
  const user = await getUserJWT();
  const yf = createYahooClient(user.properties.access);
  const [meta, settings, standings] = await Promise.all([
    yf.league.meta(league_key),
    yf.league.settings(league_key),
    yf.league.standings(league_key),
  ]);

  const matchups = await getUpcomingMatchups(
    user,
    league_key,
    settings.current_week,
  );
  const events = createLeagueEvents(settings);

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-8">{meta.name}</h1>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">League Timeline</CardTitle>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Timeline events={events} />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Standings</CardTitle>
          </CardHeader>
          <CardContent>
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
                {standings.standings.slice(0, 4).map((team: any) => (
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
            <CardTitle>Upcoming Matchups</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {matchups.map((matchup: any, index: number) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="truncate w-3/5">{matchup.home.name}</span>
                  <span className="text-muted-foreground">vs</span>
                  <span className="truncate w-3/5">{matchup.away.name}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
