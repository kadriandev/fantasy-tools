import { getVerifiedUser } from "@/lib/auth/actions";
import { getAllLeagues } from "@/lib/data/leagues";
import { redirect } from "next/navigation";
import { LeagueVisibilityToggle } from "@/components/league-visibility-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SettingsPage() {
  const user = await getVerifiedUser();

  if (!user) {
    redirect("/");
  }

  const leagues = await getAllLeagues(user.sub);

  return (
    <div>
      <h2 className="text-2xl font-bold">Settings</h2>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>League Visibility</CardTitle>
            <CardDescription>
              Choose which leagues appear in the league selector. Hidden leagues
              will not be shown in the sidebar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LeagueVisibilityToggle leagues={leagues} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
