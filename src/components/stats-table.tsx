"use client";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import DataTable from "./data-table";
import { useEffect, useState } from "react";
import { DBFantasyStats, FantasyStats } from "@/lib/data/schemas";
import { ColumnDef } from "@tanstack/react-table";

interface StatsTableProps {
  userTeamId: number;
  columns: Array<ColumnDef<FantasyStats>>;
  current_stats: Array<FantasyStats>;
  stats: Array<DBFantasyStats>;
}

export default function StatsTable({
  userTeamId,
  columns,
  current_stats,
  stats,
}: StatsTableProps) {
  const [data, setData] = useState<Array<FantasyStats>>([]);
  const [week, setWeek] = useState("current");

  const weeks: string[] = Array.from(
    { length: stats.length + 1 },
    (_, i) => i + 1 + "",
  ).reverse();

  useEffect(() => {
    if (week === "current") {
      setData(current_stats);
    } else {
      const data = stats
        .filter((x: any) => x[0].week === +week)[0]
        .map((t) => {
          const res: FantasyStats = {
            team_id: t.team_id + "",
            team_name: t.team_name,
          };
          t.stats.forEach((s) => (res[s.stat_id] = s.value));
          return res;
        });
      setData(data);
    }
  }, [stats, week, current_stats]);

  return (
    <>
      <h1 className="text-xl align-middle ml-12 mt-1 mb-2 md:ml-0 md:py-4 flex font-bold">
        <span className="self-center">Stats</span>
        <span className="ml-auto">
          <Select
            defaultValue="current"
            value={week ?? "current"}
            onValueChange={setWeek}
          >
            <SelectTrigger>
              <SelectValue placeholder="Current Week" />
            </SelectTrigger>
            <SelectContent>
              {weeks.map((week, i) => (
                <SelectItem key={week} value={i === 0 ? "current" : week}>
                  {i === 0 ? "Current Week" : `Week ${week}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </span>
      </h1>
      <ScrollArea className="h-[500px]">
        <DataTable
          teamId={userTeamId!}
          columns={columns}
          data={data}
          stickyColumnId="team_name"
        />
      </ScrollArea>
    </>
  );
}
