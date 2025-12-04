"use client";

import pkg from "../../package.json";
import { BarChart2, Lock, Menu, RefreshCw } from "lucide-react";
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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
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
import { redirect, usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  tier: any | null;
  routes: { name: string; route: string; free: boolean }[];
  leagues: { league_key: string; league_name: string }[];
}
export function AppSidebar({ tier, routes, leagues }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [league_key, setLeagueKey] = useState(
    pathname.split("/")[2] ?? leagues[0]?.league_key ?? "",
  );
  const { isMobile, toggleSidebar } = useSidebar();

  useEffect(() => {
    if (pathname.startsWith("/leagues")) {
      const paths = pathname.split("/");
      paths[2] = league_key;
      router.replace(paths.join("/"));
    }
  }, [league_key]);

  const refresh = async () => {
    setIsRefreshing(true);
    await refreshLeagues();
    setIsRefreshing(false);
    redirect("/leagues");
  };

  return (
    <div className="relative">
      <SidebarTrigger className="block md:hidden absolute top-4 left-7">
        <Menu />
      </SidebarTrigger>
      <Sidebar>
        <SidebarTrigger className="hidden md:block md:relative left-64 md:top-4 ml-2">
          <Menu />
        </SidebarTrigger>
        <SidebarHeader className="z-400 m-2 text-xl font-bold text-primary">
          <Link href="/leagues" className="flex gap-2">
            <BarChart2 className="h-6 w-6" />
            Fantasy Tools
          </Link>
        </SidebarHeader>
        <SidebarContent className="px-2">
          <SidebarGroup>
            <SidebarGroupLabel className="items-center justify-between my-2">
              <span>Leagues</span>
              <Button
                size="sm"
                variant={"ghost"}
                onClick={refresh}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={cn("animate-none", isRefreshing && "animate-spin")}
                />
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
                {league_key &&
                  routes.map((r) => (
                    <Link
                      key={r.route}
                      href={`/leagues/${league_key}/${r.route}`}
                    >
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => {
                            if (isMobile) toggleSidebar();
                          }}
                          disabled={!r.free && !tier}
                        >
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
            {/* <SidebarGroupLabel className="text-lg">Settings</SidebarGroupLabel> */}
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/settings">
                      {/* <item.icon /> */}
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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
            <Button variant="outline" onClick={logout}>
              Sign Out
            </Button>
            <p className="text-muted-foreground text-xs">
              Version: {pkg.version}
            </p>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
