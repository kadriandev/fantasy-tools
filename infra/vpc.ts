/// <reference path="../.sst/platform/config.d.ts" />

import { isPermanentStage } from "./stage";

let vpc: sst.aws.Vpc;

if (isPermanentStage) {
  vpc = new sst.aws.Vpc("FantasyToolsVpc", {
    bastion: true,
    nat: "ec2",
  });
}

export { vpc };
