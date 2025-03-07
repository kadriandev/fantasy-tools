import { auth } from "@/lib/auth/actions";
import { getSubTier } from "@/lib/stripe/get-sub-tier";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await auth();
  const sub = await getSubTier(user.sub);

  if (sub === null) {
    redirect("/not-allowed");
  }

  return children;
}
