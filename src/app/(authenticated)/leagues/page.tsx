import { getUserId } from "@/lib/auth/actions";
import { refreshLeagues } from "@/lib/data/leagues";
import { getUser } from "@/lib/data/users";

export default async function LeagueInfoPage() {
  const userId = await getUserId();
  const user = await getUser(userId);
  if (user.length && !user[0].last_updated) await refreshLeagues();

  return (
    <div className="absolute top-1/2 left-1/2">
      <p className="text-5xl text-muted-foreground">Select a League</p>
    </div>
  );
}
