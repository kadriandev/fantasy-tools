"use server";

import { auth } from "../auth/actions";
import { getStripeSubByUserId } from "./store";

export async function getSubTier() {
  const user = await auth();
  if (!user) return null;

  const sub = await getStripeSubByUserId(user.properties.sub);
  console.log(sub);
  if (sub?.status === "active") return sub;

  return null;
}
