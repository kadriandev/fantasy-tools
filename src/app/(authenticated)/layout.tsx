import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth/actions";
import { getLeagues, refreshLeagues } from "@/lib/data/leagues";
import { getUser } from "@/lib/data/users";
import { getPastMonday } from "@/lib/utils";
import { Menu } from "lucide-react";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const subject = await auth();

  if (!subject) {
    redirect("/");
  }

  // Get user and check if last updated date is before last monday
  // If so, then refresh user leagues to get updated info
  const user = await getUser(subject.properties.sub);
  const mostRecentMonday = getPastMonday();
  if (!user[0].last_updated || user[0].last_updated < mostRecentMonday) {
    await refreshLeagues();
  }

  const leagues = await getLeagues(subject.properties.sub);

  return (
    <main>
      <SidebarProvider>
        <AppSidebar leagues={leagues} />
        <div>
          <SidebarTrigger className="sticky top-4 ml-2">
            <Menu />
          </SidebarTrigger>
        </div>
        <div className="m-14 flex-1 w-full flex-col items-center">
          {children}
        </div>
      </SidebarProvider>
    </main>
  );
}
