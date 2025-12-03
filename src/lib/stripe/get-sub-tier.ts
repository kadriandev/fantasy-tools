"use server";

import { cookies } from "next/headers";
import { getStripeSubByUserId } from "./store";
import { getVerifiedUser } from "../auth/actions";
import { redirect } from "next/navigation";
import { syncStripeDataToKV } from "./sync-stripe-data-to-kv";

export async function getSubTier() {
  const cookieStore = await cookies();
  const usersub = cookieStore.get("user_sub");
  let userId;

  if (usersub) {
    userId = usersub.value;
  } else {
    const user = await getVerifiedUser();
    if (!user) redirect("/");

    userId = user.sub;
  }

  const sub = await getStripeSubByUserId(userId);
  if (sub?.status === "active") return sub;

  return null;
}

export async function getSubTierFromUserId(userId: string) {
  const sub = await getStripeSubByUserId(userId);
  if (sub?.status === "active") return sub;

  return null;
}

export async function restorePurchase() {
  const cookieStore = await cookies();
  const usersub = cookieStore.get("user_sub");
  if (usersub) await syncStripeDataToKV(usersub.value);
  redirect("/account");
}
