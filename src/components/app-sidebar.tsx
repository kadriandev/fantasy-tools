import { BarChart2, ChevronDown, Icon } from "lucide-react";
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
} from "@/components/ui/sidebar";
import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";
import { logout } from "@/lib/auth/actions";
import { Button } from "./ui/button";

export async function AppSidebar() {
  return (
    <>
      <Sidebar>
        <SidebarHeader className="m-2 text-xl font-bold text-primary">
          <Link href="/fantasy" className="flex gap-2">
            <BarChart2 className="h-6 w-6" />
            Fantasy Pro
          </Link>
        </SidebarHeader>
        <SidebarContent></SidebarContent>
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

                <SidebarMenuItem></SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup className="gap-3">
            <Button variant="outline" onClick={logout}>
              Sign Out
            </Button>
            <ThemeSwitcher />
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
