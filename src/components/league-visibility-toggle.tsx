"use client";

import { toggleLeagueVisibility } from "@/lib/data/leagues";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface League {
  league_key: string;
  league_name: string;
  game: string;
  is_hidden: number;
}

interface LeagueVisibilityToggleProps {
  leagues: League[];
}

export function LeagueVisibilityToggle({
  leagues,
}: LeagueVisibilityToggleProps) {
  const router = useRouter();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {},
  );

  const handleToggle = async (leagueKey: string) => {
    setLoadingStates((prev) => ({ ...prev, [leagueKey]: true }));

    try {
      await toggleLeagueVisibility(leagueKey);
      router.refresh();
    } catch (error) {
      console.error("Failed to toggle league visibility:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [leagueKey]: false }));
    }
  };

  return (
    <div className="space-y-4">
      {leagues.map((league) => (
        <div
          key={league.league_key}
          className="flex items-center justify-between space-x-4 rounded-lg border p-4"
        >
          <div className="flex-1 space-y-1">
            <Label htmlFor={league.league_key} className="text-base font-medium">
              {league.league_name}
            </Label>
            <p className="text-sm text-muted-foreground">{league.game}</p>
          </div>
          <Switch
            id={league.league_key}
            checked={league.is_hidden === 0}
            onCheckedChange={() => handleToggle(league.league_key)}
            disabled={loadingStates[league.league_key]}
          />
        </div>
      ))}
    </div>
  );
}
