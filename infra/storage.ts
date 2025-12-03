/// <reference path="../.sst/platform/config.d.ts" />

import { isPermanentStage } from "./stage";

const vpc = sst.aws.Vpc.get("FantasyTools", "vpc-048984904903b0923");

export const redis = new sst.aws.Redis("Valkey", {
  vpc,
  engine: "valkey",
  dev: {
    host: "localhost",
    port: 6379,
  },
});

export const database =
  $app.stage === "prod"
    ? sst.aws.Postgres.get("Postgres", {
        id: "fantasy-tools-production-postgresinstance-nmddkvsn",
      })
    : new sst.aws.Postgres("Postgres", {
        vpc,
        dev: {
          username: "postgres",
          password: "password",
          database: "local",
          port: 5432,
        },
      });

if (isPermanentStage) {
  const migrator = new sst.aws.Function(
    "MigratorFn",
    {
      handler: "drizzle/migrator.handler",
      copyFiles: [
        {
          from: "drizzle/migrations",
          to: "./migrations",
        },
      ],
      timeout: "10 minutes",
      link: [database],
      vpc: vpc,
      environment: {
        USERNAME: database.username,
        PASS: database.password,
        DATABASE: database.database,
        HOST: database.host,
        // @ts-ignore
        PORT: database.port,
      },
    },
    {
      dependsOn: [database],
    },
  );
  new aws.lambda.Invocation("MigratorInvocation", {
    functionName: migrator.name,
    input: JSON.stringify({
      now: new Date().toISOString(),
    }),
  });
}
