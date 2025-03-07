import { defineConfig } from "drizzle-kit";
import { Resource } from "sst";

export default defineConfig({
  dialect: "postgresql",
  schema: ["./src/db/*.sql.ts"],
  out: "./drizzle/migrations",
  dbCredentials: {
    host: Resource.Postgres.host,
    port: Resource.Postgres.port,
    user: Resource.Postgres.username,
    password: Resource.Postgres.password,
    database: Resource.Postgres.database,
    ssl:
      Resource.App.stage === "production"
        ? { requestCert: true, rejectUnauthorized: false }
        : false,
  },
});
