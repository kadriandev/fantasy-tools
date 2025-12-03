/// <reference path="../.sst/platform/config.d.ts" />

import { isPermanentStage } from "./stage";
import { database } from "./storage";

if (!isPermanentStage) {
  new sst.x.DevCommand("Studio", {
    link: [database],
    dev: {
      command: "drizzle-kit studio",
    },
  });
  new sst.x.DevCommand("Stripe", {
    dev: {
      command: "stripe listen --forward-to localhost:3000/api/stripe",
    },
  });
  new sst.x.DevCommand("LocalDatabases", {
    dev: { command: "docker compose up" },
  });
}
