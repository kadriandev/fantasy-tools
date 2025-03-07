import { auth } from "./auth";
import { vpc } from "./vpc";
import { secrets } from "./secret";
import { database, redis } from "./storage";

new sst.aws.Nextjs("Web", {
  vpc,
  domain: { name: "fantasy-tools.com", dns: sst.cloudflare.dns() },
  dev: { command: "pnpm serve" },
  link: [
    database,
    redis,
    auth,
    secrets.YAHOO_CLIENT_ID,
    secrets.YAHOO_CLIENT_SECRET,
    secrets.STRIPE_PRODUCT_ID,
    secrets.STRIPE_SECRET_KEY,
    secrets.STRIPE_PUBLISHABLE_KEY,
    secrets.STRIPE_WEBHOOK_SECRET,
  ],
});
