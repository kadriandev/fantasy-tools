import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { Resource } from "sst";

const pool = new Pool({
  database: Resource.Postgres.database,
  host: Resource.Postgres.host,
  port: Resource.Postgres.port,
  user: Resource.Postgres.username,
  password: Resource.Postgres.password,
  ssl:
    Resource.App.stage === "production"
      ? { requestCert: true, rejectUnauthorized: false }
      : false,
});

export const db = drizzle({ client: pool });
