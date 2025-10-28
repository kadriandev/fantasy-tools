import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth/actions";
import { getLeagues } from "@/lib/data/leagues";
import { getSubTier } from "@/lib/stripe/get-sub-tier";
import { catchError } from "@/lib/utils";
import { Menu } from "lucide-react";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const routes = [
  { name: "League Info", route: "", free: true },
  { name: "Standings", route: "standings", free: true },
  { name: "Stats", route: "stats", free: true },
  { name: "Trends", route: "trends", free: false },
];

export default async function Layout({ children }: { children: ReactNode }) {
  const subject = await auth();

  if (!subject) {
    redirect("/");
  }

  console.log(subject);

  const [err, data] = await catchError(
    Promise.all([getSubTier(subject.sub), getLeagues(subject.sub)]),
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
