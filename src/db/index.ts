import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { Resource } from "sst";

const pool = new Pool({
  database: Resource.MyDatabase.database,
  host: Resource.MyDatabase.host,
  port: Resource.MyDatabase.port,
  user: Resource.MyDatabase.username,
  password: Resource.MyDatabase.password,
  ssl: Resource.App.stage !== "kylemonteiro" ? true : false,
});

export const db = drizzle({ client: pool });
