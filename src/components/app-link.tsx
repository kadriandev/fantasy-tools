"use client";

import { usePathname, useRouter } from "next/navigation";
import { SidebarMenuItem, SidebarMenuButton } from "./ui/sidebar";
import { Lock } from "lucide-react";

interface AppLinkProps {
  appName: string;
  stub: string;
  disabled: boolean;
}

export default function AppLink({ appName, stub, disabled }: AppLinkProps) {
  const router = useRouter();
  const pathname = usePathname();

  function swapApp() {
    const path = pathname.split("/");
    path[3] = stub;
    router.push(path.join("/"));
  }

  return (
    pathname.split("/").length > 2 && (
      <SidebarMenuItem>
        <SidebarMenuButton onClick={swapApp} disabled={disabled}>
          {disabled && <Lock />}
          {appName}
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  );
}
