import { getSubTier } from "@/lib/stripe/get-sub-tier";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const sub = await getSubTier();

  if (sub === null) {
    redirect("/not-allowed");
  }

  return children;
}
