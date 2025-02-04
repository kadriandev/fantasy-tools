import { BarChart2, RefreshCw } from "lucide-react";
import { baseball, basketball, football } from "@lucide/lab";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";
import { logout } from "@/lib/auth/actions";
import { Button } from "./ui/button";
import LeagueSelector from "./league-selector";
import AppLink from "./app-link";
import { refreshLeagues } from "@/lib/data/leagues";

const routes = [
  { name: "League Info", route: "" },
  { name: "Standings", route: "standings" },
  { name: "Stats", route: "stats" },
  { name: "Trends", route: "trends" },
];

interface AppSidebarProps {
  leagues: {
    league_name: string;
    league_key: string;
    url: string;
    game: string;
    categories: unknown;
    num_teams: number;
  }[];
}
export async function AppSidebar({ leagues }: AppSidebarProps) {
  return (
    <>
      <Sidebar>
        <SidebarHeader className="m-2 text-xl font-bold text-primary">
          <Link href="/leagues" className="flex gap-2">
            <BarChart2 className="h-6 w-6" />
            Fantasy Pro
          </Link>
        </SidebarHeader>
        <SidebarContent className="px-2">
          <SidebarGroup>
            <SidebarGroupLabel className="items-center justify-between my-2">
              <span>Leagues</span>
              <Button size="sm" variant={"ghost"} onClick={refreshLeagues}>
                <RefreshCw />
              </Button>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <LeagueSelector leagues={leagues!} />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu suppressHydrationWarning>
                {routes.map((r) => (
                  <AppLink key={r.name} appName={r.name} stub={r.route} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="mb-8">
          <SidebarGroup>
            <SidebarGroupLabel className="text-lg">Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/account">
                      {/* <item.icon /> */}
                      <span>Account</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup className="gap-3">
            <ThemeSwitcher />
            <Button variant="outline" onClick={logout}>
              Sign Out
            </Button>
            <p className="text-muted-foreground text-xs">Version: 0.1.0</p>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
