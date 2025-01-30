"use client";

import { useEffect, useState } from "react";
import { StatsChart } from "./stats-chart";
import TeamSelector from "./team-selector";
import { processStatChartData } from "./utils";

interface TeamOverviewProps {
  userTeamId: string;
  teams: string[];
  stats: any[];
  cats: any[];
}

export default function TeamGraphs({
  userTeamId,
  teams,
  stats,
  cats,
}: TeamOverviewProps) {
  const [statChartData, setStatChartData] = useState<any[]>([]);
  const [compareTeam, setCompareTeam] = useState<string>("league");

  useEffect(() => {
    const statChartData = processStatChartData(
      userTeamId!,
      cats,
      stats ?? [],
      compareTeam,
    );

    setStatChartData(statChartData);
  }, [compareTeam]);

  return (
    <>
      <div className="flex items-center">
        <h1 className="py-4 flex text-xl font-bold">
          My Team
          <span className="ml-4 font-light">
            (vs. {compareTeam === "league" ? "League" : compareTeam})
          </span>
        </h1>
        <span className="ml-auto">
          <TeamSelector
            teams={teams}
            team={compareTeam}
            onTeamChange={setCompareTeam}
          />
        </span>
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {statChartData.map((s) => (
          <StatsChart
            key={s.stat_id}
            name={s.abbr}
            desc={s.name}
            data={s.data}
            comparisonLabel={
              compareTeam === "league" ? "League Avg." : compareTeam
            }
          />
        ))}
      </div>
    </>
  );
}
