"use client";

import { usePathname, useRouter } from "next/navigation";
import { SidebarMenuItem, SidebarMenuButton } from "./ui/sidebar";

interface AppLinkProps {
  appName: string;
  stub: string;
}

export default function AppLink({ appName, stub }: AppLinkProps) {
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
        <SidebarMenuButton onClick={swapApp}>{appName}</SidebarMenuButton>
      </SidebarMenuItem>
    )
  );
}
