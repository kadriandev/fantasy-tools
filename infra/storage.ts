import { vpc } from "./vpc";
import { isPermanentStage } from "./stage";

export const redis = new sst.aws.Redis("RedisV2", {
  vpc,
  dev: {
    host: "localhost",
    port: 6379,
  },
});

export const database = new sst.aws.Postgres("Postgres", {
  vpc,
  dev: {
    username: "postgres",
    password: "password",
    database: "local",
    port: 5432,
  },
  password: new sst.Secret("DBPassword").value,
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
