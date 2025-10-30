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
    <div>
      <div className="flex items-center">
        {/* <h1 className="text-xl align-middle ml-12 mt-1 mb-2 md:ml-0 md:py-4 flex font-bold"> */}
        <h1 className="ml-12 mt-1 flex text-xl font-bold md:ml-0">
          My Team
          <span className="hidden md:block ml-4 font-light">
            (vs. {compareTeam === "league" ? "League" : compareTeam})
          </span>
        </h1>
        <span className="ml-auto">
          <TeamSelector teams={teams} />
        </span>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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
    </div>
  );
}
