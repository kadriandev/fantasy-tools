import { defineConfig } from "drizzle-kit";
import { Resource } from "sst";

export default defineConfig({
  dialect: "postgresql",
  schema: ["./src/db/*.sql.ts"],
  out: "./migrations",
  dbCredentials: {
    host: Resource.MyDatabase.host,
    port: Resource.MyDatabase.port,
    user: Resource.MyDatabase.username,
    password: Resource.MyDatabase.password,
    database: Resource.MyDatabase.database,
    ssl: false,
  },
});
