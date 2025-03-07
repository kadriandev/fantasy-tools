import Stripe from "stripe";
import { getRedisClient } from "../kv";

export type STRIPE_SUB_CACHE =
  | {
      subscriptionId: string | null;
      status: Stripe.Subscription.Status;
      priceId: string | null;
      currentPeriodStart: number | null;
      currentPeriodEnd: number | null;
      cancelAtPeriodEnd: boolean;
      paymentMethod: {
        brand: string | null; // e.g., "visa", "mastercard"
        last4: string | null; // e.g., "4242"
      } | null;
    }
  | {
      status: "none";
    };

export const STRIPE_CACHE_KV = {
  generateKey(stripeCustomerId: string) {
    return `stripe:customer:${stripeCustomerId}`;
  },

  async get(stripeCustomerId: string): Promise<STRIPE_SUB_CACHE> {
    const kv = getRedisClient();
    const res = await kv.get(this.generateKey(stripeCustomerId));
    if (!res) return { status: "none" };
    return JSON.parse(res) as STRIPE_SUB_CACHE;
  },
  async set(stripeCustomerId: string, status: string) {
    const kv = getRedisClient();
    kv.set(this.generateKey(stripeCustomerId), JSON.stringify(status));
  },
};

export const STRIPE_CUSTOMER_ID_KV = {
  generateKey(userId: string) {
    return `user:${userId}:stripeCustomerId`;
  },
  async get(userId: string) {
    const kv = getRedisClient();
    return await kv.get(this.generateKey(userId));
  },
  async set(userId: string, customerId: string) {
    const kv = getRedisClient();
    kv.set(this.generateKey(userId), customerId);
  },
};

export async function getStripeSubByUserId(userId: string) {
  const stripeCustomerId = await STRIPE_CUSTOMER_ID_KV.get(userId);
  if (!stripeCustomerId) return null;

  return STRIPE_CACHE_KV.get(stripeCustomerId);
}
