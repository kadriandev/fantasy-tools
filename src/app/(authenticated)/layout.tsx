import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getVerifiedUser } from "@/lib/auth/actions";
import { getLeagues } from "@/lib/data/leagues";
import { getSubTier } from "@/lib/stripe/get-sub-tier";
import { catchError } from "@/lib/utils";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const routes = [
  { name: "League Info", route: "", free: true },
  { name: "Standings", route: "standings", free: true },
  { name: "Stats", route: "stats", free: true },
  { name: "Trends", route: "trends", free: false },
];

export default async function Layout({ children }: { children: ReactNode }) {
  const verified = await getVerifiedUser();

  if (!verified) {
    redirect("/");
  }
  const [err, data] = await catchError(
    Promise.all([getSubTier(), getLeagues(verified.sub)]),
  );

  if (err) {
    console.error("Error getting leagues or sub tier");
    redirect("/");
  }

  const [tier, leagues] = data;

  return (
    <main>
      <SidebarProvider>
        <AppSidebar tier={tier} routes={routes} leagues={leagues} />
        <div className="m-2 md:m-14 flex-1 w-full flex-col items-center">
          {children}
        </div>
      </SidebarProvider>
    </main>
  );
}
