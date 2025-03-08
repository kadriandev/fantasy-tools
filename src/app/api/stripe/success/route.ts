import { auth } from "@/lib/auth/actions";
import { getRedisClient } from "@/lib/kv";
import { syncStripeDataToKV } from "@/lib/stripe/sync-stripe-data-to-kv";
import { redirect } from "next/navigation";

export async function GET(_: Request) {
  const user = await auth();
  if (!user) return redirect("/");

  const kv = getRedisClient();
  const stripeCustomerId = await kv.get(`user:${user.sub}:stripeCustomerId`);

  if (!stripeCustomerId) {
    return redirect("/");
  }

  await syncStripeDataToKV(stripeCustomerId);
  return redirect("/account");
}
