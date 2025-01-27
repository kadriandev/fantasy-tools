/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "fantasy-toolbox",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const secrets = {
      YAHOO_CLIENT_ID: new sst.Secret("YAHOO_CLIENT_ID"),
      YAHOO_CLIENT_SECRET: new sst.Secret("YAHOO_CLIENT_SECRET")
    }

    const auth = new sst.aws.Auth("MyAuth", {
      issuer: {
        handler: "auth/index.handler",
        link: [secrets.YAHOO_CLIENT_ID, secrets.YAHOO_CLIENT_SECRET]
      }
    });

    new sst.aws.Nextjs("MyWeb", {
      link: [auth, secrets.YAHOO_CLIENT_ID, secrets.YAHOO_CLIENT_SECRET]
    });
  },
});
