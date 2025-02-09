"use server";

import { redirect } from "next/navigation";
import { auth } from "../auth/actions";
import { getStripeSubByUserId, STRIPE_CUSTOMER_ID_KV } from "./store";
import { stripe } from "./stripe";
import { getURL } from "../server-utils";

export async function createStripeCheckout({
  priceId,
  returnUrl = "/account",
}: {
  priceId: string;
  returnUrl?: string;
}) {
  const userInfo = await auth();
  if (!userInfo) redirect("/");

  const existingSub = await getStripeSubByUserId(userInfo.properties.sub);
  if (existingSub?.status === "active") {
    throw new Error("You already have an active subscription.");
  }

  let stripeCustomerId =
    (await STRIPE_CUSTOMER_ID_KV.get(userInfo.properties.sub)) ?? undefined;
  console.log(
    `[Stripe][CheckoutSession] Here's the stripe ID we got from KV`,
    stripeCustomerId,
  );

  if (!stripeCustomerId) {
    console.log(
      `[Stripe][CheckoutSession] No stripe ID found in KV, creating new customer.`,
    );

    const newCustomer = await stripe.customers.create({
      email: userInfo.properties.email,
      metadata: { userId: userInfo.properties.sub },
    });

    await STRIPE_CUSTOMER_ID_KV.set(userInfo.properties.sub, newCustomer.id);

    console.log(`[Stripe][CheckoutSession] CUSTOMER CREATED`, newCustomer);
    stripeCustomerId = newCustomer.id;
  }

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: getURL("/api/stripe/success"),
      cancel_url: getURL(returnUrl),
      subscription_data: {
        metadata: {
          userId: userInfo.properties.sub,
        },
      },
      customer: stripeCustomerId,
      allow_promotion_codes: true,
    });
  } catch (e) {
    console.error("Error creating checkout session:", e);
    throw new Error(
      "Failed to create checkout session. Please refresh and try again.",
    );
  }

  redirect(session.url!);
}
