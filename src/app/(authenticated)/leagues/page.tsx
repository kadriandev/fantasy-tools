import { auth } from "@/lib/auth/actions";
import { refreshLeagues } from "@/lib/data/leagues";
import { getUser } from "@/lib/data/users";
import { redirect } from "next/navigation";

export default async function LeagueInfoPage() {
  const subject = await auth();
  if (!subject) redirect("/");

  const user = await getUser(subject.sub);
  if (user.length && !user[0].last_updated) await refreshLeagues();

  return (
    <div className="absolute top-1/2 left-1/2">
      <p className="text-5xl text-muted-foreground">Select a League</p>
    </div>
  );
}
