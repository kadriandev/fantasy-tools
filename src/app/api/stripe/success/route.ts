import { auth } from "@/lib/auth/actions";
import { kv } from "@/lib/kv";
import { syncStripeDataToKV } from "@/lib/stripe/sync-stripe-data-to-kv";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  const user = await auth();
  if (!user) return redirect("/");

  const stripeCustomerId = await kv.get(
    `user:${user.properties.sub}:stripeCustomerId`,
  );

  if (!stripeCustomerId) {
    return redirect("/");
  }

  await syncStripeDataToKV(stripeCustomerId);
  return redirect("/account");
}
