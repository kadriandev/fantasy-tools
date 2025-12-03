/// <reference path="../.sst/platform/config.d.ts" />

import { isPermanentStage } from "./stage";

let vpc: sst.aws.Vpc;

if (isPermanentStage) {
  vpc = sst.aws.Vpc.get("FantasyToolsVpc", "vpc-048984904903b0923");
  // vpc = new sst.aws.Vpc("FantasyTools", {
  //   bastion: true,
  //   nat: "ec2",
  // });
}

export { vpc };
