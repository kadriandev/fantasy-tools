"use server";

import { getStripeSubByUserId } from "./store";

export async function getSubTier(userId: string) {
  const sub = await getStripeSubByUserId(userId);
  if (sub?.status === "active") return sub;

  return null;
}
