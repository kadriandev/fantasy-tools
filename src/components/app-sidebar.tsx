"use client";

import { version } from "../../package.json";
import { BarChart2, Lock, RefreshCw } from "lucide-react";
// import { baseball, basketball, football } from "@lucide/lab";

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
import { refreshLeagues } from "@/lib/data/leagues";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface AppSidebarProps {
  tier: any | null;
  routes: { name: string; route: string; free: boolean }[];
  leagues: { league_key: string; league_name: string }[];
}
export function AppSidebar({ tier, routes, leagues }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [league_key, setLeagueKey] = useState(leagues[0].league_key);

  useEffect(() => {
    if (pathname.startsWith("/leagues")) {
      const paths = pathname.split("/");
      paths[2] = league_key;
      router.replace(paths.join("/"));
    }
  }, [league_key]);

  return (
    <>
      <Sidebar>
        <SidebarHeader className="m-2 text-xl font-bold text-primary">
          <Link href="/leagues" className="flex gap-2">
            <BarChart2 className="h-6 w-6" />
            Fantasy Tools
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
                  <Select
                    defaultValue={league_key}
                    onValueChange={setLeagueKey}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {leagues.map((l) => (
                        <SelectItem key={l.league_key} value={l.league_key}>
                          {l.league_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Link
                    key={r.route}
                    href={`/leagues/${league_key}/${r.route}`}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton disabled={!r.free && !tier}>
                        {!r.free && !tier && <Lock />}
                        {r.name}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </Link>
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
            <p className="text-muted-foreground text-xs">Version: {version}</p>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
