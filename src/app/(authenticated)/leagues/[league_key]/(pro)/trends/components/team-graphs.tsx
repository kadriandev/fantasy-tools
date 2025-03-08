"use client";

import { useState } from "react";
import { StatsChart } from "./stats-chart";
import TeamSelector from "./team-selector";
import { useSearchParams } from "next/navigation";

interface TeamOverviewProps {
  teams: string[];
  data: any[];
}

export default function TeamGraphs({ teams, data }: TeamOverviewProps) {
  const searchParams = useSearchParams();
  const compareTeam = searchParams.get("compareTo") ?? "league";
  const [selected, setSelected] = useState<string>("");

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
          <TeamSelector teams={teams} />
        </span>
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((s) => (
          <StatsChart
            key={s.stat_id}
            name={s.abbr}
            desc={s.name}
            data={s.data}
            comparisonLabel={
              compareTeam === "league" ? "League Avg." : compareTeam
            }
            selected={selected === s.abbr}
            setSelected={setSelected}
          />
        ))}
      </div>
    </>
  );
}
