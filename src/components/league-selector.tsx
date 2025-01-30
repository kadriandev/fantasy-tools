"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface LeagueSelectorProps {
  leagues: { league_name: string; league_key: string }[];
}

export default function LeagueSelector({ leagues }: LeagueSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const league_key = pathname.split("/")[2];

  function handleChange(league: string) {
    const path = pathname.split("/");
    path[2] = league;
    router.push(path.join("/"));
  }

  return (
    <Select defaultValue={league_key} onValueChange={handleChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {leagues.map((l) => (
          <SelectItem key={l.league_key} value={l.league_key}>
            {l.league_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
