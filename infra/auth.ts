import { secrets } from "./secret";
import { isPermanentStage } from "./stage";
import { database } from "./storage";

export const auth = new sst.aws.Auth("Auth", {
  domain: isPermanentStage
    ? {
        name: "auth.fantasy-tools.com",
        dns: sst.cloudflare.dns(),
      }
    : undefined,
  issuer: {
    handler: "auth/index.handler",
    link: [database, secrets.YAHOO_CLIENT_ID, secrets.YAHOO_CLIENT_SECRET],
  },
});
