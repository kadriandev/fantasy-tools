/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "fantasy-tools",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const secrets = {
      YAHOO_CLIENT_ID: new sst.Secret("YAHOO_CLIENT_ID"),
      YAHOO_CLIENT_SECRET: new sst.Secret("YAHOO_CLIENT_SECRET"),
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

    new sst.x.DevCommand("Studio", {
      link: [database],
      dev: {
        command: "drizzle-kit studio",
      },
    });

    const auth = new sst.aws.Auth("MyAuth", {
      issuer: {
        handler: "auth/index.handler",
        link: [database, secrets.YAHOO_CLIENT_ID, secrets.YAHOO_CLIENT_SECRET],
      },
    });

    new sst.aws.Nextjs("MyWeb", {
      link: [
        database,
        auth,
        secrets.YAHOO_CLIENT_ID,
        secrets.YAHOO_CLIENT_SECRET,
      ],
      vpc,
    });
  },
});
