import { refreshLeagues } from "@/lib/data/leagues";
import { getUser } from "@/lib/data/users";
import { cookies } from "next/headers";

export default async function LeagueInfoPage() {
  const cookieStore = await cookies();
  const sub = cookieStore.get("user_sub");

  if (sub) {
    const user = await getUser(sub.value);
    if (user.length && !user[0].last_updated) await refreshLeagues();
  }

  return (
    <div className="absolute top-1/2 left-1/2">
      <p className="text-5xl text-muted-foreground">Select a League</p>
    </div>
  );
}
