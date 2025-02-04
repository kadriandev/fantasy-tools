"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";

interface AppButtonLinkProps {
  appName: string;
  stub: string;
}

export default function AppButtonLink({ appName, stub }: AppButtonLinkProps) {
  const router = useRouter();
  const pathname = usePathname();

  function swapApp() {
    const path = pathname.split("/");
    path[3] = stub;
    router.push(path.join("/"));
  }

  return (
    pathname.split("/").length > 2 && (
      <Button variant="outline" size="sm" onClick={swapApp}>
        {appName}
      </Button>
    )
  );
}
