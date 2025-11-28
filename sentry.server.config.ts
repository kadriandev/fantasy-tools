import * as Sentry from "@sentry/nextjs";
Sentry.init({
  dsn: "https://ec717fcb7a33bf7bcecb0a0e90209b7a@o4510319943745536.ingest.us.sentry.io/4510319944728576",
  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
  // that it will also get attached to your source maps
});
