/// <reference path="../.sst/platform/config.d.ts" />

export const secrets = {
  YAHOO_CLIENT_ID: new sst.Secret("YAHOO_CLIENT_ID"),
  YAHOO_CLIENT_SECRET: new sst.Secret("YAHOO_CLIENT_SECRET"),
  STRIPE_PRODUCT_ID: new sst.Secret("STRIPE_PRODUCT_ID"),
  STRIPE_PORTAL_URL: new sst.Secret("STRIPE_PORTAL_URL"),
  STRIPE_PUBLISHABLE_KEY: new sst.Secret("STRIPE_PUBLISHABLE_KEY"),
  STRIPE_SECRET_KEY: new sst.Secret("STRIPE_SECRET_KEY"),
  STRIPE_WEBHOOK_SECRET: new sst.Secret("STRIPE_WEBHOOK_SECRET"),
};

export const allSecrets = Object.values(secrets);
