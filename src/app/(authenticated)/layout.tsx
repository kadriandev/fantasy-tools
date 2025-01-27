import { auth } from "@/lib/auth/actions";
import { ReactNode } from "hono/jsx";
import { redirect } from "next/navigation";

export default function Layout({ children }: { children: ReactNode | ReactNode[]}) {
  const subject = auth();

  if(!subject) {
    redirect("/")
  }

  return <>{children}</>
}
