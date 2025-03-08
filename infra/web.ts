import { auth } from "./auth";
import { vpc } from "./vpc";
import { allSecrets } from "./secret";
import { database, redis } from "./storage";

new sst.aws.Nextjs("Web", {
  vpc,
  domain: { name: "fantasy-tools.com", dns: sst.cloudflare.dns() },
  dev: { command: "pnpm serve" },
  link: [database, redis, auth, ...allSecrets],
});
