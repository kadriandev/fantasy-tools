import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createStripeCheckout } from "@/lib/stripe/create-checkout";
import { getSubTier } from "@/lib/stripe/get-sub-tier";
import { stripe } from "@/lib/stripe/stripe";
import Link from "next/link";
import { Resource } from "sst";

export default async function AccountPage() {
  const sub = await getSubTier();

  const { data: prices } = await stripe.prices.list({
    product: Resource.STRIPE_PRODUCT_ID.value,
    active: true,
  });

  const monthlyPrice = prices.find(
    (p) => p.recurring?.interval === "month",
  )?.unit_amount;

  async function createCheckout(values: FormData) {
    "use server";
    const priceId = values.get("priceId")?.toString() ?? "";
    await createStripeCheckout({ priceId });
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Subscription Plans</h2>
      <p className="uppercase">Current Tier: {sub?.status ?? "Inactive"}</p>
      <div className="mt-20 flex justify-center gap-8">
        {prices
          .sort((a, b) => a.unit_amount! - b.unit_amount!)
          .map((p) => (
            <Card key={p.id} className="min-w-1/3">
              <CardHeader>
                <CardTitle>{p.metadata.name}</CardTitle>
              </CardHeader>
              <CardContent className="h-32">
                <span className="text-5xl font-extrabold tracking-tight">
                  ${(p.unit_amount! / 100).toFixed(2)}
                </span>
                {p.recurring?.interval === "year" && (
                  <p className="mt-2 text-sm text-gray-500">
                    Billed annually (Save{" "}
                    {(
                      (((monthlyPrice! / 100) * 12 - p.unit_amount! / 100) /
                        ((monthlyPrice! / 100) * 12)) *
                      100
                    ).toFixed(0)}
                    %)
                  </p>
                )}
              </CardContent>
              <CardFooter>
                {sub?.priceId !== p.id ? (
                  <form action={createCheckout}>
                    <input type="hidden" name="priceId" value={p.id} />
                    <Button type="submit">Select Plan</Button>
                  </form>
                ) : (
                  <Link href="https://billing.stripe.com/p/login/test_6oEaFefAlfL8bZe8ww">
                    <Button variant="outline">Manage Subscription</Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
}
