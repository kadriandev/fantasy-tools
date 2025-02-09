/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "fantasy-tools",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: { cloudflare: "5.49.0" },
    };
  },
  async run() {
    const secrets = {
      YAHOO_CLIENT_ID: new sst.Secret("YAHOO_CLIENT_ID"),
      YAHOO_CLIENT_SECRET: new sst.Secret("YAHOO_CLIENT_SECRET"),
      STRIPE_PRODUCT_ID: new sst.Secret("STRIPE_PRODUCT_ID"),
      STRIPE_PUBLISHABLE_KEY: new sst.Secret("STRIPE_PUBLISHABLE_KEY"),
      STRIPE_SECRET_KEY: new sst.Secret("STRIPE_SECRET_KEY"),
      STRIPE_WEBHOOK_SECRET: new sst.Secret("STRIPE_WEBHOOK_SECRET"),
    };
    const vpc = new sst.aws.Vpc("MyVpc", { bastion: true, nat: "ec2" });
    const database = new sst.aws.Postgres("MyDatabase", {
      vpc,
      dev: {
        username: "postgres",
        password: "password",
        database: "local",
        port: 5432,
      },
    });
    const redis = new sst.aws.Redis("MyRedis", {
      vpc,
      dev: {
        host: "localhost",
        port: 6379,
      },
    });
    const auth = new sst.aws.Auth("MyAuth", {
      domain: { name: "auth.fantasy-tools.com", dns: sst.cloudflare.dns() },
      issuer: {
        handler: "auth/index.handler",
        link: [database, secrets.YAHOO_CLIENT_ID, secrets.YAHOO_CLIENT_SECRET],
      },
    });
    new sst.aws.Nextjs("MyWeb", {
      domain: { name: "fantasy-tools.com", dns: sst.cloudflare.dns() },
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
      vpc,
    });
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
  },
});
