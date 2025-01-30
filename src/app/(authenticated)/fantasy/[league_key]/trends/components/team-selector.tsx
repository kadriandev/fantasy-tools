import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface TeamSelectorProps {
  teams: string[];
}

export default function TeamSelector({ teams }: TeamSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onTeamChange = (team: string) => {
    const params = new URLSearchParams();
    params.set("compareTo", team);
    router.push(pathname + "?" + params.toString());
  };

  return (
    <Select
      value={searchParams.get("compareTo") ?? "league"}
      onValueChange={onTeamChange}
    >
      <SelectTrigger>
        <SelectValue defaultValue={"league"} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"league"}>Rest of League</SelectItem>
        {teams.map((t) => (
          <SelectItem key={t} value={t}>
            {t}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
