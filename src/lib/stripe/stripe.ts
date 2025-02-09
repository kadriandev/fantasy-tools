import Stripe from "stripe";
import { Resource } from "sst";

export const stripe = new Stripe(Resource.STRIPE_SECRET_KEY.value ?? "", {
  appInfo: {
    name: "Fantasy Tools",
    version: "0.1.0",
    url: "https:/fantasy-pro.kadriandev.com",
  },
});
