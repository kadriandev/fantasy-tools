import AuthWrapper from "@/components/auth-wrapper";
import { refreshLeagues } from "@/lib/data/leagues";
import { getUser } from "@/lib/data/users";
import { cookies } from "next/headers";

interface LeaguePageProps {
  searchParams: Promise<{ session_expired: boolean }>;
}

export default async function LeagueInfoPage({
  searchParams,
}: LeaguePageProps) {
  const { session_expired } = await searchParams;

  const cookieStore = await cookies();
  const sub = cookieStore.get("user_sub");

  if (sub) {
    const user = await getUser(sub.value);
    if (user.length && !user[0].last_updated) await refreshLeagues();
  }

  return (
    <AuthWrapper session_expired={session_expired}>
      <div className="absolute top-1/2 left-1/2">
        <p className="text-5xl text-muted-foreground">Select a League</p>
      </div>
    </AuthWrapper>
  );
}
