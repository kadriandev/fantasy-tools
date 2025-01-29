import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth/actions";
import { Menu } from "lucide-react";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const subject = await auth();

  if (!subject) {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div>
        <SidebarTrigger className="sticky top-4 ml-2">
          <Menu />
        </SidebarTrigger>
      </div>
      <div className="mt-14 flex-1 w-full flex flex-col items-center">
        <div className="w-full pr-5 pb-5 m-20">{children}</div>
      </div>
    </SidebarProvider>
  );
}
